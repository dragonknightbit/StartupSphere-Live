import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, role, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = {
    founder: [
      { path: "/startup", label: "Founder Workspace", icon: "🚀" }
    ],
    investor: [
      { path: "/investor", label: "Dashboard", icon: "📈" },
      { path: "/startups", label: "Discover Startups", icon: "🔍" },
    ],
    mentor: [
      { path: "/mentor", label: "Dashboard", icon: "👨‍🏫" },
      { path: "/startups", label: "Startups", icon: "💡" },
    ],
    admin: [
      { path: "/admin", label: "Admin Console", icon: "⚙️" },
    ]
  };

  const links = menuItems[role] || [];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="text-decoration-none">
            <h3 className="brand-logo">StartupSphere</h3>
          </Link>
        </div>
        
        <div className="sidebar-user-profile">
          <div className="avatar">{userName?.charAt(0) || 'U'}</div>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role badge bg-primary-soft">{role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.path} 
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h4 className="page-title">
            {links.find(l => l.path === location.pathname)?.label || 'Dashboard'}
          </h4>
          <div className="topbar-actions">
            <span className="notification-bell">🔔</span>
          </div>
        </header>
        <div className="dashboard-content-scrollable">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
