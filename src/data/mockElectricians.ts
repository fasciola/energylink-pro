import { Electrician } from '../types/user.types';

export const MOCK_ELECTRICIANS: Electrician[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    bio: "Licensed electrician with 10+ years of residential experience",
    rating: 4.8,
    hourlyRate: 85,
    location: { lat: 24.7136, lng: 46.6753 }, // Riyadh
    specialties: ["Residential", "Panel Upgrades", "Smart Home"],
    languages: ["Arabic", "English"],
    experience: "10 years",
    completedJobs: 245,
    responseTime: "15 minutes"
  },
  {
    id: "2",
    name: "Sarah Al-Mansoori",
    bio: "Expert in commercial electrical systems and energy efficiency",
    rating: 4.9,
    hourlyRate: 120,
    location: { lat: 24.6877, lng: 46.7219 },
    specialties: ["Commercial", "Industrial", "Energy Audit"],
    languages: ["Arabic", "English", "French"],
    experience: "8 years",
    completedJobs: 189,
    responseTime: "20 minutes"
  },
  {
    id: "3",
    name: "Khalid Ibrahim",
    bio: "Specialized in solar panel installation and smart home automation",
    rating: 4.7,
    hourlyRate: 95,
    location: { lat: 24.7743, lng: 46.7386 },
    specialties: ["Solar", "Smart Home", "Residential"],
    languages: ["Arabic"],
    experience: "6 years",
    completedJobs: 132,
    responseTime: "30 minutes"
  },
  // Add more as needed...
];