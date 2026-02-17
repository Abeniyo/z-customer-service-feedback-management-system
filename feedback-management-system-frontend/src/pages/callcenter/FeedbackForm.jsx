import React, { useState } from 'react';
import Button from '../common/Button';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    category: 'General Inquiry',
    rating: 5,
    message: '',
    status: 'pending'
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Billing Inquiry',
    'Product Information',
    'Complaint',
    'Feedback'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would be an API call
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        category: 'General Inquiry',
        rating: 5,
        message: '',
        status: 'pending'
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="feedback-success">
        <div className="success-icon">✓</div>
        <h2>Feedback Submitted Successfully!</h2>
        <p>Thank you for recording the customer feedback.</p>
        <Button onClick={() => setSubmitted(false)} variant="primary">
          Add Another Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="feedback-form-container">
      <h2>Record Customer Feedback</h2>
      <p className="form-subtitle">Enter the details of the customer interaction</p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="customer@email.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Customer Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="+1 234-567-8901"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Rating (1-5)</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className="rating-label">
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={formData.rating === num}
                    onChange={handleChange}
                  />
                  <span className={`rating-star ${formData.rating >= num ? 'active' : ''}`}>
                    ★
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Feedback Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe the customer's feedback or issue..."
            required
            rows="5"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" size="large">
            Submit Feedback
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            size="large"
            onClick={() => setFormData({
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              category: 'General Inquiry',
              rating: 5,
              message: '',
              status: 'pending'
            })}
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;