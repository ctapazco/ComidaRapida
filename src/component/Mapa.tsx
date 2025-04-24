import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  buscarCoordenadas,
  buscarFastFoodCercano,
  obtenerDireccionDesdeCoords
} from '../services/Api';

// Fix iconos leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ChangeMapView = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  map.setView(coords, 15);
  return null;
};

interface Lugar {
  id: number;
  name: string;
  lat: number;
  lon: number;
  direccion?: string;
  visitado?: boolean;
  valoracion?: number;
}

const Mapa: React.FC = () => {
  const [direccion, setDireccion] = useState('');
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [favoritos, setFavoritos] = useState<Lugar[]>([]);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const guardados = localStorage.getItem('favoritos');
    if (guardados) {
      setFavoritos(JSON.parse(guardados));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const handleBuscar = async () => {
    try {
      const { lat, lon } = await buscarCoordenadas(direccion);
      const nuevaCoords: [number, number] = [lat, lon];
      setCoords(nuevaCoords);

      const resultados = await buscarFastFoodCercano(lat, lon);
      setLugares(resultados);

      if (resultados.length === 0) {
        alert("No se encontraron restaurantes cerca.");
      }
    } catch (error) {
      console.error(error);
      alert("Error buscando la dirección.");
    }
  };

  const guardarFavorito = async (lugar: Lugar) => {
    if (favoritos.find((f) => f.id === lugar.id)) {
      alert("Este restaurante ya está en favoritos.");
      return;
    }

    try {
      const direccionReal = await obtenerDireccionDesdeCoords(lugar.lat, lugar.lon);
      const lugarConDireccion: Lugar = {
        ...lugar,
        direccion: direccionReal,
        visitado: false,
        valoracion: 0,
      };
      setFavoritos([...favoritos, lugarConDireccion]);
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      const lugarSinDireccion: Lugar = {
        ...lugar,
        direccion: "Dirección desconocida",
        visitado: false,
        valoracion: 0,
      };
      setFavoritos([...favoritos, lugarSinDireccion]);
    }
  };

  const toggleVisitado = (id: number) => {
    const actualizados = favoritos.map((f) =>
      f.id === id ? { ...f, visitado: !f.visitado } : f
    );
    setFavoritos(actualizados);
  };

  const setValoracion = (id: number, valor: number) => {
    const actualizados = favoritos.map((f) =>
      f.id === id ? { ...f, valoracion: valor } : f
    );
    setFavoritos(actualizados);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Panel lateral de favoritos */}
      <div style={{
        width: '300px',
        background: '#f9f9f9',
        padding: '16px',
        borderRight: '1px solid #ccc',
        overflowY: 'auto',
        height: '100vh'
      }}>
        <h3>📒 Favoritos</h3>
        {favoritos.length === 0 ? (
          <p>No has guardado ningún restaurante.</p>
        ) : (
          <ul style={{ paddingLeft: '16px' }}>
            {favoritos.map((fav) => (
              <li key={fav.id} style={{ marginBottom: '20px' }}>
                <strong>{fav.name}</strong><br />
                <span style={{ fontSize: '0.9em' }}>{fav.direccion}</span><br />

                <label style={{ fontSize: '0.9em' }}>
                  <input
                    type="checkbox"
                    checked={fav.visitado || false}
                    onChange={() => toggleVisitado(fav.id)}
                    style={{ marginRight: '4px' }}
                  />
                  Visitado
                </label>

                <div style={{ marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      onClick={() => setValoracion(fav.id, n)}
                      style={{
                        cursor: 'pointer',
                        color: (fav.valoracion || 0) >= n ? '#ffc107' : '#ddd',
                        fontSize: '18px'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa y buscador */}
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div style={{
          padding: '10px',
          background: '#fff',
          position: 'absolute',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          top: '10px',
          left: '10px'
        }}>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Introduce una dirección"
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              minWidth: '250px'
            }}
          />
          <button
            onClick={handleBuscar}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Buscar
          </button>
        </div>

        <MapContainer
          center={[41.3874, 2.1686]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ZoomControl position="bottomright" />

          {coords && (
            <>
              <ChangeMapView coords={coords} />
              <Marker position={coords}>
                <Popup>Ubicación buscada</Popup>
              </Marker>
            </>
          )}

          {lugares.map((lugar) => (
            <Marker key={lugar.id} position={[lugar.lat, lugar.lon]}>
              <Popup>
                <div>
                  <strong>{lugar.name}</strong><br />
                  <button onClick={() => guardarFavorito(lugar)}>
                    ➕ Guardar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Mapa;
