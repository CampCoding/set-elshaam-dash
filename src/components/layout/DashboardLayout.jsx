// src/components/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Left side for LTR */}
      <Sidebar />

      {/* Main Content - Right side for LTR */}
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
