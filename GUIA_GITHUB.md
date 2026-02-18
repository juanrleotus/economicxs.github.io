# 🚀 Guía Completa: Subir tu Proyecto a GitHub

## 📋 Tabla de Contenidos
1. [Opción 1: Botón "Save to GitHub" (Recomendado)](#opción-1-botón-save-to-github)
2. [Opción 2: Comandos Git Manuales](#opción-2-comandos-git-manuales)
3. [Estructura del Repositorio](#estructura-del-repositorio)
4. [.gitignore Configurado](#gitignore-configurado)
5. [README para GitHub](#readme-para-github)
6. [Variables de Entorno](#variables-de-entorno)
7. [Colaboración y Buenas Prácticas](#colaboración-y-buenas-prácticas)

---

## 🎯 Opción 1: Botón "Save to GitHub" (Recomendado)

### Paso 1: Conectar GitHub
1. Ve a **Settings** → **GitHub Integration** en Emergent
2. Click en **"Connect GitHub"**
3. Autoriza el acceso a tu cuenta de GitHub
4. Selecciona qué repositorios quieres dar acceso (o todos)

### Paso 2: Crear/Seleccionar Repositorio
1. Click en el botón **"Save to GitHub"** (esquina superior derecha)
2. Opciones:
   - **Crear nuevo repositorio:**
     - Nombre: `global-news-navigator`
     - Descripción: `Mapa interactivo de diarios digitales del mundo con panel de administración`
     - Visibilidad: Public o Private
   - **Usar repositorio existente:**
     - Selecciona de la lista

### Paso 3: Primer Commit
1. Mensaje del commit: `Initial commit: Global News Navigator MVP`
2. Branch: `main` (o `master`)
3. Click **"Commit & Push"**

### Paso 4: Commits Futuros
Cada vez que hagas cambios:
1. Click **"Save to GitHub"**
2. Mensaje descriptivo: 
   - ✅ `feat: Add push notifications system`
   - ✅ `fix: Country map highlighting issue`
   - ✅ `docs: Update API documentation`
3. Click **"Commit & Push"**

---

## 💻 Opción 2: Comandos Git Manuales

### Paso 1: Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `global-news-navigator`
3. Descripción: `Interactive world map of digital newspapers`
4. **NO inicialices con README** (ya lo tenemos)
5. Click **"Create repository"**

### Paso 2: Configurar Git Localmente

```bash
# Ir al directorio del proyecto
cd /app

# Configurar git (primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@example.com"

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Global News Navigator MVP"

# Conectar con GitHub (reemplaza tu-usuario)
git remote add origin https://github.com/tu-usuario/global-news-navigator.git

# Subir código
git branch -M main
git push -u origin main
```

### Paso 3: Commits Futuros

```bash
# Ver archivos modificados
git status

# Agregar cambios específicos
git add backend/server.py
git add frontend/src/components/NewComponent.js

# O agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Add push notifications for journalists"

# Subir a GitHub
git push
```

### Comandos Útiles

```bash
# Ver historial de commits
git log --oneline

# Ver diferencias antes de commit
git diff

# Deshacer cambios no commiteados
git checkout -- archivo.js

# Crear rama nueva para feature
git checkout -b feature/notifications
git push -u origin feature/notifications

# Cambiar entre ramas
git checkout main
git checkout feature/notifications

# Merge de rama a main
git checkout main
git merge feature/notifications
git push
```

---

## 📁 Estructura del Repositorio

```
global-news-navigator/
├── .gitignore                    # ✅ Ya incluido
├── README.md                     # ✅ Ver sección abajo
├── STACK_TECNOLOGICO.md          # ✅ Ya creado
├── GUIA_MODIFICACIONES.md        # ✅ Ya creado
├── GUIA_GITHUB.md                # Este archivo
├── LICENSE                       # Opcional
│
├── backend/
│   ├── server.py
│   ├── notifications.py          # Sistema de notificaciones
│   ├── requirements.txt
│   ├── .env.example              # ⚠️ Crear (ver abajo)
│   └── .env                      # ❌ NO subir a GitHub
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── i18n.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env.example              # ⚠️ Crear (ver abajo)
│   └── .env                      # ❌ NO subir a GitHub
│
└── tests/                        # Opcional
    ├── backend/
    └── frontend/
```

---

## 🔒 .gitignore Configurado

Crea este archivo en la raíz `/app/.gitignore`:

```gitignore
# Variables de entorno (NUNCA subir a GitHub)
.env
.env.local
.env.production
*.env

# Node modules
node_modules/
frontend/node_modules/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
*.log
logs/
*.out

# Testing
.coverage
htmlcov/
.pytest_cache/

# Build output
frontend/build/
frontend/dist/

# Temporary files
*.tmp
*.bak
*.swp

# OS
Thumbs.db
.DS_Store
```

---

## 📝 README para GitHub

Crea `/app/README.md`:

```markdown
# 🗺️ Global News Navigator

> Mapa interactivo del mundo para explorar diarios digitales con panel de administración para periodistas

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

## ✨ Características

- 🗺️ **Mapa interactivo** del mundo con react-simple-maps
- 📰 **Gestión de diarios** digitales por país
- 🔐 **Panel de administración** con autenticación JWT
- 🌍 **Multiidioma** (Español/Inglés) con i18next
- 🔔 **Sistema de notificaciones** push para periodistas
- 🎨 **Diseño minimalista** profesional con Tailwind CSS
- 📱 **Responsive** y preparado para migración a app móvil

## 🚀 Demo

🔗 [Ver Demo en Vivo](https://news-by-nation.preview.emergentagent.com)

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

## 🛠️ Stack Tecnológico

### Frontend
- React 19 + React Router
- Tailwind CSS + Shadcn/UI
- react-simple-maps + Framer Motion
- Axios + i18next

### Backend
- FastAPI (Python)
- Motor (MongoDB async driver)
- JWT Authentication
- PyJWT + Bcrypt

### Base de Datos
- MongoDB

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Python 3.11+
- MongoDB 7+

### Backend

```bash
cd backend
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
uvicorn server:app --reload --port 8001
```

### Frontend

```bash
cd frontend
yarn install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu backend URL

# Iniciar desarrollo
yarn start
```

## 🌐 API Endpoints

### Autenticación
```http
POST /api/auth/login
GET  /api/auth/verify
```

### Diarios
```http
GET    /api/newspapers
GET    /api/newspapers/country/{code}
POST   /api/newspapers
PUT    /api/newspapers/{id}
DELETE /api/newspapers/{id}
```

### Países
```http
GET /api/countries
```

### Notificaciones
```http
POST /api/notifications/subscribe
GET  /api/notifications
PUT  /api/notifications/{id}/read
```

## 📱 Migración a App Móvil

Ver documentación completa en [GUIA_MODIFICACIONES.md](./GUIA_MODIFICACIONES.md#-preparación-para-app-móvil)

**Recomendación:** React Native
- Reutilizar 70% del código existente
- react-native-maps para mapa interactivo
- Push notifications nativas

## 📚 Documentación

- [Stack Tecnológico Completo](./STACK_TECNOLOGICO.md)
- [Guía de Modificaciones](./GUIA_MODIFICACIONES.md)
- [Guía de GitHub](./GUIA_GITHUB.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@example.com

## 🙏 Agradecimientos

- [react-simple-maps](https://www.react-simple-maps.io/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
```

---

## 🔐 Variables de Entorno

### Backend: `/app/backend/.env.example`

```bash
# MongoDB
MONGO_URL="mongodb://localhost:27017"
DB_NAME="news_navigator"

# Security
SECRET_KEY="change-this-to-a-secure-random-string-in-production"

# CORS
CORS_ORIGINS="*"

# Firebase (Opcional - para notificaciones móviles)
FIREBASE_SERVER_KEY=""

# Email (Opcional - para notificaciones por email)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
```

### Frontend: `/app/frontend/.env.example`

```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# WebSocket (si usas)
WDS_SOCKET_PORT=443

# Health check
ENABLE_HEALTH_CHECK=false

# Firebase (Opcional - para notificaciones web)
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
```

### ⚠️ Importante: Crear archivos .env.example

```bash
# Backend
cd /app/backend
cp .env .env.example
# Eliminar valores sensibles del .env.example

# Frontend
cd /app/frontend
cp .env .env.example
# Eliminar URLs de producción del .env.example
```

---

## 🌿 Colaboración y Buenas Prácticas

### Convención de Commits

Usa **Conventional Commits** para mensajes claros:

```bash
# Nuevas features
git commit -m "feat: Add user profile page"
git commit -m "feat(notifications): Add push notification system"

# Fixes
git commit -m "fix: Country map color not updating"
git commit -m "fix(auth): Token expiration issue"

# Documentación
git commit -m "docs: Update API documentation"
git commit -m "docs(readme): Add installation instructions"

# Refactoring
git commit -m "refactor: Simplify map component logic"

# Tests
git commit -m "test: Add unit tests for auth service"

# Chores
git commit -m "chore: Update dependencies"
git commit -m "chore(deps): Bump react to 19.0.1"
```

### Workflow de Branches

```bash
# Branch principal
main (o master)

# Branches de desarrollo
dev

# Branches de features
feature/notifications
feature/user-profiles
feature/search-functionality

# Branches de fixes
fix/map-color-bug
fix/authentication-issue

# Branches de hotfixes (producción)
hotfix/critical-security-patch
```

### Ejemplo de Workflow Completo

```bash
# 1. Crear branch para nueva feature
git checkout -b feature/push-notifications

# 2. Hacer cambios
# ... editar archivos ...

# 3. Agregar y commit
git add backend/notifications.py
git add frontend/src/components/NotificationBell.js
git commit -m "feat: Add push notification system for journalists"

# 4. Subir branch a GitHub
git push -u origin feature/push-notifications

# 5. En GitHub, crear Pull Request
# Title: "Add push notification system"
# Description: "Implements real-time notifications when newspapers are added"

# 6. Después de review y merge, actualizar main local
git checkout main
git pull origin main

# 7. Eliminar branch local (opcional)
git branch -d feature/push-notifications
```

### Tags y Releases

```bash
# Crear tag para versión
git tag -a v1.0.0 -m "Release version 1.0.0 - MVP"
git push origin v1.0.0

# Listar tags
git tag

# Ver detalles de tag
git show v1.0.0
```

### GitHub Actions (CI/CD Opcional)

Crea `.github/workflows/main.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        yarn install
    
    - name: Run tests
      run: |
        cd frontend
        yarn test
```

---

## 🔄 Mantener tu Fork Actualizado

Si alguien más está colaborando:

```bash
# Agregar repositorio original como upstream
git remote add upstream https://github.com/usuario-original/global-news-navigator.git

# Obtener cambios del upstream
git fetch upstream

# Mergear cambios a tu main
git checkout main
git merge upstream/main

# Subir a tu fork
git push origin main
```

---

## 📞 Soporte

¿Problemas para subir a GitHub?

1. **Error de autenticación:**
   - Usa Personal Access Token en lugar de contraseña
   - GitHub → Settings → Developer settings → Personal access tokens

2. **Conflicts al hacer push:**
   ```bash
   git pull origin main --rebase
   # Resolver conflictos
   git push origin main
   ```

3. **Archivo muy grande:**
   - GitHub tiene límite de 100MB por archivo
   - Usa Git LFS para archivos grandes
   ```bash
   git lfs install
   git lfs track "*.psd"
   git add .gitattributes
   ```

---

## ✅ Checklist Antes del Primer Push

- [ ] `.gitignore` configurado
- [ ] `.env.example` creado (sin valores sensibles)
- [ ] `.env` en `.gitignore`
- [ ] `README.md` completo
- [ ] Dependencias actualizadas en `requirements.txt` y `package.json`
- [ ] Código funcionando localmente
- [ ] Variables de entorno documentadas
- [ ] Credenciales de prueba removidas del código

---

¡Listo! Ahora tu código está en GitHub y puedes colaborar, hacer backups automáticos y compartir con el mundo 🚀
