import React, { useState } from 'react';
import './UserManagement.css';

const AuditLogs = () => {
  const [dateFilter, setDateFilter] = useState('today');

  const logs = [
    { id: 1, timestamp: '2026-02-17 09:23:15', user: 'System Admin', action: 'User Created', target: 'john.doe@company.com', status: 'success' },
    { id: 2, timestamp: '2026-02-17 10:45:22', user: 'System Admin', action: 'Password Reset', target: 'jane.smith@company.com', status: 'success' },
    { id: 3, timestamp: '2026-02-17 11:12:08', user: 'System Admin', action: 'User Deactivated', target: 'bob.johnson@company.com', status: 'success' },
    { id: 4, timestamp: '2026-02-16 14:30:45', user: 'System Admin', action: 'Login Attempt', target: 'unknown@company.com', status: 'failed' },
    { id: 5, timestamp: '2026-02-16 09:05:33', user: 'Admin', action: 'Report Generated', target: 'Monthly Report', status: 'success' },
    { id: 6, timestamp: '2026-02-15 16:20:19', user: 'System Admin', action: 'Settings Changed', target: 'Security Settings', status: 'success' },
  ];

  const getStatusClass = (status) => {
    return status === 'success' ? 'status-success' : 'status-failed';
  };

  return (
    <div className="audit-logs">
      <div className="audit-header">
        <h2>System Audit Logs</h2>
        <div className="audit-filters">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.target}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="audit-summary">
        <h3>Summary</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Actions Today:</span>
            <span className="summary-value">156</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Successful:</span>
            <span className="summary-value success">152</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Failed:</span>
            <span className="summary-value failed">4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;