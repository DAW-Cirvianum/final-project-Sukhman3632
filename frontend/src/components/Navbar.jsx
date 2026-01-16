import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Navbar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", adminOnly: true },
    { path: "/dashboard/appointments", label: "Appointments" },
    { path: "/dashboard/vehicles", label: "Vehicles" },
    { path: "/dashboard/clients", label: "Clients", adminOnly: true },
    { path: "/dashboard/repair-orders", label: "Repair Orders", adminOnly: true },
    { path: "/dashboard/services", label: "Services" },
  ];

  const backendUrl = "http://127.0.0.1:8000";

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
    
      <button
        className="hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
      </button>

      {/* Sidebar overlay (mobile) */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">WS</div>
          <div className="brand-text">
            <h1 className="brand-title">Workshop</h1>
            <p className="brand-subtitle">Management System</p>
          </div>
        </div>

        {/* User info */}
        <div className="user-card">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="user-info">
            <p className="user-name">{user?.name || "User"}</p>
            <span className="user-badge">{isAdmin ? "Administrator" : "User"}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="nav-section">
          <p className="nav-section-title">NAVIGATION</p>
          <ul className="nav-list">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => isOpen && toggleSidebar()}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Backend Access (Admin only) */}
          {isAdmin && (
            <>
              <p className="nav-section-title" style={{ marginTop: "20px" }}>BACKEND</p>
              <ul className="nav-list">
                <li>
                  <a
                    href={`${backendUrl}/admin/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    Admin Login
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6.5V10C10 10.2652 9.89464 10.5196 9.70711 10.7071C9.51957 10.8946 9.26522 11 9 11H2C1.73478 11 1.48043 10.8946 1.29289 10.7071C1.10536 10.5196 1 10.2652 1 10V3C1 2.73478 1.10536 2.48043 1.29289 2.29289C1.48043 2.10536 1.73478 2 2 2H5.5M8 1H11M11 1V4M11 1L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Logout button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
            <span>Logout</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
