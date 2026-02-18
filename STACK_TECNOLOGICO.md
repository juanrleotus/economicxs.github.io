# 📱 Stack Tecnológico - Global News Navigator

## 🎯 Visión General
Aplicación web full-stack para explorar diarios digitales de todo el mundo mediante un mapa interactivo, con panel de administración para gestionar contenido.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 19 + React Router + Tailwind CSS + Shadcn/UI        │
│  react-simple-maps + i18next (multiidioma)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ API REST (HTTPS)
                       │ axios
┌──────────────────────▼──────────────────────────────────────┐
│                        BACKEND                               │
│  FastAPI (Python) + Motor (async MongoDB driver)            │
│  JWT Authentication + Pydantic validation                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                       DATABASE                               │
│                    MongoDB Atlas                             │
│         Collections: newspapers, users, status_checks        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 FRONTEND

### Tecnologías Principales

#### **React 19.0.0**
- Framework principal para la UI
- Hooks utilizados: `useState`, `useEffect`, `useContext`
- Motivo: Ecosistema robusto, gran comunidad, ideal para SPAs

#### **React Router DOM 7.5.1**
- Navegación entre páginas
- Rutas principales:
  - `/` - Mapa principal
  - `/admin/login` - Login de administrador
  - `/admin/dashboard` - Panel de administración

#### **Tailwind CSS 3.4.17**
- Framework de utilidades CSS
- Configuración personalizada en `tailwind.config.js`
- Sistema de diseño minimalista profesional

#### **Shadcn/UI**
- Componentes UI reutilizables basados en Radix UI
- Componentes usados:
  - `Sheet` - Panel lateral deslizante
  - `Dialog` - Modales
  - `AlertDialog` - Confirmaciones
  - `Table` - Tablas de datos
  - `Button`, `Input`, `Label` - Formularios
  - `Sonner` - Notificaciones toast

### Librerías Especializadas

#### **react-simple-maps 3.0.0**
```javascript
// Biblioteca para mapas interactivos SVG
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// TopoJSON usado:
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
```
- Proyección: Mercator
- Eventos: onClick, onMouseEnter, onMouseLeave
- Estilos dinámicos según estado (hover, pressed)

#### **d3-scale 4.0.2**
- Dependencia de react-simple-maps
- Escalado y transformaciones del mapa

#### **Framer Motion 12.34.0**
```javascript
// Animaciones fluidas
import { motion } from 'framer-motion';

// Ejemplo de uso:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```
- Transiciones de página
- Animaciones de entrada/salida
- Animaciones de hover

#### **react-i18next 16.5.4 + i18next 25.8.7**
```javascript
// Internacionalización (Español/Inglés)
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Uso:
t('home.title') // "Navegador Global de Noticias" o "Global News Navigator"
i18n.changeLanguage('en'); // Cambiar idioma
```

#### **Axios 1.8.4**
```javascript
// Cliente HTTP para llamadas API
import axios from 'axios';

const response = await axios.get(`${BACKEND_URL}/api/newspapers`);
```

#### **Lucide React 0.507.0**
- Iconos SVG modernos
- Iconos usados: Globe, LogOut, Plus, Edit, Trash2, Newspaper, Settings, etc.

### Estructura de Archivos Frontend

```
/app/frontend/
├── public/                      # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── ui/                  # Componentes Shadcn/UI
│   │   │   ├── sheet.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── table.jsx
│   │   │   ├── alert-dialog.jsx
│   │   │   └── sonner.jsx
│   │   ├── WorldMap.js          # Mapa interactivo
│   │   ├── CountrySheet.js      # Panel de periódicos por país
│   │   └── LanguageSwitcher.js  # Selector de idioma
│   ├── pages/
│   │   ├── Home.js              # Página principal
│   │   ├── AdminLogin.js        # Login
│   │   └── AdminDashboard.js    # Panel admin
│   ├── contexts/
│   │   └── AuthContext.js       # Context para autenticación
│   ├── utils/
│   │   └── countryHelpers.js    # Mapeo códigos país ↔ nombres
│   ├── App.js                   # Componente raíz + rutas
│   ├── index.js                 # Entry point
│   ├── i18n.js                  # Configuración multiidioma
│   ├── App.css                  # Estilos globales
│   └── index.css                # Tailwind + variables CSS
├── package.json                 # Dependencias
├── tailwind.config.js           # Config Tailwind
└── .env                         # Variables de entorno
```

### Variables de Entorno Frontend

```bash
# /app/frontend/.env
REACT_APP_BACKEND_URL=https://news-by-nation.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## ⚙️ BACKEND

### Tecnologías Principales

#### **FastAPI (Python 3.11)**
```python
# Framework web moderno y rápido
from fastapi import FastAPI, APIRouter, HTTPException, Depends

