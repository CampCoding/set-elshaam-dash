
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../hooks/useAuth";
import { authRoutes, getAppRoutes, adminRoutes } from "./routes-data";
import DashboardLayout from "../components/layout/DashboardLayout";
import Loading from "../components/common/Loading";
import ProtectedRoute from "./ProtectedRoute";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

const AppRoutes = () => {

  const protectedRoutes = getAppRoutes();

  return (
    <Routes>
      {/* Auth Routes */}
      {authRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
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
        {/* 1. التوجيه الافتراضي للرئيسية */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 2. ✅ إعادة التوجيه للمسارات الأب (مثل /gallery إلى /gallery/categories) */}
        {adminRoutes.map((route) => {
          if (route.children && route.children.length > 0) {
            return (
              <Route
                key={`${route.path}-redirect`}
                path={route.path}
                element={
                  <Navigate
                    to={`${route.path}/${route.children[0].path}`}
                    replace
                  />
                }
              />
            );
          }
          return null;
        })}

        {/* 3. توليد المسارات المحمية الفعلية */}
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

      {/* 4. معالجة الصفحات غير الموجودة (404) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
