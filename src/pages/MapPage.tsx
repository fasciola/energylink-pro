import React, { useEffect, useState } from "react";
import ElectricianMap from "../components/common/Map/ElectricianMap";
import { getAllElectricians } from "../firebase/electricianService";
import type { Coordinates } from "../types/user.types";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [geoError, setGeoError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [electricians, setElectricians] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  // user location
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => setGeoError(err.message || "Location permission denied."),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // load electricians (Firestore)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const list = await getAllElectricians();
        setElectricians(list);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load electricians.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Find Electricians Near You</h2>
        <p className="text-gray-600">Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-1">Find Electricians Near You</h2>
        <p className="text-gray-600">
          {userLocation ? "📍 Location enabled" : geoError ? `⚠ ${geoError}` : "Getting location..."}
        </p>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="h-[70vh] rounded-xl overflow-hidden border">
        <ElectricianMap userLocation={userLocation} electricians={electricians} />
      </div>
    </div>
  );
}
