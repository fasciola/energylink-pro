export type UserRole = 'customer' | 'electrician';

export interface User {
  id: string;
  role: UserRole;
  name: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Electrician {
  id: string;
  name: string;
  bio: string;
  rating: number;
  hourlyRate: number;
  location: Coordinates;
  specialties: string[];
  avatar?: string;
  languages: string[];
  experience: string;
  completedJobs: number;
  responseTime: string;
}