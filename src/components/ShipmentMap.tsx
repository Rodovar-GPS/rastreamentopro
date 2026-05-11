import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackingPoint } from '../types';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const truckIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Fallback, could be a custom truck icon
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ShipmentMapProps {
  points: TrackingPoint[];
  className?: string;
  defaultCenter?: LatLngTuple;
  zoom?: number;
}

export function ShipmentMap({ points, className = "h-96 w-full rounded-xl", defaultCenter = [-23.55052, -46.633308], zoom = 10 }: ShipmentMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  const coordinates: LatLngTuple[] = points.map(p => [p.latitude, p.longitude]);
  const currentPosition = coordinates.length > 0 ? coordinates[coordinates.length - 1] : defaultCenter;

  useEffect(() => {
    if (map && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]); // Re-fit when points change

  return (
    <div className={className}>
      <MapContainer
        center={currentPosition}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {coordinates.length > 0 && (
          <Polyline positions={coordinates} color="#2563eb" weight={4} opacity={0.6} />
        )}

        {coordinates.length > 0 && (
          <Marker position={currentPosition} icon={truckIcon}>
            <Popup>
              Posição atual <br />
              {points[points.length - 1]?.created_at ? new Date(points[points.length - 1].created_at).toLocaleString('pt-BR') : ''}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
