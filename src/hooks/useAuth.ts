// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import {
    User,
    UserData,
    getCurrentUser,
    onAuthStateChange,
    getUserData
} from '../firebase/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    const data = await getUserData(firebaseUser.uid);
                    setUserData(data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        // Check current user immediately
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            getUserData(currentUser.uid).then(setUserData).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    return {
        user,
        userData,
        loading,
        isAuthenticated: !!user,
        isCustomer: userData?.role === "customer",
        isElectrician: userData?.role === "electrician"
    };
};