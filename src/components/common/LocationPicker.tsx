import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

type LatLng = { lat: number; lng: number };

const defaultCenter: LatLng = { lat: 25.2048, lng: 55.2708 }; // Dubai

// Fix default marker icon (Leaflet + Vite)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickToSetMarker({
  value,
  onChange,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (!value) return null;
  return <Marker position={[value.lat, value.lng]} icon={markerIcon} />;
}

export default function LocationPicker({
  value,
  onChange,
  height = 320,
  allowGeolocate = true,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
  height?: number;
  allowGeolocate?: boolean;
}) {
  const [center, setCenter] = useState<LatLng>(value ?? defaultCenter);

  useEffect(() => {
    if (value) setCenter(value);
  }, [value]);

  const canGeo = useMemo(() => allowGeolocate && "geolocation" in navigator, [allowGeolocate]);

  const useMyLocation = () => {
    if (!canGeo) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const v = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(v);
        setCenter(v);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not get your location. Please allow permission or pick on the map.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={!canGeo}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Use my location
        </button>

        <div className="text-sm text-gray-600">
          {value ? (
            <span>
              Selected: <span className="font-semibold">{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</span>
            </span>
          ) : (
            <span className="text-gray-500">Click on the map to choose a location</span>
          )}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ height }}>
        <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToSetMarker value={value} onChange={onChange} />
        </MapContainer>
      </div>
    </div>
  );
}
