import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Layout from '../../components/common/Layout';
import FeedbackForm from '../../components/callcenter/FeedbackForm';
import CustomerDetails from '../../components/callcenter/CustomerDetails';
import DailyReports from '../../components/callcenter/DailyReports';
import './CallCenterPage.css';

const CallCenterPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new-feedback');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const tabs = [
    { id: 'new-feedback', label: 'New Feedback', icon: '📝' },
    { id: 'customers', label: 'Customer Details', icon: '👥' },
    { id: 'reports', label: 'Daily Reports', icon: '📊' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'new-feedback':
        return <FeedbackForm />;
      case 'customers':
        return <CustomerDetails onSelectFeedback={setSelectedFeedback} />;
      case 'reports':
        return <DailyReports />;
      default:
        return null;
    }
  };

  return (
    <Layout role="callcenter">
      <div className="callcenter-page">
        <div className="page-header">
          <div>
            <h1>Welcome back, {user?.name}!</h1>
            <p className="text-muted">Call Center Dashboard • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <span className="stat-icon">📞</span>
              <div>
                <span className="stat-value">12</span>
                <span className="stat-label">Today's Calls</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <div>
                <span className="stat-value">4.8</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CallCenterPage;