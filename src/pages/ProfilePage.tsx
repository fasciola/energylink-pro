// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { updateUserProfile } from "../firebase/authService";
import { FaUser, FaEnvelope, FaPhone, FaTools, FaDollarSign } from "react-icons/fa";

export default function ProfilePage() {
  const { userData, refreshUserData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [availability, setAvailability] = useState(true);
  const [specialtyInput, setSpecialtyInput] = useState("");

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "");
      setPhone(userData.phone || "");
      setBio((userData as any).bio || "");
      setSpecialties((userData as any).specialties || []);
      setHourlyRate((userData as any).hourlyRate || 0);
      setAvailability((userData as any).availability !== false);
    }
  }, [userData]);

  const addSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserProfile(userData.uid, {
        displayName,
        phone,
        ...(userData.role === "electrician" && {
          bio,
          specialties,
          hourlyRate,
          availability,
        }),
      });

      if (result.success) {
        setSuccess("Profile updated successfully!");
        await refreshUserData();
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-bold text-gray-900">Loading profile...</h2>
      </div>
    );
  }

  const isElectrician = userData.role === "electrician";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName?.charAt(0) || "U"
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName || "Your Profile"}</h1>
            <p className="text-gray-600 capitalize">{userData.role}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2" />
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Electrician-only fields */}
          {isElectrician && (
            <>
              <div className="border-t pt-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell customers about yourself, your experience, and your services..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaTools className="inline mr-2" />
                    Specialties
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={(e) => setSpecialtyInput(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Residential Wiring"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaDollarSign className="inline mr-2" />
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    min="0"
                    step="5"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={availability === true}
                        onChange={() => setAvailability(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Available for work</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={availability === false}
                        onChange={() => setAvailability(false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Not available</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}