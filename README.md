
## Cómo correr el proyecto

## Lo que se necesita tener instalado

- Docker Desktop
- Python
- Node.js
- Git

## Paso 1: Descargar el proyecto

En el CMD:
git clone https://github.com/AlejandroS98/Restaurante
cd restaurante-menu




### Paso 2: Prender la base de datos

Abrir Docker Desktop y en una terminal:


cd core_restaurante
docker compose up -d


### Paso 3: Prender el backend

En la misma terminal y dentro de core_restaurante:


python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


### Paso 4: Encender la página

Abrimos otra terminal aparte y corremos:


cd frontend
npm install
npm run dev


Luego abrimos en el navegador la dirección **http://localhost:5173**.
