import React, { useState } from 'react';
import { mockDailyReports, mockWeeklyReports, mockMonthlyReports, mockYearlyReports } from '../../data/mockData';
import './DailyReports.css';

const DailyReports = () => {
  const [reportType, setReportType] = useState('daily');

  const getReports = () => {
    switch(reportType) {
      case 'daily': return mockDailyReports;
      case 'weekly': return mockWeeklyReports;
      case 'monthly': return mockMonthlyReports;
      case 'yearly': return mockYearlyReports;
      default: return [];
    }
  };

  const reports = getReports();

  const renderReport = (report, index) => {
    if (reportType === 'daily') {
      return (
        <div key={index} className="report-card">
          <div className="report-header">
            <h3>{new Date(report.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            <span className={`satisfaction-badge ${report.satisfactionRate >= 90 ? 'excellent' : report.satisfactionRate >= 80 ? 'good' : 'average'}`}>
              {report.satisfactionRate}% Satisfaction
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{report.totalCalls}</span>
              <span className="stat-label">Total Calls</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{report.resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{report.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{report.averageRating}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>

          <div className="categories-section">
            <h4>Top Categories</h4>
            {report.topCategories.map((cat, idx) => (
              <div key={idx} className="category-item">
                <span className="category-name">{cat.name}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(cat.count / report.totalCalls) * 100}%`,
                      background: 'var(--primary)'
                    }}
                  />
                </div>
                <span className="category-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="report-card">
        <div className="report-header">
          <h3>{report.week || report.month || report.year}</h3>
          <span className={`trend-badge ${report.trend?.startsWith('+') ? 'positive' : 'negative'}`}>
            {report.trend || report.growth}
          </span>
        </div>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{report.totalCalls}</span>
            <span className="stat-label">Total Calls</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{report.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{report.averageRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{report.satisfactionRate}%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Performance Reports</h2>
        <div className="report-type-selector">
          {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
            <button
              key={type}
              className={`type-btn ${reportType === type ? 'active' : ''}`}
              onClick={() => setReportType(type)}
              style={reportType === type ? {background: 'var(--primary)', color: 'white'} : {}}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="reports-list">
        {reports.map(renderReport)}
      </div>
    </div>
  );
};

export default DailyReports;