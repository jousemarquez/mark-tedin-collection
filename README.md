# 🧙‍♂️ Mark Tedin Collection

Aplicación en **React** que permite gestionar tu colección de cartas ilustradas por **Mark Tedin** (artista de *Magic: The Gathering*), mostrando cada carta con su imagen desde la **API de Scryfall**, y permitiéndote marcar si la posees o no.  

Incluye estadísticas en tiempo real, barra de progreso, filtros y persistencia local automática.

---

## 🚀 Características principales

- **Carga dinámica** de cartas desde un archivo `cards.txt`.
- **Obtención automática** de imágenes mediante la [API de Scryfall](https://scryfall.com/docs/api).
- **Marcar cartas** con un checkbox para indicar si la tienes o no.
- **Persistencia local** con `localStorage` (se mantiene tras recargar).
- **Estadísticas visuales:**
  - Barra de progreso con porcentaje de colección completada.
  - Filtros por estado: “Todas”, “Tengo”, “No tengo”.
- **Diseño responsive** con CSS vanilla y grid adaptable.
- **Manejo de errores** y carga progresiva de imágenes (con fallback si no existen).

---

## 🧩 Requisitos

- Node.js 18+  
- npm o yarn

---

## 📦 Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/mark-tedin-collection.git
   cd mark-tedin-collection
