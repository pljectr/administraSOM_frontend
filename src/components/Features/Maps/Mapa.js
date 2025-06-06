//clique duas vezes para abrir no Maps

// src/components/Mapa.js
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRef } from 'react';

// Corrige o bug dos ícones padrão que não aparecem
delete L.Icon.Default.prototype._getIconUrl;

// Ícone personalizado com tamanho reduzido
const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [20, 32], // Tamanho menor (padrão é [25, 41])
  iconAnchor: [10, 32], // Âncora ajustada
  popupAnchor: [1, -32], // Ajuste do popup
  // shadowSize: [41, 41],
});
/* 
props.points: [coordenadas dos locais ]
 */

function CustomMarker({ ponto }) {
  const markerRef = useRef();

  const handleClick = () => {
    const marker = markerRef.current;
    if (marker) {
      marker.openPopup();
    }
  };

  const handleDoubleClick = () => {
    if (ponto.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        ponto.address
      )}`;
      window.open(url, "_blank");
    }
  };

  return (
    <Marker
      position={ponto.coords}
      icon={customIcon}
      ref={markerRef}
      eventHandlers={{
        click: handleClick,
        dblclick: handleDoubleClick,
      }}
    >
      <Popup>{ponto.nome}</Popup>
    </Marker>
  );
}


export default function Mapa(props) {
  // Localização inicial do mapa (latitude, longitude)

  const marcadores = props.points || [
    { nome: "Brasília", coords: [-15.793889, -47.882778] },
    { nome: "Rio de Janeiro", coords: [-22.9068, -43.1729] },
    { nome: "São Paulo", coords: [-23.5505, -46.6333] },
    { nome: "Fortaleza", coords: [-3.7172, -38.5433] },
  ];
  const center = marcadores.length == 1 ? [marcadores[0].coords[0], marcadores[0].coords[1]] : [-29.7241, -52.4361]; // Ex: POA
  return (
    <MapContainer
      center={center}
      zoom={marcadores.length == 1 ? 17 : 6}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {marcadores.map((ponto, index) => (
        <CustomMarker key={index} ponto={ponto} />
      ))}
    </MapContainer>
  );
}
