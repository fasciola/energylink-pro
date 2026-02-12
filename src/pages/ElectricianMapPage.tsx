// src/pages/ElectricianMapPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ElectricianMap from "../components/common/Map/ElectricianMap";
import { getAllElectricians, ElectricianProfile } from "../firebase/electricianService";
import { useGeolocation } from "../hooks/useGeolocation";

type MapElectrician = {
    id: string;
    name: string;
    location: { lat: number; lng: number };
    bio: string;
    hourlyRate: number;
};

export default function ElectricianMapPage() {
    const { t } = useTranslation();
    const { location, error: geoError, loading: geoLoading } = useGeolocation();
    const [loading, setLoading] = useState(true);
    const [electricians, setElectricians] = useState<ElectricianProfile[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string>("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setFetchError("");

                const list = await getAllElectricians();

                if (!mounted) return;
                setElectricians(Array.isArray(list) ? list : []);
            } catch (e: any) {
                console.error("Failed to load electricians:", e);
                if (!mounted) return;
                setFetchError(e?.message || "Failed to load electricians");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const userLocation = useMemo(() => {
        if (!location) return null;
        return { lat: location.lat, lng: location.lng };
    }, [location]);

    const mapElectricians: MapElectrician[] = useMemo(() => {
        return electricians
            .filter((e): e is ElectricianProfile & { location: NonNullable<ElectricianProfile['location']> } =>
                e?.location !== undefined &&
                e.location !== null &&
                typeof e.location.lat === "number" &&
                typeof e.location.lng === "number"
            )
            .map((e) => ({
                id: e.uid,
                name: e.displayName || "Electrician",
                location: { lat: e.location.lat, lng: e.location.lng },
                bio: e.bio || "",
                hourlyRate: Number(e.hourlyRate ?? 0),
            }));
    }, [electricians]);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return electricians.find((e) => e.uid === selectedId) || null;
    }, [selectedId, electricians]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-2">
                    {t("map.title", "Find Electricians Near You")}
                </h2>

                <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm">
                    <div className="text-gray-600">
                        {geoLoading ? (
                            <span>Getting your location...</span>
                        ) : geoError ? (
                            <span className="text-red-600">⚠ {geoError}</span>
                        ) : location ? (
                            <span className="text-green-700">📍 Location enabled</span>
                        ) : (
                            <span>Location not available</span>
                        )}
                    </div>

                    <div className="text-gray-500 md:ml-auto">
                        {loading ? "Loading electricians..." : `${mapElectricians.length} electricians on the map`}
                    </div>
                </div>

                {fetchError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        {fetchError}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-4">
                    {loading ? (
                        <div className="h-[520px] flex items-center justify-center text-gray-600">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                                <p>Loading map...</p>
                            </div>
                        </div>
                    ) : (
                        <ElectricianMap
                            electricians={mapElectricians}
                            userLocation={userLocation}
                            onElectricianSelect={(id) => setSelectedId(id)}
                        />
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Electricians</h3>

                    {loading ? (
                        <div className="text-gray-600">Loading...</div>
                    ) : mapElectricians.length === 0 ? (
                        <div className="text-gray-600">
                            No electricians found with a valid location yet.
                            <div className="mt-2 text-xs text-gray-500">
                                Tip: electricians must set location in their profile.
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                            {mapElectricians.map((e) => (
                                <button
                                    key={e.id}
                                    onClick={() => setSelectedId(e.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition ${selectedId === e.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-semibold text-gray-900">{e.name}</div>
                                            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                {e.bio || "No bio yet."}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-emerald-700 whitespace-nowrap">
                                            ${e.hourlyRate}/hr
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {selected && (
                        <div className="mt-4 p-4 rounded-xl bg-gray-50 border">
                            <div className="font-semibold text-gray-900 text-lg">{selected.displayName}</div>
                            <div className="text-sm text-gray-600 mt-2">{selected.bio || "No bio yet."}</div>
                            <div className="mt-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Hourly Rate:</span>
                                    <span className="font-bold text-emerald-700">
                                        ${selected.hourlyRate || 0}/hr
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-gray-500">Rating:</span>
                                    <span className="font-medium">
                                        {selected.rating ? `${selected.rating} ★` : "Not rated"}
                                    </span>
                                </div>
                                {selected.phone && (
                                    <div className="flex justify-between mt-1">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="font-medium">{selected.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}