# 🏟️ FurbitAll

**FurbitAll** es una aplicación web desarrollada con el stack **MERN (MongoDB, Express, React, Node.js)** que permite a los usuarios **reservar canchas deportivas** y **comprar equipamiento de fútbol** de manera simple, rápida y transparente.

---

## ✨ Características principales

- 🔑 **Autenticación JWT**: Registro e inicio de sesión seguro para clientes y administradores.
- 🛍️ **E-commerce de productos**: CRUD de productos con gestión de stock.
- 📅 **Sistema de reservas**: CRUD de reservas con validaciones (fechas pasadas, máximo 3 reservas/día, sin solapamientos, cancelación/edición).
- ⚙️ **Panel de administración**: Gestión de productos, canchas y reservas mediante tablas y modales reutilizables.
- 🎨 **Frontend moderno y responsive** con **React-Bootstrap**.
- 📰 **Publicidad dinámica** con carrusel en la página de inicio.
- 🛒 **Carrito y checkout simulado** con persistencia en localStorage.
- 📡 **Backend robusto** con validaciones y middlewares de seguridad.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** React, React-Bootstrap, React Router
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB (Atlas)
- **Autenticación:** JWT + bcrypt
- **Deploy (frontend):** Netlify
- **Deploy (backend):** Render/Railway (pendiente)

---

## 🚀 Instalación y ejecución en local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/furbitall.git
   ```
2. Instalar Frontend:

cd furbitAll-frontend
npm install

3. Instalar Backend:

cd ../furbitAll-backend
npm install

4. Ejecutar Backend/Frontend:
   npm run dev
   Desarrollado por José Manuel Carrasco Rivero
