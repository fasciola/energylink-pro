// src/firebase/authService.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    User,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";

// Export User type from firebase/auth
export type { User } from "firebase/auth";

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

export type UserRole = "customer" | "electrician";

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
    phone: string;
    location?: { lat: number; lng: number };
    bio?: string;
    specialties?: string[];
    hourlyRate?: number;
    rating?: number;
    ratingCount?: number;
    completedJobs?: number;
    experience?: number;
    availability?: boolean;
    isVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Register user
export const registerUser = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    phone: string,
    location?: { lat: number; lng: number }
): Promise<{ success: boolean; error?: string }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData: UserData = {
            uid: user.uid,
            email,
            displayName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3B82F6&color=fff`,
            role,
            phone,
            location: location || (role === "electrician" ? { lat: 25.2048, lng: 55.2708 } : undefined),
            bio: "",
            specialties: [],
            hourlyRate: role === "electrician" ? 50 : undefined,
            rating: 0,
            ratingCount: 0,
            completedJobs: 0,
            experience: 0,
            availability: role === "electrician" ? true : undefined,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        if (role === "electrician") {
            const electricianData = {
                uid: user.uid,
                email,
                displayName,
                photoURL: userData.photoURL,
                phone,
                location: location || { lat: 25.2048, lng: 55.2708 },
                bio: "",
                specialties: [],
                hourlyRate: 50,
                rating: 0,
                ratingCount: 0,
                completedJobs: 0,
                experience: 0,
                availability: true,
                isVerified: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(doc(db, "electricians", user.uid), electricianData);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error.message || "Registration failed. Please try again.",
        };
    }
};

// Login user
export const loginUser = async (
    email: string,
    password: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.message || "Login failed. Please check your credentials.",
        };
    }
};

// Google sign-in
export const signInWithGoogle = async (
    role: UserRole = "customer"
): Promise<{ success: boolean; error?: string }> => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            const userData: UserData = {
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || user.email?.split("@")[0] || "User",
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email?.split("@")[0] || "User")}&background=3B82F6&color=fff`,
                role,
                phone: "",
                bio: "",
                specialties: [],
                hourlyRate: role === "electrician" ? 50 : undefined,
                rating: 0,
                ratingCount: 0,
                completedJobs: 0,
                experience: 0,
                availability: role === "electrician" ? true : undefined,
                isVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(doc(db, "users", user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Google sign-in error:", error);
        return {
            success: false,
            error: error.message || "Google sign-in failed.",
        };
    }
};

// Update user profile
export const updateUserProfile = async (
    uid: string,
    data: Partial<UserData>
): Promise<{ success: boolean; error?: string }> => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });

        // If electrician, also update electricians collection
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData?.role === 'electrician') {
            const electricianRef = doc(db, "electricians", uid);
            await updateDoc(electricianRef, {
                displayName: data.displayName || userData.displayName,
                email: data.email || userData.email,
                phone: data.phone || userData.phone,
                location: data.location || userData.location,
                bio: data.bio || userData.bio,
                specialties: data.specialties || userData.specialties,
                hourlyRate: data.hourlyRate || userData.hourlyRate,
                availability: data.availability !== undefined ? data.availability : userData.availability,
                updatedAt: serverTimestamp(),
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error updating user profile:", error);
        return {
            success: false,
            error: error.message || "Failed to update profile. Please try again.",
        };
    }
};

// Logout
export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                uid,
                email: data.email || "",
                displayName: data.displayName || "",
                photoURL: data.photoURL || "",
                role: data.role || "customer",
                phone: data.phone || "",
                location: data.location,
                bio: data.bio || "",
                specialties: data.specialties || [],
                hourlyRate: data.hourlyRate,
                rating: data.rating || 0,
                ratingCount: data.ratingCount || 0,
                completedJobs: data.completedJobs || 0,
                experience: data.experience || 0,
                availability: data.availability,
                isVerified: data.isVerified || false,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};