// src/pages/Register.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { FaBolt, FaUser, FaEnvelope, FaLock, FaPhone, FaTools, FaMapMarkerAlt } from "react-icons/fa";

type Role = "customer" | "electrician";

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");

  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const location = useMemo(() => {
    const la = Number(lat);
    const ln = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return undefined;
    return { lat: la, lng: ln };
  }, [lat, lng]);

  const useMyLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      (err) => setError(err.message || "Location permission denied."),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      const res = await register({
        name,
        email,
        password,
        phone,
        role,
        location: role === "electrician" ? location : undefined,
      });

      if (!res.success) {
        setError(res.error || "Registration failed.");
        return;
      }

      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await googleLogin(role);
      if (!res.success) {
        setError(res.error || "Google sign-in failed.");
        return;
      }
      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaBolt className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Energy<span className="text-blue-600">Link</span> Pro
            </h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaUser className="inline mr-2 text-gray-400" />
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaEnvelope className="inline mr-2 text-gray-400" />
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaPhone className="inline mr-2 text-gray-400" />
              Phone
            </label>
            <input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaLock className="inline mr-2 text-gray-400" />
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                disabled={loading}
                className={`py-3 rounded-lg border transition ${
                  role === "customer" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-300"
                }`}
              >
                <FaUser className="inline mr-2" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("electrician")}
                disabled={loading}
                className={`py-3 rounded-lg border transition ${
                  role === "electrician" ? "border-emerald-600 bg-emerald-50 text-emerald-600" : "border-gray-300"
                }`}
              >
                <FaTools className="inline mr-2" />
                Electrician
              </button>
            </div>
          </div>

          {/* Location only for electricians */}
          {role === "electrician" && (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Choose your location
                </p>
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Use my current location
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Latitude"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  disabled={loading}
                />
                <input
                  placeholder="Longitude"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  disabled={loading}
                />
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Tip: you can paste coordinates from Google Maps.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={onGoogle}
            disabled={loading}
            className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-sm text-gray-600 text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}