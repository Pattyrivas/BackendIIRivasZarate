Proyecto Backend II – Ecommerce (CRUD + Autenticación con JWT)

Implementación de un CRUD de usuarios con autenticación y autorización utilizando Passport (local y JWT), bcrypt.hashSync para contraseñas y cookies httpOnly para el manejo seguro de sesiones.  
Incluye la ruta `/api/sessions/current` que devuelve el usuario asociado al JWT.


Configuración de variables de entorno:

En la raíz del proyecto encontrarás un archivo `.env.example`.  
Cópialo y renómbralo como `.env`:

Luego edita el archivo .env y completa los valores:

MONGO_URL.

JWT_SECRET.

PORT → (por defecto 8080).
