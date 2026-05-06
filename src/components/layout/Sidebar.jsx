
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getSidebarItems } from "../../routes/routes-data";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const sidebarItems = getSidebarItems();


  const [openMenus, setOpenMenus] = useState({});


  useEffect(() => {
    const currentOpenMenus = {};
    sidebarItems.forEach((item) => {
      if (item.children && location.pathname.startsWith(item.path)) {
        currentOpenMenus[item.path] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...currentOpenMenus }));
  }, [location.pathname]);

  const toggleMenu = (path) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarClasses = `
    bg-primary h-screen text-white flex flex-col fixed right-0 top-0 z-50
    transition-transform duration-300 ease-in-out
    w-64 sm:w-72 lg:w-64
    ${isMobile ? (isOpen ? "translate-x-0" : "translate-x-full") : "translate-x-0"}
  `;

  return (
    <aside className={sidebarClasses} dir="rtl">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0 relative">
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <img
          className="w-full h-[50px] sm:h-[60px] lg:h-[70px] landscape:h-[40px] object-contain"
          src="https://res.cloudinary.com/dhgp9dzdt/image/upload/v1772620899/logo_udnowq.png"
          alt="ست الشام"
        />

        {/* Role Badge */}
        <div className="mt-3 text-center">
          <span className="text-xs px-3 py-1 rounded-full bg-accent text-primary font-semibold">
            لوحة التحكم
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <nav className="h-full p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 sm:space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;


              if (item.children) {
                const isMenuOpen = openMenus[item.path];
                const isChildActive = location.pathname.startsWith(item.path);

                return (
                  <li key={item.path} className="flex flex-col">
                    <button
                      onClick={() => toggleMenu(item.path)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 w-full ${isChildActive || isMenuOpen
                          ? "bg-white/10 text-white font-semibold"
                          : "text-white/80 hover:bg-white/10"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* العناصر الفرعية */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen
                          ? "max-h-48 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                        }`}
                    >
                      <ul className="ms-4 space-y-1 border-s-2 border-white/20">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childPath = `${item.path}/${child.path}`;

                          return (
                            <li key={childPath}>
                              <NavLink
                                to={childPath}
                                onClick={() => isMobile && onClose?.()}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${isActive
                                    ? "bg-white text-accent! font-semibold shadow-md"
                                    : "text-white/70! hover:text-white! hover:bg-white/5!"
                                  }`
                                }
                              >
                                <ChildIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{child.label}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }


              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => isMobile && onClose?.()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive
                        ? "bg-white text-accent! font-semibold shadow-lg"
                        : "text-white/80! hover:bg-white/10!"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="flex-shrink-0 border-t border-white/10">
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-accent">
              {user?.full_name?.charAt(0) || "م"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {user?.full_name || "مدير النظام"}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 sm:py-3 rounded-lg text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
