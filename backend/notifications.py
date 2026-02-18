"""Sistema de notificaciones push para periodistas"""
import os
import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
import uuid

logger = logging.getLogger(__name__)

class PushToken(BaseModel):
    """Token de dispositivo para notificaciones push"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token: str
    device_type: str  # 'web', 'ios', 'android'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Subscription(BaseModel):
    """Suscripción de usuario a países específicos"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    country_codes: List[str]  # ['ESP', 'USA', 'GBR']
    notify_new_newspapers: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Notification(BaseModel):
    """Registro de notificación enviada"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    body: str
    data: Dict[str, Any] = {}
    sent_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

class WebPushManager:
    """Gestor de notificaciones push para web"""
    
    def __init__(self, db):
        self.db = db
    
    async def register_token(self, user_id: str, token: str, device_type: str):
        """Registrar token de dispositivo"""
        # Verificar si el token ya existe
        existing = await self.db.push_tokens.find_one({"token": token}, {"_id": 0})
        if existing:
            return existing
        
        push_token = PushToken(
            user_id=user_id,
            token=token,
            device_type=device_type
        )
        doc = push_token.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await self.db.push_tokens.insert_one(doc)
        return push_token
    
    async def subscribe_to_countries(self, user_id: str, country_codes: List[str]):
        """Suscribir usuario a países específicos"""
        existing = await self.db.subscriptions.find_one({"user_id": user_id}, {"_id": 0})
        
        if existing:
            # Actualizar suscripción existente
            await self.db.subscriptions.update_one(
                {"user_id": user_id},
                {"$set": {"country_codes": country_codes}}
            )
            existing['country_codes'] = country_codes
            return Subscription(**existing)
        else:
            # Crear nueva suscripción
            subscription = Subscription(
                user_id=user_id,
                country_codes=country_codes
            )
            doc = subscription.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await self.db.subscriptions.insert_one(doc)
            return subscription
    
    async def get_user_subscriptions(self, user_id: str):
        """Obtener suscripciones de usuario"""
        subscription = await self.db.subscriptions.find_one({"user_id": user_id}, {"_id": 0})
        if subscription:
            return Subscription(**subscription)
        return None
    
    async def notify_new_newspaper(self, newspaper_data: Dict[str, Any]):
        """Notificar a usuarios suscritos cuando se agrega un nuevo diario"""
        country_code = newspaper_data.get('country_code')
        newspaper_title = newspaper_data.get('title')
        
        # Encontrar usuarios suscritos a este país
        subscriptions = await self.db.subscriptions.find(
            {"country_codes": country_code, "notify_new_newspapers": True},
            {"_id": 0}
        ).to_list(1000)
        
        notifications_sent = 0
        
        for sub in subscriptions:
            user_id = sub['user_id']
            
            # Crear registro de notificación
            notification = Notification(
                user_id=user_id,
                title=f"Nuevo diario en {country_code}",
                body=f"Se agregó '{newspaper_title}' a la lista de diarios de {country_code}",
                data={
                    "type": "new_newspaper",
                    "country_code": country_code,
                    "newspaper_id": newspaper_data.get('id')
                }
            )
            
            doc = notification.model_dump()
            doc['sent_at'] = doc['sent_at'].isoformat()
            await self.db.notifications.insert_one(doc)
            
            # Aquí se integraría con FCM para móvil o Web Push API para web
            # Por ahora solo registramos la notificación
            logger.info(f"Notificación creada para usuario {user_id}: {notification.title}")
            notifications_sent += 1
        
        return {
            "notifications_sent": notifications_sent,
            "country_code": country_code
        }
    
    async def get_user_notifications(self, user_id: str, limit: int = 50):
        """Obtener notificaciones de usuario"""
        notifications = await self.db.notifications.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("sent_at", -1).limit(limit).to_list(limit)
        
        for notif in notifications:
            if isinstance(notif['sent_at'], str):
                notif['sent_at'] = datetime.fromisoformat(notif['sent_at'])
        
        return [Notification(**n) for n in notifications]
    
    async def mark_as_read(self, notification_id: str):
        """Marcar notificación como leída"""
        await self.db.notifications.update_one(
            {"id": notification_id},
            {"$set": {"read": True}}
        )

class FirebaseManager:
    """Gestor de Firebase Cloud Messaging (para futuro móvil)"""
    
    def __init__(self):
        self.fcm_key = os.environ.get('FIREBASE_SERVER_KEY')
        self.enabled = bool(self.fcm_key)
    
    async def send_to_device(self, token: str, title: str, body: str, data: Dict = None):
        """Enviar notificación a dispositivo específico"""
        if not self.enabled:
            logger.warning("Firebase no configurado, notificación no enviada")
            return False
        
        # Implementar llamada a FCM API
        # https://firebase.google.com/docs/cloud-messaging/send-message
        
        # Por ahora es un placeholder para implementación futura
        logger.info(f"[FCM] Enviando a {token}: {title}")
        return True
    
    async def send_to_topic(self, topic: str, title: str, body: str, data: Dict = None):
        """Enviar notificación a tópico (ej: país específico)"""
        if not self.enabled:
            logger.warning("Firebase no configurado, notificación no enviada")
            return False
        
        logger.info(f"[FCM] Enviando a tópico {topic}: {title}")
        return True
