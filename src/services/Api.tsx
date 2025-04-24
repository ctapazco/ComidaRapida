export const buscarCoordenadas = async (direccion: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
    const res = await fetch(url);
    const data = await res.json();
  
    if (!data || data.length === 0) {
      throw new Error('Ubicación no encontrada');
    }
  
    const { lat, lon } = data[0];
    return {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };
  };
  
  export const buscarFastFoodCercano = async (lat: number, lon: number) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fast_food"](around:1000,${lat},${lon});
        way["amenity"="fast_food"](around:1000,${lat},${lon});
      );
      out center;
    `;
  
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }).toString(),
    });
  
    if (!response.ok) {
      throw new Error("Error al llamar a Overpass API");
    }
  
    const data = await response.json();
  
    return data.elements.map((el: any) => ({
      id: el.id,
      name: el.tags?.name || "Fast food sin nombre",
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
    }));
  };
  
  export const obtenerDireccionDesdeCoords = async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
  
    return data.display_name || "Dirección desconocida";
  };