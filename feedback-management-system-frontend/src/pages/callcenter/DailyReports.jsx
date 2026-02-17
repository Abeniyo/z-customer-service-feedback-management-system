import React, { useState } from 'react';
import { mockDailyReports, mockWeeklyReports, mockMonthlyReports, mockYearlyReports } from '../../data/mockData';
import Button from '../common/Button';
import './DailyReports.css';

const DailyReports = () => {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getReports = () => {
    switch(reportType) {
      case 'daily':
        return mockDailyReports;
      case 'weekly':
        return mockWeeklyReports;
      case 'monthly':
        return mockMonthlyReports;
      case 'yearly':
        return mockYearlyReports;
      default:
        return [];
    }
  };

  const reports = getReports();

  const renderDailyReport = (report, index) => (
    <div key={index} className="report-card">
      <div className="report-header">
        <h3>{new Date(report.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</h3>
        <span className={`status-badge ${report.satisfactionRate >= 90 ? 'excellent' : report.satisfactionRate >= 80 ? 'good' : 'average'}`}>
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
        <div className="category-bars">
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
    </div>
  );

  const renderWeeklyReport = (report, index) => (
    <div key={index} className="report-card">
      <div className="report-header">
        <h3>{report.week}</h3>
        <span className={`trend-badge ${report.trend.startsWith('+') ? 'positive' : 'negative'}`}>
          {report.trend}
        </span>
      </div>
      <p className="date-range">{report.startDate} - {report.endDate}</p>
      
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

  const renderMonthlyReport = (report, index) => (
    <div key={index} className="report-card">
      <div className="report-header">
        <h3>{report.month}</h3>
        <span className={`trend-badge ${report.trend.startsWith('+') ? 'positive' : 'negative'}`}>
          {report.trend}
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

      <div className="top-performers">
        <h4>Top Performers</h4>
        <div className="performer-list">
          {report.topPerformers.map((performer, idx) => (
            <span key={idx} className="performer-tag">{performer}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderYearlyReport = (report, index) => (
    <div key={index} className="report-card">
      <div className="report-header">
        <h3>{report.year} Annual Report</h3>
        <span className={`trend-badge ${report.growth.startsWith('+') ? 'positive' : 'negative'}`}>
          {report.growth} Growth
        </span>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{report.totalCalls.toLocaleString()}</span>
          <span className="stat-label">Total Calls</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{report.resolved.toLocaleString()}</span>
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

      <div className="quarterly-breakdown">
        <h4>Quarterly Breakdown</h4>
        <div className="quarter-grid">
          {report.quarterlyBreakdown.map((quarter, idx) => (
            <div key={idx} className="quarter-item">
              <span className="quarter-name">{quarter.quarter}</span>
              <span className="quarter-calls">{quarter.calls} calls</span>
              <span className="quarter-rating">Rating: {quarter.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Performance Reports</h2>
        <div className="report-type-selector">
          <Button 
            variant={reportType === 'daily' ? 'primary' : 'secondary'}
            onClick={() => setReportType('daily')}
            size="small"
          >
            Daily
          </Button>
          <Button 
            variant={reportType === 'weekly' ? 'primary' : 'secondary'}
            onClick={() => setReportType('weekly')}
            size="small"
          >
            Weekly
          </Button>
          <Button 
            variant={reportType === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setReportType('monthly')}
            size="small"
          >
            Monthly
          </Button>
          <Button 
            variant={reportType === 'yearly' ? 'primary' : 'secondary'}
            onClick={() => setReportType('yearly')}
            size="small"
          >
            Yearly
          </Button>
        </div>
      </div>

      {reportType === 'daily' && (
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      )}

      <div className="reports-list">
        {reports.length > 0 ? (
          reports.map((report, index) => {
            switch(reportType) {
              case 'daily':
                return renderDailyReport(report, index);
              case 'weekly':
                return renderWeeklyReport(report, index);
              case 'monthly':
                return renderMonthlyReport(report, index);
              case 'yearly':
                return renderYearlyReport(report, index);
              default:
                return null;
            }
          })
        ) : (
          <div className="no-data">
            <p>No reports available for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReports;