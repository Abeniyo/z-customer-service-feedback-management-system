import React, { useState } from 'react';
import './UserManagement.css';

const UserCreation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'callcenter',
    department: ''
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'admin', department: 'Management', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'callcenter', department: 'Support', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@company.com', role: 'callcenter', department: 'Support', status: 'inactive' }
  ]);

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      ...formData,
      status: 'active'
    };
    setUsers([...users, newUser]);
    setSuccess(`User ${formData.name} created successfully!`);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'callcenter',
      department: ''
    });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="user-management">
      <h2>Create New User</h2>
      <p className="subtitle">Add new users to the system</p>

      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@company.com"
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter temporary password"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="callcenter">Call Center Agent</option>
              <option value="admin">Admin</option>
              <option value="systemadmin">System Admin</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Customer Support, Technical Support"
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-primary" style={{background: 'var(--primary)'}}>
          Create User
        </button>
      </form>

      <div className="users-list">
        <h3>Existing Users</h3>
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="role-cell">{user.role}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserCreation;