import { Electrician } from '../../types/user.types';
import { calculateDistance } from '../../utils/distanceCalculator';
import { useTranslation } from 'react-i18next';
import { Coordinates } from '../../types/user.types';
import { FaStar, FaClock, FaTools } from 'react-icons/fa';

interface Props {
  electrician: Electrician;
  userLocation: Coordinates | null;
  onSelect: () => void;
}

export const ElectricianCard = ({ electrician, userLocation, onSelect }: Props) => {
  const { t } = useTranslation();
  const distance = userLocation
    ? calculateDistance(userLocation, electrician.location).toFixed(1)
    : '?';

  return (
    <div 
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-xl font-bold group-hover:scale-105 transition-transform">
            {electrician.name.charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {electrician.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {electrician.bio}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
              <span className="font-bold">${electrician.hourlyRate}</span>
              <span className="text-xs">/hr</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <span className="font-semibold">{electrician.rating}</span>
              <span className="text-gray-500">({electrician.completedJobs})</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-blue-500" />
              <span>{electrician.responseTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaTools className="text-gray-500" />
              <span>{distance} km</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mt-3 flex flex-wrap gap-2">
            {electrician.specialties.slice(0, 3).map((spec, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
            {electrician.specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{electrician.specialties.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};