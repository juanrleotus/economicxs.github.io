from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
from notifications import WebPushManager, Subscription, Notification

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Inicializar gestor de notificaciones
push_manager = WebPushManager(db)

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Newspaper(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    country_code: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewspaperCreate(BaseModel):
    title: str
    url: str
    country_code: str

class NewspaperUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    country_code: Optional[str] = None

class CountryInfo(BaseModel):
    country_code: str
    newspaper_count: int

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    user = await db.users.find_one({"username": user_login.username}, {"_id": 0})
    
    if not user:
        default_password = "admin123"
        if user_login.username == "admin" and user_login.password == default_password:
            password_hash = pwd_context.hash(default_password)
            new_user = User(username="admin", password_hash=password_hash)
            doc = new_user.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.users.insert_one(doc)
            access_token = create_access_token(data={"sub": user_login.username})
            return {"access_token": access_token, "token_type": "bearer"}
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(user_login.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user_login.username})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/verify")
async def verify_auth(username: str = Depends(verify_token)):
    return {"username": username}

@api_router.get("/newspapers", response_model=List[Newspaper])
async def get_all_newspapers():
    newspapers = await db.newspapers.find({}, {"_id": 0}).to_list(1000)
    for newspaper in newspapers:
        if isinstance(newspaper['created_at'], str):
            newspaper['created_at'] = datetime.fromisoformat(newspaper['created_at'])
    return newspapers

@api_router.get("/newspapers/country/{country_code}", response_model=List[Newspaper])
async def get_newspapers_by_country(country_code: str):
    newspapers = await db.newspapers.find({"country_code": country_code}, {"_id": 0}).to_list(1000)
    for newspaper in newspapers:
        if isinstance(newspaper['created_at'], str):
            newspaper['created_at'] = datetime.fromisoformat(newspaper['created_at'])
    return newspapers

@api_router.post("/newspapers", response_model=Newspaper)
async def create_newspaper(newspaper_data: NewspaperCreate, username: str = Depends(verify_token)):
    newspaper = Newspaper(**newspaper_data.model_dump())
    doc = newspaper.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.newspapers.insert_one(doc)
    
    # Enviar notificaciones a usuarios suscritos
    await push_manager.notify_new_newspaper(doc)
    
    return newspaper

@api_router.put("/newspapers/{newspaper_id}", response_model=Newspaper)
async def update_newspaper(newspaper_id: str, newspaper_data: NewspaperUpdate, username: str = Depends(verify_token)):
    existing = await db.newspapers.find_one({"id": newspaper_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Newspaper not found")
    
    update_data = {k: v for k, v in newspaper_data.model_dump().items() if v is not None}
    if update_data:
        await db.newspapers.update_one({"id": newspaper_id}, {"$set": update_data})
    
    updated = await db.newspapers.find_one({"id": newspaper_id}, {"_id": 0})
    if isinstance(updated['created_at'], str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return Newspaper(**updated)

@api_router.delete("/newspapers/{newspaper_id}")
async def delete_newspaper(newspaper_id: str, username: str = Depends(verify_token)):
    result = await db.newspapers.delete_one({"id": newspaper_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Newspaper not found")
    return {"message": "Newspaper deleted successfully"}

@api_router.get("/countries", response_model=List[CountryInfo])
async def get_countries_with_newspapers():
    pipeline = [
        {"$group": {"_id": "$country_code", "count": {"$sum": 1}}},
        {"$project": {"_id": 0, "country_code": "$_id", "newspaper_count": "$count"}}
    ]
    countries = await db.newspapers.aggregate(pipeline).to_list(1000)
    return countries

# Endpoints de Notificaciones

class SubscriptionRequest(BaseModel):
    country_codes: List[str]

@api_router.post("/notifications/subscribe", response_model=Subscription)
async def subscribe_to_countries(request: SubscriptionRequest, username: str = Depends(verify_token)):
    """Suscribirse a notificaciones de países específicos"""
    user = await db.users.find_one({"username": username}, {"_id": 0})
    subscription = await push_manager.subscribe_to_countries(user['id'], request.country_codes)
    return subscription

@api_router.get("/notifications/subscription")
async def get_user_subscription(username: str = Depends(verify_token)):
    """Obtener suscripciones del usuario"""
    user = await db.users.find_one({"username": username}, {"_id": 0})
    subscription = await push_manager.get_user_subscriptions(user['id'])
    if subscription:
        return subscription
    return {"country_codes": [], "notify_new_newspapers": True}

@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(limit: int = 50, username: str = Depends(verify_token)):
    """Obtener notificaciones del usuario"""
    user = await db.users.find_one({"username": username}, {"_id": 0})
    notifications = await push_manager.get_user_notifications(user['id'], limit)
    return notifications

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_as_read(notification_id: str, username: str = Depends(verify_token)):
    """Marcar notificación como leída"""
    await push_manager.mark_as_read(notification_id)
    return {"message": "Notification marked as read"}

@api_router.get("/notifications/unread-count")
async def get_unread_count(username: str = Depends(verify_token)):
    """Obtener cantidad de notificaciones no leídas"""
    user = await db.users.find_one({"username": username}, {"_id": 0})
    count = await db.notifications.count_documents({"user_id": user['id'], "read": False})
    return {"count": count}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()