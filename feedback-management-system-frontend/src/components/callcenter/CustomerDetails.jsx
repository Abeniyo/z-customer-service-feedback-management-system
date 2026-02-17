import React, { useState } from 'react';
import { mockFeedback } from '../../data/mockData';
import './CustomerDetails.css';

const CustomerDetails = ({ onSelectFeedback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredFeedback = mockFeedback.filter(feedback => {
    const matchesSearch = feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customerPhone.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && feedback.status === filter;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'resolved': return 'status-resolved';
      case 'in-progress': return 'status-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="customer-details-container">
      <div className="customer-header">
        <h2>Customer Feedback Records</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="customer-grid">
        {filteredFeedback.map(feedback => (
          <div key={feedback.id} className="customer-card">
            <div className="card-header">
              <h3>{feedback.customerName}</h3>
              <span className={`status-badge ${getStatusClass(feedback.status)}`}>
                {feedback.status}
              </span>
            </div>
            
            <div className="card-details">
              <p><span>📧</span> {feedback.customerEmail}</p>
              <p><span>📞</span> {feedback.customerPhone}</p>
              <p><span>📋</span> {feedback.category}</p>
              <p><span>⭐</span> Rating: {feedback.rating}/5</p>
              <p><span>📅</span> {new Date(feedback.date).toLocaleDateString()}</p>
            </div>

            <div className="card-message">
              <p>"{feedback.message.substring(0, 100)}..."</p>
            </div>

            <div className="card-footer">
              <span className="agent">Agent: {feedback.agent}</span>
              <button 
                className="view-btn"
                onClick={() => onSelectFeedback && onSelectFeedback(feedback)}
                style={{color: 'var(--primary)'}}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <div className="no-results">
          <p>No customers found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;