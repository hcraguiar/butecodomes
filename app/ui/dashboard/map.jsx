"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { useEffect } from 'react';
import { lusitana } from '../fonts';

export default function Map() {
  const position = [-19.885765, -43.950941];

  
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const VisitedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: iconShadow,
  });

  const SuggestedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: iconShadow,
  });

  const FirstIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: iconShadow,
  });

  const NextIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: iconShadow,
  });

  const butecos = [
    {name: 'Adega & Churrasco', lat: -19.877337, lon: -43.934820, icon: FirstIcon},
    {name: 'Mindoca', lat: -19.870457, lon: -43.986752, icon: VisitedIcon},
    {name: 'Faísca Bar', lat: -19.903165237589462, lon: -43.97043697627802, icon: VisitedIcon},
    {name: 'Villagium Burgueria', lat: -19.889885260101398, lon: -43.93984933024996, icon: NextIcon},
    {name: 'Chalé da Costela', lat: -19.861218763757506, lon: -43.93898674117238, icon: SuggestedIcon},
  ];


  return (
    <div className="md:col-span-2 lg:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Mapa</h2>
      <div className="rounded-xl bg-neutral-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg">
          <MapContainer center={position} zoom={13} style={{ height: '336px', width: '100%', borderRadius: '10px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            {butecos.map((buteco) => {
              return (
              <Marker key={buteco.name} position={[buteco.lat, buteco.lon]} icon={buteco.icon}>
                <Popup>{buteco.name}</Popup>
              </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