app = FastAPI()
api_router = APIRouter(prefix="/api")
```
- Validación automática con Pydantic
- Documentación automática (Swagger)
- Soporte async/await nativo
- Alto rendimiento

#### **Motor 3.x (Async MongoDB Driver)**
```python
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
```
- Driver asíncrono para MongoDB
- Compatible con FastAPI

#### **Pydantic 2.x**
```python
from pydantic import BaseModel, Field, ConfigDict

class Newspaper(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignora _id de MongoDB
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    country_code: str
    created_at: datetime
```
- Validación de datos
- Serialización automática

#### **PyJWT 2.11.0**
```python
import jwt

def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=1440)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```
- Autenticación JWT
- Tokens expiran en 24 horas

#### **Passlib[bcrypt] 1.7.4**
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
password_hash = pwd_context.hash("admin123")

# Verificar
pwd_context.verify(plain_password, password_hash)
```
- Hashing seguro de contraseñas
- Algoritmo bcrypt

### API Endpoints

#### **Autenticación**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

```http
GET /api/auth/verify
Authorization: Bearer <token>

Response:
{
  "username": "admin"
}
```

#### **Diarios (Newspapers)**

```http
# Obtener todos los diarios
GET /api/newspapers

Response:
[
  {
    "id": "uuid-here",
    "title": "El País",
    "url": "https://elpais.com",
    "country_code": "ESP",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

```http
# Obtener diarios por país
GET /api/newspapers/country/{country_code}

Response: Array de diarios
```

```http
# Crear diario (requiere auth)
POST /api/newspapers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Guardian",
  "url": "https://theguardian.com",
  "country_code": "GBR"
}
```

```http
# Actualizar diario (requiere auth)
PUT /api/newspapers/{newspaper_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "El País - Updated",
  "url": "https://elpais.com",
  "country_code": "ESP"
}
```

```http
# Eliminar diario (requiere auth)
DELETE /api/newspapers/{newspaper_id}
Authorization: Bearer <token>
```

#### **Países**

```http
# Obtener países con diarios
GET /api/countries

Response:
[
  {
    "country_code": "ESP",
    "newspaper_count": 2
  },
  {
    "country_code": "GBR",
    "newspaper_count": 1
  }
]
```

### Estructura Backend

```
/app/backend/
├── server.py          # Aplicación principal FastAPI
├── requirements.txt   # Dependencias Python
└── .env              # Variables de entorno
```

### Variables de Entorno Backend

```bash
# /app/backend/.env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
SECRET_KEY="your-secret-key-change-in-production"
```

### Modelos de Datos

```python
# User Model
class User(BaseModel):
    id: str
    username: str
    password_hash: str
    created_at: datetime

# Newspaper Model
class Newspaper(BaseModel):
    id: str
    title: str
    url: str
    country_code: str  # Código ISO-3 (ESP, GBR, USA, etc.)
    created_at: datetime

# Country Info (agregado)
class CountryInfo(BaseModel):
    country_code: str
    newspaper_count: int
```

---

## 🗄️ BASE DE DATOS

### MongoDB

**Colecciones:**

#### **newspapers**
```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-string",
  "title": "El País",
  "url": "https://elpais.com",
  "country_code": "ESP",
  "created_at": "2025-01-15T10:30:00.000Z"
}
```

#### **users**
```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-string",
  "username": "admin",
  "password_hash": "$2b$12$...",
  "created_at": "2025-01-15T10:00:00.000Z"
}
```

**Índices recomendados para producción:**
```javascript
// newspapers collection
db.newspapers.createIndex({ "country_code": 1 })
db.newspapers.createIndex({ "id": 1 }, { unique: true })

// users collection
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "id": 1 }, { unique: true })
```

---

## 🎨 Sistema de Diseño

### Tipografía

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700&display=swap');

/* Uso */
h1, h2, h3 { font-family: 'Playfair Display', serif; }
body { font-family: 'Inter', sans-serif; }
code { font-family: 'JetBrains Mono', monospace; }
```

### Paleta de Colores

```css
/* Tailwind CSS variables */
:root {
  --primary: 222.2 47.4% 11.2%;        /* Slate 900 - #0f172a */
  --secondary: 210 40% 96.1%;          /* Slate 50 - #f1f5f9 */
  --accent: 0 84.2% 60.2%;            /* Red 600 - #dc2626 */
  --background: 0 0% 100%;             /* White */
  --foreground: 222.2 84% 4.9%;       /* Almost black */
}
```

---

## 📦 Dependencias Completas

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "react-simple-maps": "^3.0.0",
    "d3-scale": "^4.0.2",
    "framer-motion": "^12.34.0",
    "react-i18next": "^16.5.4",
    "i18next": "^25.8.7",
    "axios": "^1.8.4",
    "lucide-react": "^0.507.0",
    "@radix-ui/react-dialog": "^1.1.11",
    "@radix-ui/react-label": "^2.1.4",
    "@radix-ui/react-slot": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0",
    "tailwindcss-animate": "^1.0.7",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

