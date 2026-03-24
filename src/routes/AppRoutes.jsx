// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../hooks/useAuth";
import { authRoutes, getRoutesByRole, getHomePath } from "./routes-data";
import DashboardLayout from "../components/layout/DashboardLayout";
import Loading from "../components/common/Loading";

// ============ PROTECTED ROUTE WRAPPER ============
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============ PUBLIC ROUTE WRAPPER ============
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    const homePath = getHomePath("doctor");
    return <Navigate to={homePath} replace />;
  }

  return children;
};

// ============ MAIN ROUTES ============
const AppRoutes = () => {
  const { user, getDoctorType } = useAuth();

  // ✅ استخدام getDoctorType() من الـ context
  const doctorType = getDoctorType();
  const protectedRoutes = getRoutesByRole("doctor", doctorType);

  console.log(protectedRoutes, "protectedRoutes");

  return (
    <Routes>
      {/* Auth Routes (Public) */}
      {authRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}

      {/* Protected Routes - Nested under DashboardLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dynamic Protected Routes */}
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>{route.element}</Suspense>
            }
          />
        ))}
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
