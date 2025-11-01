```
# Mark Tedin Collection

Una aplicación React para gestionar tu colección de cartas de Magic: The Gathering del artista **Mark Tedin**.  

La app permite:

- Visualizar todas las cartas del artista.
- Marcar si tienes o no cada carta.
- Guardar el estado de tu colección en **MongoDB Atlas** (persistente y desplegada en Vercel).
- Buscar cartas por nombre.
- Ver una barra de progreso de tu colección.
- Consultar imágenes de cartas desde la API de **Scryfall**.
- Colorear cartas en **verde** si las tienes, y en **rojo** si no.

---

## 💻 Instalación

1. Clona el repositorio:

```bash
git clone <tu-repo-url>
cd mark-tedin-collection
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz con tu URI de MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/mark-tedin-db?retryWrites=true&w=majority
```

> Reemplaza `USER` y `PASSWORD` con tu usuario de MongoDB Atlas.

---

## 🗂 Estructura del proyecto

```
mark-tedin-collection/
├─ src/
│  ├─ App.jsx          # Componente principal con grid de cartas
│  ├─ App.css          # Estilos en CSS vanilla
│  └─ cards.txt        # Lista de cartas de Mark Tedin
├─ api/
│  └─ cards.js         # API route para MongoDB Atlas
├─ populateDB.js       # Script para poblar MongoDB con cartas
├─ .env                # Variables de entorno (no subir a Git)
├─ package.json
└─ README.md
```

---

## 🚀 Población inicial de la base de datos

Para insertar todas las cartas en MongoDB Atlas con `owned: false`:

```bash
node populateDB.js
```

> Asegúrate de que `cards.txt` contiene todas las cartas y que `.env` tiene la variable `MONGODB_URI`.

---

## 🛠 Scripts

- `npm run populate` → Ejecuta el script para poblar MongoDB.  
- `npm start` → Inicia la app en modo desarrollo (React).  
- `npm run build` → Compila la app para producción (lista para Vercel).  

---

## ⚡ Uso

1. Abre la app en el navegador.  
2. Busca cartas usando el input de búsqueda.  
3. Marca el checkbox **“Tengo esta carta”** para cada carta que poseas.  
4. Observa cómo se actualiza la barra de progreso y el color de la carta.  
5. Pulsa **Guardar cambios** para persistir tu colección en MongoDB Atlas.  

---

## 🔗 APIs usadas

- [Scryfall API](https://scryfall.com/docs/api) → Para obtener imágenes y datos de las cartas.  
- MongoDB Atlas → Base de datos persistente para almacenar tu colección.  

---

## 📦 Dependencias principales

- `react` / `react-dom`  
- `mongodb` → Cliente de MongoDB  
- `dotenv` → Para cargar variables de entorno en Node.js  

---

## 📌 Notas

- Este proyecto está optimizado para ser desplegado en **Vercel**.  
- No subas tu `.env` a GitHub; contiene credenciales sensibles.  
```
