import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user?.role === "admin";

    // Redirigir usuaris normals a appointments des del dashboard root
    if (!isAdmin && location.pathname === "/dashboard") {
      navigate("/dashboard/appointments", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}