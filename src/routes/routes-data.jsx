// src/routes/routes-data.jsx
import {
  LayoutDashboard,
  Video,
  Calendar,
  Users,
  Stethoscope,
  Settings,
  Clock,
  CalendarOff,
  Settings2,
} from "lucide-react";

import { lazy } from "react";

// ============ AUTH PAGES ============
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));

// ============ ADMIN PAGES ============
const Home = lazy(() => import("../pages/dashboard/Home/Home"));
const Meetings = lazy(() => import("../pages/dashboard/Meetings"));
const UsersPage = lazy(() => import("../pages/dashboard/Users"));
const UserCalendar = lazy(() => import("../pages/dashboard/UserCalendar"));
const Doctors = lazy(() => import("../pages/dashboard/Doctors/Doctors"));
const DoctorCalendar = lazy(
  () => import("../pages/dashboard/Doctors/DoctorCalendar")
);

// ============ DOCTOR PAGES ============
const DoctorMeetings = lazy(() => import("../pages/doctor/Meetings/Meetings"));
const DoctorCalendarPage = lazy(
  () => import("../pages/doctor/Calendar/Calendar")
);
const GeneralSettings = lazy(() => import("../pages/doctor/Settings/Settings"));
const DoctorDashboard = lazy(
  () => import("../pages/doctor/Dashboard/Dashboard")
);

// ============ AUTH ROUTES ============
export const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
];

// ============ ADMIN ROUTES ============
export const adminRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <Home />,
  },
  {
    path: "/meetings",
    label: "Meetings",
    icon: Video,
    element: <Meetings />,
  },
  {
    path: "/doctors",
    label: "Doctors",
    icon: Stethoscope,
    element: <Doctors />,
  },
  {
    path: "/doctors/:doctorId/calendar",
    element: <DoctorCalendar />,
    hidden: true,
  },
  {
    path: "/users",
    label: "Students",
    icon: Users,
    element: <UsersPage />,
  },
  {
    path: "/users/:userId/calendar",
    element: <UserCalendar />,
    hidden: true,
  },
];

// ============ DOCTOR ROUTES ============
export const doctorRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <DoctorDashboard />,
  },
  {
    path: "/settings",
    label: "General Settings",
    icon: Settings2,
    element: <GeneralSettings />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    isGroup: true, // This indicates it's a group with children
    children: [
      {
        path: "/settings/availability",
        label: "Daily Available Time",
        icon: Clock,
        element: <DoctorMeetings />,
      },
      {
        path: "/settings/days-off",
        label: "Days Off",
        icon: CalendarOff,
        element: <DoctorCalendarPage />,
      },
    ],
  },
];

// ============ HELPER FUNCTIONS ============

// Get routes by role (flattened for routing)
export const getRoutesByRole = (role) => {
  const routes =
    role === "admin" ? adminRoutes : role === "doctor" ? doctorRoutes : [];

  const flattenedRoutes = [];
  routes.forEach((route) => {
    if (route.children) {
      route.children.forEach((child) => {
        flattenedRoutes.push(child);
      });
    } else if (route.path) {
      flattenedRoutes.push(route);
    }
  });

  return flattenedRoutes;
};

export const getSidebarItems = (role) => {
  const routes =
    role === "admin" ? adminRoutes : role === "doctor" ? doctorRoutes : [];
  return routes.filter((route) => !route.hidden);
};

export const getHomePath = (role) => {
  return "/dashboard";
};
