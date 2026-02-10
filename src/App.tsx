// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import ElectricianMapPage from "./pages/ElectricianMapPage";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { LanguageSwitcher } from "./components/common/LanguageSwitcher";
import CustomerDashboard from "./components/dashboard/CustomerDashboard";
import { ElectricianDashboard } from "./components/dashboard/ElectricianDashboard";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ADD THIS IMPORT

import {
  FaBolt,
  FaSignOutAlt,
  FaHome,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";

/** Prevent silent white screens if something throws during render */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "Arial", color: "black" }}>
          <h1 style={{ fontSize: 22, marginBottom: 10 }}>App crashed ❌</h1>
          <p style={{ marginBottom: 12 }}>
            Open Console (F12) to see the exact error.
          </p>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

function AppShell() {
  useTranslation();
  const navigate = useNavigate();

  const { userData, loading, isAuthenticated, isCustomer, isElectrician, logout } =
    useAuthContext();

  const role = userData?.role;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading EnergyLink Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && userData && (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <FaBolt className="text-2xl text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Energy<span className="text-blue-600">Link</span> Pro
                  </h1>
                  <p className="text-sm text-gray-500 capitalize">
                    {role === "customer"
                      ? "Customer Dashboard"
                      : "Electrician Dashboard"}
                  </p>
                </div>
              </div>

              <nav className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <FaHome />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>

                {isCustomer && (
                  <Link
                    to="/map"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <FaMapMarkerAlt />
                    <span className="hidden md:inline">Find Electricians</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <FaUser />
                  <span className="hidden md:inline">Profile</span>
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userData.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <p className="font-medium text-gray-800">
                      {userData.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userData.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">Logout</span>
                </button>

                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={isAuthenticated ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          
          {/* ADD THIS REGISTER ROUTE */}
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardRouter />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />

          <Route
            path="/map"
            element={
              <Protected>
                {isCustomer ? <ElectricianMapPage /> : <Navigate to="/dashboard" replace />}
              </Protected>
            }
          />

          {/* Default routes */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

function DashboardRouter() {
  const { userData, isElectrician } = useAuthContext();

  if (!userData) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-bold text-gray-900">Loading profile…</h2>
        <p className="text-gray-600 mt-2">
          Your account data is still loading from Firestore.
        </p>
      </div>
    );
  }

  return isElectrician ? <ElectricianDashboard /> : <CustomerDashboard />;
}

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}