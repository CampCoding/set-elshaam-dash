import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getSidebarItems } from "../../routes/routes-data";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const sidebarItems = getSidebarItems();

  return (
    <aside className="w-64 bg-primary h-screen text-white flex flex-col fixed left-0 top-0">
      {/* Logo - Fixed at top */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <img
          className="w-full h-[70px] object-cover"
          src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
          alt="Matary Logo"
        />
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white text-primary font-semibold shadow-lg"
                        : "text-white/80 hover:bg-white/10"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-white/10">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer"
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
