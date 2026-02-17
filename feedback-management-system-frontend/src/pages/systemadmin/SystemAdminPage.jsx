import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import UserCreation from '../../components/systemadmin/UserCreation';
import PasswordReset from '../../components/systemadmin/PasswordReset';
import AuditLogs from '../../components/systemadmin/AuditLogs';
import './SystemAdminPage.css';

const SystemAdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch(activeTab) {
      case 'users':
        return <UserCreation />;
      case 'password':
        return <PasswordReset />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <UserCreation />;
    }
  };

  return (
    <Layout role="systemadmin">
      <div className="systemadmin-page">
        <div className="page-header">
          <h1>System Administration</h1>
          <p className="date">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-value">24</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <span className="stat-value">156</span>
              <span className="stat-label">Actions Today</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">Pending Resets</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">98%</span>
              <span className="stat-label">System Health</span>
            </div>
          </div>
        </div>

        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">➕</span>
            Create Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <span className="tab-icon">🔄</span>
            Reset Passwords
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <span className="tab-icon">📋</span>
            Audit Logs
          </button>
        </div>

        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default SystemAdminPage;