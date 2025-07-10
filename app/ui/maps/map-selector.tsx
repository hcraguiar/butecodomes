'use client'

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon, LatLng, map } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css'; // Certifique-se de que isso esteja aqui
import L from 'leaflet';

const greenMarker = new L.Icon({
  iconUrl: '/markers/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapSelectorProps {
  latitude: string
  longitude: string
  setLocation: (coords: { lat: number, lng: number }) => void
}

function FlyToHandler({ position }: { position: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
  }, [position, map]);

  return null;
}

function LocationMarker({
  setPosition,
  position,
}: {
  setPosition: MapSelectorProps['setLocation']
  position: LatLngExpression
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      map.flyTo([lat, lng], map.getZoom(), {
        animate: true,
        duration: 1.5,
      })
    },
  });

  return <Marker position={position} icon={greenMarker} />;
}

function ResizeMapOnLoad() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); // pequeno delay ajuda em renderizações no client
  }, [map]);

  return null;
}

export default function MapSelector({
  latitude,
  longitude,
  setLocation
}: MapSelectorProps) {
  const defaultCenter: LatLngExpression = [-19.93205, -43.93808];
  const [position, setPosition] = useState<LatLngExpression>(defaultCenter);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  return (
    <div className="h-[300px] rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        className="w-full h-full"
        scrollWheelZoom
      >
        <ResizeMapOnLoad />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker
          position={position}
          setPosition={(coords) => {
            setPosition([coords.lat, coords.lng]);
            setLocation(coords);
          }}
        />
        <FlyToHandler position={position} />
      </MapContainer>
    </div>
  );
}
