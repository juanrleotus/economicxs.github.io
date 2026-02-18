# 🛠️ Guía Práctica de Modificaciones - Global News Navigator

## 📌 Casos de Uso Comunes

### 1️⃣ Agregar un Nuevo Campo a los Diarios

**Ejemplo:** Agregar campo "categoría" (política, deportes, tecnología)

#### Backend (server.py):
```python
class Newspaper(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    country_code: str
    category: str  # ⬅️ NUEVO CAMPO
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewspaperCreate(BaseModel):
    title: str
    url: str
    country_code: str
    category: str  # ⬅️ NUEVO CAMPO

class NewspaperUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    country_code: Optional[str] = None
    category: Optional[str] = None  # ⬅️ NUEVO CAMPO
```

#### Frontend (AdminDashboard.js):
```javascript
// En el formulario del Dialog, agregar:
<div className="space-y-2">
  <Label htmlFor="category">Categoría</Label>
  <Select
    value={formData.category}
    onValueChange={(value) => setFormData({ ...formData, category: value })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Seleccionar categoría" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="politics">Política</SelectItem>
      <SelectItem value="sports">Deportes</SelectItem>
      <SelectItem value="tech">Tecnología</SelectItem>
      <SelectItem value="economy">Economía</SelectItem>
    </SelectContent>
  </Select>
</div>

// En la tabla, agregar columna:
<TableHead>Categoría</TableHead>
// ...
<TableCell>{newspaper.category}</TableCell>
```

---

### 2️⃣ Agregar Filtrado por Categoría

#### Frontend (CountrySheet.js):
```javascript
const [selectedCategory, setSelectedCategory] = useState('all');

const filteredNewspapers = selectedCategory === 'all' 
  ? newspapers 
  : newspapers.filter(n => n.category === selectedCategory);

// UI:
<div className="mb-4">
  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todas las categorías</SelectItem>
      <SelectItem value="politics">Política</SelectItem>
      <SelectItem value="sports">Deportes</SelectItem>
      <SelectItem value="tech">Tecnología</SelectItem>
    </SelectContent>
  </Select>
</div>

{filteredNewspapers.map((newspaper) => (
  // ... renderizar diario
))}
```

---

### 3️⃣ Agregar Búsqueda de Diarios

#### Frontend (AdminDashboard.js):
```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredNewspapers = newspapers.filter(newspaper =>
  newspaper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  newspaper.country_code.toLowerCase().includes(searchTerm.toLowerCase())
);

// UI antes de la tabla:
<div className="mb-4">
  <Input
    placeholder="Buscar por nombre o país..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="max-w-sm"
  />
</div>

<Table>
  <TableBody>
    {filteredNewspapers.map((newspaper) => (
      // ... renderizar
    ))}
  </TableBody>
</Table>
```

---

### 4️⃣ Agregar Más Idiomas

#### Frontend (i18n.js):
```javascript
const resources = {
  en: { translation: { /* ... */ } },
  es: { translation: { /* ... */ } },
  fr: {  // ⬅️ NUEVO IDIOMA
    translation: {
      nav: {
        home: 'Accueil',
        admin: 'Panneau d\'administration',
        logout: 'Se déconnecter'
      },
      home: {
        title: 'Navigateur de Nouvelles Mondiales',
        subtitle: 'Explorez les journaux numériques du monde entier',
        clickCountry: 'Cliquez sur n\'importe quel pays pour voir les journaux'
      },
      // ... más traducciones
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr'],  // ⬅️ AGREGAR
    interpolation: {
      escapeValue: false
    }
  });
```

