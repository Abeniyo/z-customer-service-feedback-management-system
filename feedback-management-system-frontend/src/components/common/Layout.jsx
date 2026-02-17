import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Layout.css';

const Layout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo" style={{ background: 'var(--primary)' }}>
            CS
          </div>
          <h3>FeedbackFlow</h3>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-item active">
            <span className="menu-icon">📊</span>
            Dashboard
          </div>
          <div className="menu-item">
            <span className="menu-icon">📝</span>
            Feedback
          </div>
          <div className="menu-item">
            <span className="menu-icon">👥</span>
            Customers
          </div>
          <div className="menu-item">
            <span className="menu-icon">📈</span>
            Reports
          </div>
          {role === 'systemadmin' && (
            <div className="menu-item">
              <span className="menu-icon">⚙️</span>
              System Settings
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <img src={user?.avatar} alt={user?.name} className="user-avatar" />
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="header">
          <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? '☀️' : '🌙'}
          </button>
        </header>
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;