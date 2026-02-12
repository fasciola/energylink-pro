// src/firebase/electricianService.ts
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    addDoc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "./config"; // ✅ Ensure config.ts exports `db` as a named export
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

// Helper function to convert Firestore timestamp to Date
const toDate = (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
        return timestamp;
    }
    return new Date();
};

// Get all electricians from electricians collection
export const getAllElectricians = async (): Promise<ElectricianProfile[]> => {
    try {
        console.log("Fetching electricians...");

        const electriciansRef = collection(db, "electricians");
        const electriciansSnapshot = await getDocs(electriciansRef);

        const electricians: ElectricianProfile[] = [];

        electriciansSnapshot.forEach((doc) => {
            const data = doc.data();

            electricians.push({
                uid: doc.id,                    // ✅ ONLY uid, NO id
                // ❌ REMOVE THIS LINE: id: doc.id,
                email: data.email || "",
                displayName: data.displayName || data.name || "",
                photoURL: data.photoURL || data.avatar || "",
                role: "electrician",
                phone: data.phone || "",
                location: data.location || { lat: 0, lng: 0 },
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt),
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
                languages: data.languages || ["English", "Arabic"],
                responseTime: data.responseTime || "15-30 minutes",
            });
        });

        console.log(`Successfully fetched ${electricians.length} electricians`);
        return electricians;
    } catch (error) {
        console.error("Error getting electricians:", error);
        return [];
    }
};

// Get electrician by ID
export const getElectricianById = async (id: string): Promise<ElectricianProfile | null> => {
    try {
        const electricianDoc = await getDoc(doc(db, "electricians", id));
        if (electricianDoc.exists()) {
            const data = electricianDoc.data();
            return {
                uid: id,                       // ✅ ONLY uid, NO id
                // ❌ REMOVE THIS LINE: id,
                email: data.email || "",
                displayName: data.displayName || data.name || "",
                photoURL: data.photoURL || data.avatar || "",
                role: "electrician",
                phone: data.phone || "",
                location: data.location || { lat: 0, lng: 0 },
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt),
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
                languages: data.languages || ["English", "Arabic"],
                responseTime: data.responseTime || "15-30 minutes",
            };
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
            updatedAt: serverTimestamp(),
        };

        const electricianRef = doc(db, "electricians", uid);
        await updateDoc(electricianRef, updateData);

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
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
    hourlyRate: number;
    estimatedHours: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createBooking = async (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
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