#### Frontend (LanguageSwitcher.js):
```javascript
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

---

### 5️⃣ Agregar Estadísticas en el Dashboard

#### Backend (server.py):
```python
@api_router.get("/stats")
async def get_statistics(username: str = Depends(verify_token)):
    total_newspapers = await db.newspapers.count_documents({})
    
    countries_count = len(await db.newspapers.distinct("country_code"))
    
    # Periódicos por categoría
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    by_category = await db.newspapers.aggregate(pipeline).to_list(100)
    
    # Top 5 países con más periódicos
    pipeline = [
        {"$group": {"_id": "$country_code", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_countries = await db.newspapers.aggregate(pipeline).to_list(5)
    
    return {
        "total_newspapers": total_newspapers,
        "countries_count": countries_count,
        "by_category": by_category,
        "top_countries": top_countries
    }
```

#### Frontend (AdminDashboard.js):
```javascript
const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/stats`,
      { headers: getAuthHeaders() }
    );
    setStats(response.data);
  };
  if (user) fetchStats();
}, [user]);

// Renderizar gráficos con recharts:
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<BarChart width={500} height={300} data={stats?.top_countries}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="_id" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="count" fill="#0f172a" />
</BarChart>
```

---

### 6️⃣ Agregar Sistema de Favoritos

#### Backend (server.py):
```python
class Favorite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    newspaper_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/favorites")
async def add_favorite(newspaper_id: str, username: str = Depends(verify_token)):
    user = await db.users.find_one({"username": username}, {"_id": 0})
    favorite = Favorite(user_id=user['id'], newspaper_id=newspaper_id)
    doc = favorite.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.favorites.insert_one(doc)
    return {"message": "Added to favorites"}

@api_router.get("/favorites")
async def get_favorites(username: str = Depends(verify_token)):
    user = await db.users.find_one({"username": username}, {"_id": 0})
    favorites = await db.favorites.find({"user_id": user['id']}, {"_id": 0}).to_list(1000)
    
    # Obtener detalles de los periódicos
    newspaper_ids = [f['newspaper_id'] for f in favorites]
    newspapers = await db.newspapers.find({"id": {"$in": newspaper_ids}}, {"_id": 0}).to_list(1000)
    return newspapers

@api_router.delete("/favorites/{newspaper_id}")
async def remove_favorite(newspaper_id: str, username: str = Depends(verify_token)):
    user = await db.users.find_one({"username": username}, {"_id": 0})
    await db.favorites.delete_one({"user_id": user['id'], "newspaper_id": newspaper_id})
    return {"message": "Removed from favorites"}
```

#### Frontend (CountrySheet.js):
```javascript
const [favorites, setFavorites] = useState(new Set());

const toggleFavorite = async (newspaperId) => {
  if (favorites.has(newspaperId)) {
    await axios.delete(
      `${BACKEND_URL}/api/favorites/${newspaperId}`,
      { headers: getAuthHeaders() }
    );
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(newspaperId);
      return newSet;
    });
  } else {
    await axios.post(
      `${BACKEND_URL}/api/favorites`,
      { newspaper_id: newspaperId },
      { headers: getAuthHeaders() }
    );
    setFavorites(prev => new Set([...prev, newspaperId]));
  }
};

// En el renderizado:
<Button
  variant="ghost"
  onClick={() => toggleFavorite(newspaper.id)}
>
  <Heart className={favorites.has(newspaper.id) ? "fill-red-500" : ""} />
</Button>
```

---

### 7️⃣ Agregar Paginación en el Dashboard

#### Frontend (AdminDashboard.js):
```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedNewspapers = newspapers.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const totalPages = Math.ceil(newspapers.length / itemsPerPage);

// Después de la tabla:
<div className="flex justify-center gap-2 mt-4">
  <Button
    variant="outline"
    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
  >
    Anterior
  </Button>
  
  <span className="py-2 px-4">
    Página {currentPage} de {totalPages}
  </span>
  
  <Button
    variant="outline"
    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
    disabled={currentPage === totalPages}
  >
    Siguiente
  </Button>
</div>
```

---

### 8️⃣ Agregar Sistema de Roles (Admin, Editor, Viewer)

#### Backend (server.py):
```python
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"

class User(BaseModel):
    id: str
    username: str
    password_hash: str
    role: UserRole = UserRole.VIEWER  # ⬅️ NUEVO CAMPO
    created_at: datetime

def require_role(required_role: UserRole):
    def role_checker(username: str = Depends(verify_token)):
        user = await db.users.find_one({"username": username}, {"_id": 0})
        if not user or UserRole(user['role']) != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return username
    return role_checker

# Proteger endpoints:
@api_router.delete("/newspapers/{newspaper_id}")
async def delete_newspaper(
    newspaper_id: str,
    username: str = Depends(require_role(UserRole.ADMIN))
):
    # Solo admins pueden eliminar
    pass

@api_router.post("/newspapers")
async def create_newspaper(
    newspaper_data: NewspaperCreate,
    username: str = Depends(require_role(UserRole.EDITOR))
):
    # Editores y admins pueden crear
    pass
```

---

### 9️⃣ Agregar Notificaciones Push (para móvil futuro)

#### Backend (server.py):
```python
class PushToken(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token: str
    device_type: str  # 'ios' | 'android'
    created_at: datetime

@api_router.post("/push-tokens")
async def register_push_token(token: str, device_type: str, username: str = Depends(verify_token)):
    user = await db.users.find_one({"username": username}, {"_id": 0})
    push_token = PushToken(user_id=user['id'], token=token, device_type=device_type)
    doc = push_token.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.push_tokens.insert_one(doc)
    return {"message": "Token registered"}

# Para enviar notificaciones, usar:
# - Firebase Cloud Messaging (FCM)
# - Apple Push Notification service (APNs)
```

---

### 🔟 Optimizar Carga del Mapa

#### Frontend (WorldMap.js):
```javascript
import { memo } from 'react';

// Memorizar geografías para evitar re-renders
const MemoizedGeography = memo(Geography);

// Virtualización si tienes muchos países
import { FixedSizeList } from 'react-window';

// Lazy loading del TopoJSON
const [geoData, setGeoData] = useState(null);

useEffect(() => {
  fetch(geoUrl)
    .then(response => response.json())
    .then(data => setGeoData(data));
}, []);

if (!geoData) return <LoadingSpinner />;

return (
  <ComposableMap>
    <Geographies geography={geoData}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <MemoizedGeography key={geo.rsmKey} geography={geo} {...props} />
        ))
      }
    </Geographies>
  </ComposableMap>
);
```

---

## 🔧 Debugging Tips

### Ver logs del backend:
```bash
tail -f /var/log/supervisor/backend.*.log
```

### Ver logs del frontend:
```bash
tail -f /var/log/supervisor/frontend.*.log
```

### Probar API directamente:
```bash
# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Obtener diarios
curl https://your-domain.com/api/newspapers
```

### Limpiar base de datos:
```javascript
// Conectar a MongoDB
mongosh mongodb://localhost:27017/test_database

// Eliminar todos los diarios
db.newspapers.deleteMany({})

// Eliminar todos los usuarios
db.users.deleteMany({})
```

---

## 🚀 Deploy a Producción

### Opción 1: Docker
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=news_navigator
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Opción 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd /app/frontend
vercel --prod
```

**Backend (Railway):**
1. Conectar repositorio GitHub
2. Railway detecta FastAPI automáticamente
3. Configurar variables de entorno
4. Deploy automático

---

## 📱 Preparación para App Móvil

### Crear estructura React Native:
```bash
npx react-native init GlobalNewsNavigatorMobile
cd GlobalNewsNavigatorMobile
```

### Instalar dependencias necesarias:
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-maps
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-reanimated
npm install i18n-js
```

### Reutilizar lógica:
- AuthContext.js ✅ (solo cambiar AsyncStorage)
- countryHelpers.js ✅
- i18n.js ✅ (adaptar a i18n-js)
- Llamadas API ✅

---

## 🎯 Roadmap Sugerido

### Fase 1 (actual): Web MVP ✅
- Mapa interactivo
- CRUD de diarios
- Autenticación básica
- Multiidioma

### Fase 2: Mejoras Web
- [ ] Sistema de favoritos
- [ ] Búsqueda avanzada
- [ ] Estadísticas y gráficos
- [ ] Exportar a CSV/PDF
- [ ] Sistema de roles (Admin/Editor/Viewer)

### Fase 3: Funciones Premium
- [ ] RSS feeds integrados
- [ ] Notificaciones de nuevos diarios
- [ ] Modo offline
- [ ] Bookmarks y notas personales

### Fase 4: App Móvil
- [ ] React Native iOS/Android
- [ ] Push notifications
- [ ] Share functionality
- [ ] Geolocalización para sugerir diarios locales

### Fase 5: Monetización
- [ ] Suscripción premium
- [ ] API pública para desarrolladores
- [ ] Publicidad no intrusiva

---

¿Necesitas ayuda con alguna implementación específica? ¡Pregúntame!
