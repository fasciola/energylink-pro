// src/components/electricians/ElectricianCard.tsx
import React from "react";
import { FaStar, FaMapMarkerAlt, FaBolt } from "react-icons/fa";

interface Electrician {
  id: string;
  name: string;
  photoURL?: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  specialties: string[];
  location: { lat: number; lng: number };
  experience: string;
}

interface ElectricianCardProps {
  electrician: Electrician;
  userLocation: { lat: number; lng: number } | null;
  onSelect: () => void;
}

export const ElectricianCard: React.FC<ElectricianCardProps> = ({
  electrician,
  userLocation,
  onSelect
}) => {
  const calculateDistance = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
  };

  const distance = userLocation && electrician.location 
    ? calculateDistance(userLocation, electrician.location)
    : null;

  return (
    <div className="border rounded-xl p-5 hover:shadow-lg transition cursor-pointer bg-white" onClick={onSelect}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {electrician.photoURL ? (
            <img src={electrician.photoURL} alt={electrician.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            electrician.name.charAt(0)
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{electrician.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
              <FaStar className="text-sm" />
              <span className="text-sm font-medium text-gray-700">{electrician.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{electrician.bio || "No bio available"}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <FaBolt className="text-sm" />
              <span>${electrician.hourlyRate}/hr</span>
            </div>
            
            {distance !== null && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <FaMapMarkerAlt className="text-sm" />
                <span>{distance} km</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {electrician.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                {specialty}
              </span>
            ))}
            {electrician.specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs">
                +{electrician.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};