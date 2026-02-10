// src/firebase/electricianService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { UserData } from "./authService";

export interface ElectricianProfile extends UserData {
  specialties: string[];
  hourlyRate: number;
  rating: number;
  ratingCount: number;
  completedJobs: number;
  responseTime?: string;
  experience: number;
  languages?: string[];
  availability: boolean;
  address?: string;
  radius?: number;
  isVerified: boolean;
  reviews?: Review[];
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Simplified: Read only from electricians collection
export const getAllElectricians = async (): Promise<ElectricianProfile[]> => {
  try {
    console.log("Fetching electricians...");
    
    // Try to get from electricians collection only
    const electriciansRef = collection(db, "electricians");
    const electriciansSnapshot = await getDocs(electriciansRef);
    
    const electricians: ElectricianProfile[] = [];
    
    electriciansSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Found electrician data:", data);
      
      electricians.push({
        uid: doc.id,
        id: doc.id,
        email: data.email || "",
        displayName: data.displayName || data.name || "",
        photoURL: data.photoURL || data.avatar || "",
        role: 'electrician',
        phone: data.phone || "",
        location: data.location || { lat: 0, lng: 0 },
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: new Date(),
        bio: data.bio || "",
        specialties: data.specialties || [],
        hourlyRate: data.hourlyRate || 50,
        rating: data.rating || 0,
        ratingCount: data.ratingCount || 0,
        completedJobs: data.completedJobs || 0,
        experience: data.experience || 0,
        availability: data.availability !== false, // default to true
        isVerified: data.isVerified || false,
        address: data.address || "",
        radius: data.radius || 20,
      } as ElectricianProfile);
    });
    
    console.log(`Successfully fetched ${electricians.length} electricians`);
    return electricians;
  } catch (error) {
    console.error("Error getting electricians:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

// Alternative: Get only electricians from users collection (if your rules allow it)
export const getElectriciansFromUsers = async (): Promise<ElectricianProfile[]> => {
  try {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, where("role", "==", "electrician"));
    const usersSnapshot = await getDocs(usersQuery);
    
    const electricians: ElectricianProfile[] = [];
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      electricians.push({
        uid: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: new Date(),
      } as ElectricianProfile);
    });
    
    return electricians;
  } catch (error) {
    console.error("Error getting electricians from users:", error);
    return [];
  }
};

// Combined function: tries both collections
export const getAllElectriciansCombined = async (): Promise<ElectricianProfile[]> => {
  try {
    const [fromElectricians, fromUsers] = await Promise.allSettled([
      getAllElectricians(),
      getElectriciansFromUsers(),
    ]);
    
    const electricians: ElectricianProfile[] = [];
    const seenIds = new Set<string>();
    
    // Add from electricians collection
    if (fromElectricians.status === 'fulfilled') {
      fromElectricians.value.forEach(e => {
        if (!seenIds.has(e.uid)) {
          seenIds.add(e.uid);
          electricians.push(e);
        }
      });
    }
    
    // Add from users collection
    if (fromUsers.status === 'fulfilled') {
      fromUsers.value.forEach(e => {
        if (!seenIds.has(e.uid)) {
          seenIds.add(e.uid);
          electricians.push(e);
        }
      });
    }
    
    console.log(`Total electricians found: ${electricians.length}`);
    return electricians;
  } catch (error) {
    console.error("Error in getAllElectriciansCombined:", error);
    return [];
  }
};

// Get electrician by ID
export const getElectricianById = async (id: string): Promise<ElectricianProfile | null> => {
  try {
    // Try electricians collection first
    const electricianDoc = await getDoc(doc(db, "electricians", id));
    if (electricianDoc.exists()) {
      const data = electricianDoc.data();
      return {
        uid: id,
        id,
        email: data.email || "",
        displayName: data.displayName || data.name || "",
        photoURL: data.photoURL || data.avatar || "",
        role: 'electrician',
        phone: data.phone || "",
        location: data.location || { lat: 0, lng: 0 },
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: new Date(),
        bio: data.bio || "",
        specialties: data.specialties || [],
        hourlyRate: data.hourlyRate || 50,
        rating: data.rating || 0,
        ratingCount: data.ratingCount || 0,
        completedJobs: data.completedJobs || 0,
        experience: data.experience || 0,
        availability: data.availability !== false,
        isVerified: data.isVerified || false,
        address: data.address || "",
        radius: data.radius || 20,
      } as ElectricianProfile;
    }
    
    // Fallback to users collection
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.role === 'electrician') {
        return { 
          uid: id,
          id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          updatedAt: new Date(),
        } as ElectricianProfile;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting electrician by ID:", error);
    return null;
  }
};

// Update electrician profile
export const updateElectricianProfile = async (
  uid: string,
  data: Partial<ElectricianProfile>
): Promise<void> => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Update in electricians collection
    const electricianRef = doc(db, "electricians", uid);
    await updateDoc(electricianRef, updateData);
    
    // Also update in users collection if exists
    const userRef = doc(db, "users", uid);
    try {
      await updateDoc(userRef, updateData);
    } catch (err) {
      console.log("User document might not exist, skipping...");
    }
    
  } catch (error) {
    console.error("Error updating electrician profile:", error);
    throw error;
  }
};

// Create booking request
export interface Booking {
  id?: string;
  customerId: string;
  electricianId: string;
  serviceType: string;
  description: string;
  address: string;
  scheduledDate: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  hourlyRate: number;
  estimatedHours: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const bookingsRef = collection(db, "bookings");
    const docRef = await addDoc(bookingsRef, {
      ...booking,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};