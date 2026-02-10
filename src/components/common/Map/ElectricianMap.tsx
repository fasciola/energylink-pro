// src/components/common/Map/ElectricianMap.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Define the prop types
export interface ElectricianMapProps {
  electricians: Array<{
    id: string;
    name: string;
    location: { lat: number; lng: number };
    bio: string;
    hourlyRate: number;
  }>;
  userLocation: { lat: number; lng: number } | null;
  onElectricianSelect: (id: string) => void;
}

export default function ElectricianMap({ 
  electricians = [], 
  userLocation, 
  onElectricianSelect 
}: ElectricianMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map - only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([25.2048, 55.2708], 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Set map as ready after tiles load
    map.whenReady(() => {
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers when electricians or userLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add electrician markers
    electricians.forEach(electrician => {
      if (!electrician.location || !electrician.location.lat || !electrician.location.lng) return;
      
      try {
        const marker = L.marker([electrician.location.lat, electrician.location.lng])
          .addTo(map)
          .bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <strong style="font-size: 14px;">${electrician.name}</strong><br>
              <span style="color: #059669; font-weight: bold;">$${electrician.hourlyRate}/hr</span><br>
              <small style="color: #666; font-size: 12px;">${electrician.bio || "No bio available"}</small>
              <div style="margin-top: 8px;">
                <button onclick="window.dispatchEvent(new CustomEvent('select-electrician', { detail: '${electrician.id}' }))" 
                  style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  Select
                </button>
              </div>
            </div>
          `);
        
        // Add click event for the marker
        marker.on('click', () => {
          onElectricianSelect(electrician.id);
        });
        
        markersRef.current.push(marker);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      try {
        const userIcon = L.divIcon({
          html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);"></div>',
          className: 'user-location-marker',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<strong>Your Location</strong>");
        
        markersRef.current.push(userMarker);
      } catch (error) {
        console.error("Error adding user marker:", error);
      }
    }

    // Fit bounds to show all markers if we have any
    try {
      if ((electricians.length > 0 && electricians.some(e => e.location)) || userLocation) {
        const bounds = L.latLngBounds([]);
        
        electricians.forEach(e => {
          if (e.location && e.location.lat && e.location.lng) {
            bounds.extend([e.location.lat, e.location.lng]);
          }
        });
        
        if (userLocation && userLocation.lat && userLocation.lng) {
          bounds.extend([userLocation.lat, userLocation.lng]);
        }
        
        // Check if bounds are valid before fitting
        if (bounds.isValid() && bounds.getNorth() !== bounds.getSouth() && bounds.getEast() !== bounds.getWest()) {
          // Small delay to ensure map is fully rendered
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.fitBounds(bounds, { 
                padding: [50, 50], 
                maxZoom: 15,
                animate: true 
              });
            }
          }, 300);
        } else {
          // If no valid bounds, set a default view
          if (userLocation && userLocation.lat && userLocation.lng) {
            map.setView([userLocation.lat, userLocation.lng], 12);
          }
        }
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }

    // Cleanup event listener
    const handleSelectElectrician = (event: CustomEvent) => {
      onElectricianSelect(event.detail);
    };

    window.addEventListener('select-electrician', handleSelectElectrician as EventListener);

    return () => {
      window.removeEventListener('select-electrician', handleSelectElectrician as EventListener);
    };
  }, [electricians, userLocation, onElectricianSelect, mapReady]);

  return (
    <div
      ref={mapRef}
      style={{ 
        height: "500px", 
        width: "100%", 
        borderRadius: "12px",
        minHeight: "500px"
      }}
    />
  );
}