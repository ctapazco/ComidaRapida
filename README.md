# 🍔 ComidaRápida - Mapa Interactivo de Restaurantes

Aplicación React con mapa interactivo donde puedes buscar restaurantes de comida rápida cercanos, verlos en un mapa, guardarlos como favoritos, marcarlos como visitados y valorarlos de 1 a 5 estrellas ⭐.

---

## 🛠️ Tecnologías utilizadas

- **React** + **TypeScript**
- **React Leaflet** + **Leaflet** (para visualización del mapa)
- **APIs públicas**:
  - [Nominatim](https://nominatim.org/) (para geocodificación directa e inversa)
  - [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) (para encontrar lugares fast_food)
- **Persistencia local** con `localStorage`

---

## ⚙️ Instalación y ejecución

1. Clona este repositorio:

```bash
git clone https://github.com/ctapazco/ComidaRapida.git
cd ComidaRapida

Instala las dependencias:

bash
Copiar
Editar
npm install
Ejecuta la aplicación en modo desarrollo:

bash
Copiar
Editar
npm start
La app se abrirá automáticamente en tu navegador en http://localhost:3000

🧪 Funcionalidades principales
🔍 Buscar una dirección e ir directamente al mapa

🗺️ Ver restaurantes de comida rápida cercanos

💾 Guardar favoritos

✅ Marcar como "visitado"

⭐ Asignar una valoración del 1 al 5 estrellas

💽 Guardado persistente en el navegador con localStorage

Cuando lo tengas listo, recuerda:

---

Cuando lo tengas listo, recuerda:

```bash
git add README.md
git commit -m "README profesional añadido"
git push origin main
