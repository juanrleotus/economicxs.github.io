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
GET  /api/notifications/subscription
GET  /api/notifications
PUT  /api/notifications/{id}/read
GET  /api/notifications/unread-count
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

**Juan B. Rojas**
- GitHub: [@tu-usuario](https://github.com/juanrleotus)
- Email: prof.juanrleotus@gmail.com

## 🙏 Agradecimientos

- [react-simple-maps](https://www.react-simple-maps.io/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
