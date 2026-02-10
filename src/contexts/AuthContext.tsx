// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChange,
  getUserData,
  logoutUser,
  loginUser,
  registerUser,
  signInWithGoogle,
  UserData,
  UserRole,
} from "../firebase/authService";

type AuthContextValue = {
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isElectrician: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (args: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    location?: { lat: number; lng: number };
  }) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChange(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUserData(null);
          setLoading(false);
          return;
        }

        const data = await getUserData(firebaseUser.uid);

        if (data) {
          setUserData(data);
          setLoading(false);
          return;
        }

        // fallback if user doc missing
        const email = firebaseUser.email || "";
        const displayName = firebaseUser.displayName || (email ? email.split("@")[0] : "User");

        setUserData({
          uid: firebaseUser.uid,
          email,
          displayName,
          photoURL:
            firebaseUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3B82F6&color=fff`,
          role: "customer",
          phone: "",
          location: { lat: 0, lng: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setLoading(false);
      } catch (e) {
        console.error("AuthContext onAuthStateChange error:", e);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value: AuthContextValue = useMemo(() => {
    const role = userData?.role;

    return {
      userData,
      loading,
      isAuthenticated: !!userData,
      isCustomer: role === "customer",
      isElectrician: role === "electrician",

      login: async (email, password) => {
        const res = await loginUser(email, password);
        return { success: res.success, error: res.error };
      },

      register: async ({ name, email, password, phone, role, location }) => {
        const res = await registerUser(email, password, name, role, phone, location);
        return { success: res.success, error: res.error };
      },

      googleLogin: async (role = "customer") => {
  const res = await signInWithGoogle(role);
  return { success: res.success, error: res.error };
      },

      logout: async () => {
        await logoutUser();
        setUserData(null);
      },
    };
  }, [userData, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}