// src/routes/AppRoutes.jsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { routesData, getProtectedRoutes, getPublicRoutes } from "./routes-data";

// Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Components
import Loading from "../components/common/Loading";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  const protectedRoutes = getProtectedRoutes();
  const publicRoutes = getPublicRoutes();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              !loading && user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                route.element
              )
            }
          />
        ))}

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace("/", "")}
              element={route.element}
            />
          ))}
        </Route>

        {/* 404 - Redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
