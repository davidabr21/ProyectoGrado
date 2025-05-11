# ProyectoGrado

instalar:
 Frontend (React)
1️⃣ Entra a la carpeta del frontend

cd frontend
2️⃣ Instala las dependencias (con npm o yarn, tú eliges uno)

npm install
3️⃣ Arranca el servidor de desarrollo (React)

npm start
Esto abrirá tu navegador en
👉 http://localhost:3000

Backend - Si es Python (por ejemplo Flask o FastAPI)
1️⃣ Entra a la carpeta del backend

cd backend
2️⃣ (Recomendado) Crea un entorno virtual

python -m venv venv
# Activar en Windows
venv\Scripts\activate
# Activar en Mac/Linux
source venv/bin/activate
3️⃣ Instala las dependencias (asegúrate de tener un requirements.txt)

pip install -r requirements.txt
4️⃣ Arranca el backend (Flask ejemplo)

# Si es Flask
export FLASK_APP=app.py
export FLASK_ENV=development
flask run

# Si es FastAPI
uvicorn app:app --reload

5️⃣ Arranca el servidor de desarrollo (React)

npm start
Si el backend corre en localhost:5000 y el frontend en localhost:3000, necesitas en React un proxy en package.json:

json
Copiar
Editar
"proxy": "http://localhost:5000"
Esto permite que React pase las peticiones automáticamente al backend.

⛏️ Requisitos Previos (si no tienes instalados)
Node.js + npm
Descargar Node.js (esto instala npm también)

Python 3.8+
Descargar Python
