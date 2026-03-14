import {
  LayoutDashboard,
  Video,
  Calendar,
  Users,
  Settings,
  GraduationCap,
  Stethoscope,
} from "lucide-react";

import { lazy } from "react";

const Home = lazy(() => import("../pages/dashboard/Home/Home"));
const Meetings = lazy(() => import("../pages/dashboard/Meetings"));
const UsersPage = lazy(() => import("../pages/dashboard/Users"));
const UserCalendar = lazy(() => import("../pages/dashboard/UserCalendar"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Doctors = lazy(() => import("../pages/dashboard/Doctors/Doctors"));
const DoctorCalendar = lazy(
  () => import("../pages/dashboard/Doctors/DoctorCalendar")
);

export const routesData = [
  // Auth
  { path: "/login", element: <Login />, protected: false, hidden: true },
  { path: "/signup", element: <Signup />, protected: false, hidden: true },

  // Dashboard
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <Home />,
    protected: true,
  },
  {
    path: "/meetings",
    label: "Meetings",
    icon: Video,
    element: <Meetings />,
    protected: true,
  },
  {
    path: "/doctors",
    label: "Doctors",
    icon: Stethoscope,
    element: <Doctors />,
    protected: true,
  },
  {
    path: "/doctors/:doctorId/calendar",
    element: <DoctorCalendar />,
    protected: true, // ✅ Add protected: true
    hidden: true,
  },
  {
    path: "/users",
    label: "Students",
    icon: Users,
    element: <UsersPage />,
    protected: true,
  },
  {
    path: "/users/:userId/calendar",
    element: <UserCalendar />,
    protected: true,
    hidden: true,
  },
];

// Helper functions
export const getSidebarItems = () =>
  routesData.filter((route) => route.protected && !route.hidden);

export const getProtectedRoutes = () =>
  routesData.filter((route) => route.protected);

export const getPublicRoutes = () =>
  routesData.filter((route) => !route.protected);
