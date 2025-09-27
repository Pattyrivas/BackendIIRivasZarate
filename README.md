# Backend II — Ecommerce API (Repository, DTOs, Roles, Password Reset)

Proyecto de backend con Node.js, Express y MongoDB que implementa:
- **Patron Repository** sobre DAOs de Mongoose
- **Autenticación JWT** por cookie (`jwt`) con Passport
- **Autorización por roles** (admin/user) mediante middlewares
- **DTO de usuario** en `/api/sessions/current` (sin datos sensibles)
- **Recuperación de contraseña por email** con **expiración de 1 hora** y bloqueo de reutilización
- **Lógica de compra** con verificación de stock y **Ticket**


---

## 🧱 Stack
- Node.js 18+
- Express 4
- Mongoose 8
- Passport (local + JWT)
- Nodemailer
- Handlebars (vistas de demo)

---

## 🚀 Cómo ejecutar

1. **Instalar dependencias**
```bash
npm install
```

2. **Variables de entorno**
Copia `.env.example` a `.env` y completa valores reales:
```env
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce
JWT_SECRET=supersecretJWT
PORT=8080
FRONT_URL=http://localhost:8080

## Configuración de correo

El proyecto soporta **dos proveedores** para el envío de correos de recuperación:

### Gmail (producción)
1. Activa la verificación en dos pasos en tu cuenta Google.
2. Genera una [Contraseña de aplicación](https://myaccount.google.com/apppasswords).
3. Configura en `.env`:
   ```env
   MAIL_PROVIDER=gmail
   MAIL_USER=tu_correo@gmail.com
   MAIL_PASS=la_app_password_de_16_digitos

### Mailtrap (entornos de prueba)
Crea cuenta gratuita en Mailtrap.

Crea un Inbox y copia las credenciales SMTP.

Configura en .env:

env
Copiar código
MAIL_PROVIDER=mailtrap
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER_MAILTRAP=usuario_mailtrap
MAIL_PASS_MAILTRAP=clave_mailtrap

Elige proveedor en `.env`:  
   - `MAIL_PROVIDER=gmail` → correo real (App Password).  
   - `MAIL_PROVIDER=mailtrap` → bandeja de pruebas.

 Reinicia el servidor (`npm run dev`).  

Ejecuta:
   - `POST /api/sessions/forgot-password` con `{ "email": "user@example.com" }`.  
   - Si Gmail: revisa tu casilla (o spam).  
   - Si Mailtrap: entra a tu Inbox en la web y verás el correo con el link de reset.
```

3. **Arrancar**
```bash
npm start
# o
npm run dev
```

La API arranca en: `http://localhost:8080`

---


## 🔐 Autenticación y autorización
- **Cookie**: `jwt`
- **Estrategia**: Passport **JWT** (`ignoreExpiration: false`)
- **Roles**: `admin`, `user`
  - **adminOnly** → crear/editar/eliminar productos
  - **userOnly** → agregar al carrito y comprar

---

## 📬 Reset de contraseña
- `POST /api/sessions/forgot-password` → envía correo con botón
- `POST /api/sessions/reset-password` → aplica nueva contraseña
  - Token expira en **1h**
  - Se bloquea reutilizar la contraseña anterior

---

## 🔎 Endpoints principales

### Sessions
- **POST** `/api/sessions/register` *(form)*
- **POST** `/api/sessions/login` *(form)* → set cookie `jwt`
- **GET** `/api/sessions/current` → **UserDTO** (sin password)
- **GET** `/api/sessions/logout`

### Password reset
- **POST** `/api/sessions/forgot-password` {{{{ email }}}}
- **POST** `/api/sessions/reset-password` {{{{ token, password }}}}

### Products
- **GET** `/api/products`
- **GET** `/api/products/:pid`
- **POST** `/api/products` *(adminOnly)*
- **PUT** `/api/products/:pid` *(adminOnly)*
- **DELETE** `/api/products/:pid` *(adminOnly)*

### Carts
- **POST** `/api/carts/:cid/products/:pid` *(userOnly)*
- **POST** `/api/carts/:cid/purchase` *(userOnly)*

### Users (admin)
- **GET** `/api/users`
- **POST** `/api/users`
- **PUT** `/api/users/:uid`
- **DELETE** `/api/users/:uid`

---

## 🧪 Postman / Insomnia
Se incluye **colección Postman** con:
- Registro, login, current
- Productos (CRUD admin)
- Carrito (agregar, comprar)
- Reset de contraseña


---

## ✅ Buenas prácticas incluidas
- Capa Repository sobre DAO
- DTOs en respuestas sensibles (`/current`)
- Middlewares de rol y estrategia JWT
- Lógica de compra robusta con Ticket
- Variables de entorno y mailer

---

## 📌 Notas
- Si usas Gmail, recuerda **App Password** (2FA).  
- Si no llega el correo, revisa **spam** o usa un SMTP alternativo (Mailtrap/Sendgrid).

---

## © Licencia
MIT
