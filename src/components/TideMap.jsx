// src/components/TideMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icons for CRA
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function TideMap({ coords }) {
  const [map, setMap] = useState(null);

  // When map instance is created, save it
  function handleMapCreated(mapInstance) {
    setMap(mapInstance);
  }

  // Whenever coords change, re-center & resize
  useEffect(() => {
    if (map && coords) {
      setTimeout(() => {
        map.invalidateSize(true);
        map.setView([coords.lat, coords.lon], 8);
      }, 300);
    }
  }, [coords, map]);

  return (
    <div className="card">
      <h3>Map</h3>
      <div className="map-wrapper">
        {coords ? (
          <MapContainer
            center={[coords.lat, coords.lon]}
            zoom={8}
            className="map-container"
            whenCreated={handleMapCreated}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.lat, coords.lon]}>
              <Popup>Your Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="small">No location yet...</p>
        )}
      </div>
    </div>
  );
}
