import { useState, useEffect } from 'react';
import { Coordinates } from '../types/user.types';

const DEFAULT_COORDS: Coordinates = { lat: 24.7136, lng: 46.6753 }; // Riyadh

export const useGeolocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setLocation(DEFAULT_COORDS);
          setLoading(false);
          setError("Could not get location");
        }
      );
    } else {
      setLocation(DEFAULT_COORDS);
      setLoading(false);
      setError("Geolocation not supported");
    }
  }, []);

  return { location, loading, error };
};