### Backend (requirements.txt)

```txt
fastapi==0.115.6
motor==3.7.0
pydantic==2.11.1
PyJWT==2.11.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
starlette==0.45.1
uvicorn==0.34.0
```

---

## 🚀 Comandos de Desarrollo

### Frontend
```bash
cd /app/frontend

# Instalar dependencias
yarn install

# Iniciar desarrollo (puerto 3000)
yarn start

# Build para producción
yarn build
```

### Backend
```bash
cd /app/backend

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor (puerto 8001)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

---

## 📱 MIGRACIÓN A APP MÓVIL - Recomendaciones

### Opción 1: React Native (Recomendada)

**Ventajas:**
- Reutilizar lógica de React existente
- Componentes similares
- Gran comunidad

**Cambios necesarios:**
1. **Mapa interactivo:** Reemplazar `react-simple-maps` por:
   - `react-native-maps` (Google Maps / Apple Maps)
   - `react-native-svg` + custom SVG maps
   
2. **Navegación:** Reemplazar React Router por:
   - `@react-navigation/native`

3. **UI Components:** Reemplazar Shadcn/UI por:
   - `react-native-paper`
   - `@rneui/themed` (React Native Elements)
   
4. **Animaciones:** Reemplazar Framer Motion por:
   - `react-native-reanimated`

5. **Storage:** Agregar:
   - `@react-native-async-storage/async-storage` (tokens JWT)

**Estructura React Native sugerida:**
```
/mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Mapa
│   │   ├── LoginScreen.js     # Login
│   │   └── AdminScreen.js     # Admin
│   ├── components/
│   │   ├── WorldMap.js        # Con react-native-maps
│   │   └── CountrySheet.js    # Bottom sheet
│   ├── contexts/
│   │   └── AuthContext.js     # Reutilizable
│   └── utils/
│       └── api.js             # Axios config
└── package.json
```

### Opción 2: Flutter

**Ventajas:**
- Rendimiento nativo
- UI consistente cross-platform

**Desventajas:**
- Requiere reescribir todo en Dart
- Curva de aprendizaje

### Opción 3: Progressive Web App (PWA)

**Ventajas:**
- Cero cambios en código actual
- Funciona en iOS/Android
- Instalable desde navegador

**Cambios mínimos:**
1. Agregar `manifest.json`
2. Implementar Service Worker
3. Optimizar para touch
4. Add to homescreen

---

## 🔐 Seguridad

### Implementadas:
- ✅ JWT tokens con expiración
- ✅ Bcrypt para contraseñas
- ✅ CORS configurado
- ✅ Pydantic validation
- ✅ HTTPS en producción

### Recomendaciones futuras:
- 🔄 Rate limiting (FastAPI Limiter)
- 🔄 Refresh tokens
- 🔄 OAuth2 (Google, Facebook)
- 🔄 RBAC (roles: admin, editor, viewer)
- 🔄 Input sanitization adicional
- 🔄 Helmet para headers HTTP

---

## 📊 Escalabilidad

### Base de datos:
- MongoDB Atlas soporta sharding
- Índices optimizados
- Replicación automática

### Backend:
- FastAPI es async (miles de conexiones concurrentes)
- Stateless (fácil horizontal scaling)
- Deploy con Docker + Kubernetes

### Frontend:
- CDN para assets estáticos
- Code splitting automático
- Lazy loading de rutas

---

## 🧪 Testing

### Backend:
```bash
pytest tests/
```

### Frontend:
```bash
yarn test
```

---

## 📝 Credenciales por Defecto

```
Usuario: admin
Contraseña: admin123
```

⚠️ **CAMBIAR EN PRODUCCIÓN**

---

## 🔗 URLs Importantes

- **Documentación API (Swagger):** `https://your-domain.com/docs`
- **Documentación alternativa (ReDoc):** `https://your-domain.com/redoc`
- **Frontend:** `https://your-domain.com`
- **Panel Admin:** `https://your-domain.com/admin/dashboard`

---

## 📚 Recursos de Aprendizaje

### React:
- https://react.dev/
- https://react-router.com/

### FastAPI:
- https://fastapi.tiangolo.com/
- https://motor.readthedocs.io/

### MongoDB:
- https://www.mongodb.com/docs/

### React Native (para móvil):
- https://reactnative.dev/
- https://reactnavigation.org/

---

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. **Nuevo endpoint backend:**
   - Agregar en `server.py`
   - Crear modelo Pydantic
   - Documentar en este archivo

2. **Nueva página frontend:**
   - Crear en `src/pages/`
   - Agregar ruta en `App.js`
   - Agregar traducciones en `i18n.js`

3. **Nuevo componente:**
   - Crear en `src/components/`
   - Seguir patrón de diseño existente

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
