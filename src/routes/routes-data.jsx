// src/routes/routes-data.jsx
import { lazy } from "react";
import {
  LayoutDashboard,
  Users,
  LayoutList,
  Heart,
  MessageSquare,
  Settings,
  FileText,
  Bell,
  Package,
  MessageCircleQuestion,
  Image as ImageIcon,
  Images,
  Layers,
  Euro,
  Phone,
  Newspaper,
} from "lucide-react";

// Auth Pages (No Lazy)
import Login from "../pages/auth/Login";

// Admin Pages (Lazy)
const Dashboard = lazy(() => import("../pages/dashboard/Home/Home"));
const UsersPage = lazy(() => import("../pages/dashboard/Users/UsersPage"));
const UserProfilePage = lazy(
  () => import("../pages/dashboard/Users/UserProfilePage")
);
const ProfilesPage = lazy(() => import("../pages/dashboard/profiles/Profiles"));
const Services = lazy(() => import("../pages/dashboard/Services/Services"));
const Packages = lazy(() => import("../pages/dashboard/packages/Packages"));
const Faqs = lazy(() => import("../pages/dashboard/faqs/Faqs"));
const GalleryItems = lazy(
  () => import("../pages/dashboard/gallery/items/GalleryItems")
);
const Categories = lazy(
  () => import("../pages/dashboard/gallery/categories/Categories")
);
const StagesPrice = lazy(
  () => import("../pages/dashboard/stagePrice/StagesPrice")
);
const TicketsList = lazy(() => import("../pages/dashboard/Tickets/TicketsList"));
const TicketDetails = lazy(
  () => import("../pages/dashboard/Tickets/TicketDetails")
);

// Legal Pages (Lazy)
const PolicyPrivacy = lazy(
  () => import("../pages/dashboard/policies/PolicyPrivacy")
);
const Contract = lazy(() => import("../pages/dashboard/policies/Contract"));
const SiteContract = lazy(
  () => import("../pages/dashboard/profiles/components/SiteContract")
);

const PagesContent = lazy(
  () => import("../pages/dashboard/pagesContent/PagesContent")
);

const SiteSettings = lazy(
  () => import("../pages/dashboard/settings/SiteSettings")
);

const ContactInfo = lazy(
  () => import("../pages/dashboard/contactInfo/ContactInfo")
);

const Banners = lazy(
  () => import("../pages/dashboard/banners/Banners")
);

const News = lazy(
  () => import("../pages/dashboard/news/News")
);


// ============ AUTH ROUTES ============
export const authRoutes = [{ path: "/login", element: <Login /> }];

// ============ ADMIN ROUTES (Single Source of Truth) ============
// المصفوفة دي بتشغل الـ Router و الـ Sidebar مع بعض
export const adminRoutes = [
  {
    path: "/dashboard",
    label: "الرئيسية",
    icon: LayoutDashboard,
    element: <Dashboard />,
  },

  {
    path: "/profiles",
    label: "الملفات الشخصية",
    icon: Users,
    element: <ProfilesPage />,
  },
  {
    path: "/users",
    label: "المستخدمين",
    icon: Users,
    element: <UsersPage />,
  },
  {
    path: "/users/:id",
    element: <UserProfilePage />,
    hidden: true,
  },
  {
    path: "/services",
    label: "الخدمات",
    icon: LayoutList,
    element: <Services />,
  },

  {
    path: "/packages",
    label: "باقات الأفراح",
    icon: Package,
    element: <Packages />,
  },

  {
    path: "/pages-content",
    label: "محتوى الصفحات",
    icon: FileText,
    element: <PagesContent />,
  },
  {
    path: "/news",
    label: "الأخبار والمقالات",
    icon: Newspaper,
    element: <News />,
  },
  {
    path: "/gallery",
    label: "المعرض",
    icon: Images,
    element: <GalleryItems />,
  },



  {
    path: "/settings",
    label: "إعدادات الموقع",
    icon: Settings,
    element: <SiteSettings />,
  },
  {
    path: "/contact-info",
    label: "بيانات التواصل",
    icon: Phone,
    element: <ContactInfo />,
  },
  {
    path: "/banners",
    label: "إدارة البنرات",
    icon: Layers,
    element: <Banners />,
  },
  {
    path: "/faqs",
    label: "الأسئلة الشائعة",
    icon: MessageCircleQuestion,
    element: <Faqs />,
  },




  {
    path: "/stages-price",
    label: "سعر المراحل",
    icon: Euro,
    element: <StagesPrice />,
  },
  {
    path: "/tickets",
    label: "التذاكر والدعم",
    icon: MessageSquare,
    element: <TicketsList />,
  },
  {
    path: "/tickets/:id",
    element: <TicketDetails />,
    hidden: true,
  },

  {
    path: "users/:id/contract",
    label: "العقد",
    icon: FileText,
    hidden: true,
    element: <SiteContract />,
  },

  {
    path: "/gallery/items",
    label: "إدارة المعرض",
    icon: Images,
    element: <GalleryItems />,
  },



  {
    path: "/policies",
    label: "السياسات والشروط",
    icon: FileText,
    children: [
      {
        path: "privacy",
        element: <PolicyPrivacy />,
        label: "سياسة الخصوصية",
        icon: FileText,
      },
      {
        path: "contract",
        element: <Contract />,
        label: "العقد",
        icon: FileText,
      },
    ],
  },
];

// ============ HELPER FUNCTIONS ============

// 1. الدالة دي بتجيب كل المسارات عشان الـ AppRoutes (الراوتر)
export const getAppRoutes = () => {
  const flattenedRoutes = [];

  adminRoutes.forEach((route) => {
    if (route.children) {
      // ✅ التعديل هنا: دمج مسار الأب مع مسار الابن
      route.children.forEach((child) => {
        flattenedRoutes.push({
          ...child,
          path: `${route.path}/${child.path}`, // هيخليها /gallery/categories
        });
      });
    } else if (route.path) {
      flattenedRoutes.push(route);
    }
  });

  return flattenedRoutes;
};

// 2. الدالة دي بتجيب العناصر اللي هتظهر في الـ Sidebar بس
export const getSidebarItems = () => {
  return adminRoutes.filter((route) => !route.hidden);
};
