// src/components/dashboard/CustomerDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { getAllElectricians } from "../../firebase/electricianService";
import { ElectricianCard } from "../electricians/ElectricianCard";

// Define the Electrician interface locally to fix type errors
interface Electrician {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    bio: string;
    specialties: string[];
    hourlyRate: number;
    rating: number;
    completedJobs: number;
    responseTime: string;
    location: { lat: number; lng: number };
    experience: string;
    languages: string[];
    photoURL?: string;
    createdAt: Date;
}

interface Coordinates {
    lat: number;
    lng: number;
}

function toElectrician(e: any): Electrician {
    return {
        id: e.uid || e.id || "",
        name: e.displayName || e.name || "Electrician",
        email: e.email || "",
        phone: e.phone || "",
        role: "electrician",
        isVerified: Boolean(e.isVerified),
        bio: e.bio || "",
        specialties: Array.isArray(e.specialties) ? e.specialties : [],
        hourlyRate: Number(e.hourlyRate ?? 0),
        rating: Number(e.rating ?? 0),
        completedJobs: Number(e.completedJobs ?? 0),
        responseTime: e.responseTime || "15-30 minutes",
        location: {
            lat: Number(e.location?.lat ?? 0),
            lng: Number(e.location?.lng ?? 0),
        },
        experience: String(e.experience ?? 0),
        languages: Array.isArray(e.languages) ? e.languages : ["Arabic", "English"],
        photoURL: e.photoURL || "",
        createdAt: e.createdAt || new Date(),
    };
}

export default function CustomerDashboard() {
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [geoError, setGeoError] = useState("");
    const [loading, setLoading] = useState(true);
    const [electricians, setElectricians] = useState<Electrician[]>([]);
    const [fetchError, setFetchError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<Electrician | null>(null);

    // Get user location
    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setGeoError("Geolocation is not supported in this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                setGeoError(err.message || "Location permission denied.");
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }, []);

    // Fetch electricians from Firestore
    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            setFetchError("");
            try {
                const list = await getAllElectricians();
                if (!mounted) return;

                const mapped = (Array.isArray(list) ? list : []).map(toElectrician);
                setElectricians(mapped);
            } catch (e: any) {
                console.error("getAllElectricians error:", e);
                if (!mounted) return;
                setFetchError(e?.message || "Failed to load electricians.");
                setElectricians([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const base = electricians;

        if (!q) return base;

        return base.filter((e) => {
            return (
                e.name.toLowerCase().includes(q) ||
                (e.bio || "").toLowerCase().includes(q) ||
                (e.specialties || []).some((s) => String(s).toLowerCase().includes(q))
            );
        });
    }, [electricians, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Dashboard</h2>
                <p className="text-gray-600 mt-1">Browse real electricians from Firestore.</p>

                <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, bio, or specialty..."
                        className="w-full md:max-w-lg px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <div className="text-sm text-gray-500">
                        {userLocation ? (
                            <span>📍 Location enabled</span>
                        ) : geoError ? (
                            <span className="text-red-600">⚠ {geoError}</span>
                        ) : (
                            <span>Getting your location...</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Electricians ({filtered.length})
                </h3>

                {fetchError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                        {fetchError}
                    </div>
                )}

                {loading ? (
                    <div className="text-gray-600">Loading electricians from Firestore...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-gray-600">
                        No electricians found. (Make sure at least one document has `role: "electrician"` in `users`.)
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((e) => (
                            <ElectricianCard
                                key={e.id}
                                electrician={e}
                                userLocation={userLocation}
                                onSelect={() => setSelected(e)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Simple details panel */}
            {selected && (
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">{selected.name}</h4>
                            <p className="text-gray-600 mt-1">{selected.bio}</p>

                            <div className="mt-3 text-sm text-gray-700 space-y-1">
                                <div>
                                    <span className="font-semibold">Phone:</span> {selected.phone || "Not set"}
                                </div>
                                <div>
                                    <span className="font-semibold">Email:</span> {selected.email || "Not set"}
                                </div>
                                <div>
                                    <span className="font-semibold">Hourly rate:</span> ${selected.hourlyRate}/hr
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelected(null)}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}