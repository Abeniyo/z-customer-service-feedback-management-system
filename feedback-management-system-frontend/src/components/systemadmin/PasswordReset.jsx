import React, { useState } from 'react';
import './UserManagement.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Simulate password reset
    setMessage(`Password reset successfully for ${email}`);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="password-reset">
      <h2>Reset User Password</h2>
      <p className="subtitle">System administrators can reset passwords for any user</p>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="reset-form">
        <div className="form-group">
          <label>User Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user's email"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>New Password *</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-primary" style={{background: 'var(--primary)'}}>
          Reset Password
        </button>
      </form>

      <div className="reset-note">
        <p>⚠️ The user will need to use this new password on their next login.</p>
      </div>
    </div>
  );
};

export default PasswordReset;