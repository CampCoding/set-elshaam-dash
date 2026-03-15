// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getSidebarItems } from "../../routes/routes-data";

const Sidebar = () => {
  const { logout, user, isDoctor } = useAuth();
  const location = useLocation();
  const sidebarItems = getSidebarItems(user?.role);

  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState([]);

  // Auto-expand group if current path is in children
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.isGroup && item.children) {
        const isChildActive = item.children.some(
          (child) => location.pathname === child.path
        );
        if (isChildActive && !expandedGroups.includes(item.key)) {
          setExpandedGroups((prev) => [...prev, item.key]);
        }
      }
    });
  }, [location.pathname, sidebarItems]);

  // Toggle group expansion
  const toggleGroup = (key) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Check if group has active child
  const hasActiveChild = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  // Styles
  const sidebarBg = "bg-primary";
  const activeItemBg = "text-primary";
  const hoverBg = "hover:bg-white/10";

  // Render single nav item
  const renderNavItem = (item, isChild = false) => {
    const Icon = item.icon;

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              isChild ? "ml-4 text-sm" : ""
            } ${
              isActive
                ? `bg-white ${activeItemBg} font-semibold shadow-lg`
                : `text-white/80 ${hoverBg}`
            }`
          }
        >
          <Icon className={`${isChild ? "w-4 h-4" : "w-5 h-5"}`} />
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  // Render group with children
  const renderGroup = (item) => {
    const Icon = item.icon;
    const isExpanded = expandedGroups.includes(item.key);
    const isActive = hasActiveChild(item.children);

    return (
      <li key={item.key}>
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(item.key)}
          className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-white/20 text-white font-semibold"
              : `text-white/80 ${hoverBg}`
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Children */}
        <ul
          className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children?.map((child) => renderNavItem(child, true))}
        </ul>
      </li>
    );
  };

  return (
    <aside
      className={`w-64 ${sidebarBg} h-screen text-white flex flex-col fixed left-0 top-0`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <img
          className="w-full h-[70px] object-cover"
          src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
          alt="Matary Logo"
        />
        {/* Role Badge */}
        <div className="mt-3 text-center">
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              isDoctor ? "bg-emerald-600" : "bg-primary-light"
            }`}
          >
            {isDoctor ? "Doctor Portal" : "Admin Dashboard"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <nav className="h-full p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              if (item.isGroup) {
                return renderGroup(item);
              }
              return renderNavItem(item);
            })}
          </ul>
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="flex-shrink-0 border-t border-white/10">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-white/60 truncate">
                {isDoctor ? user?.specialization : user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer`}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
