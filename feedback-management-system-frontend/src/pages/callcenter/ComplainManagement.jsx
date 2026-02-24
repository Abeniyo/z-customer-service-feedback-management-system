import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';

// Sample static complaints data
const SAMPLE_COMPLAINTS = [
  {
    id: 1,
    customerName: "John Doe",
    phone: "+251911234567",
    complaintType: "Service Issue",
    description: "Poor customer service at branch",
    status: "pending",
    priority: "high",
    date: "2024-02-24",
    branch: "Main Branch"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    phone: "+251922345678",
    complaintType: "Billing Problem",
    description: "Wrong amount charged",
    status: "in-progress",
    priority: "medium",
    date: "2024-02-23",
    branch: "Downtown"
  },
  {
    id: 3,
    customerName: "Ahmed Hassan",
    phone: "+251933456789",
    complaintType: "Technical Issue",
    description: "Mobile app not working",
    status: "resolved",
    priority: "low",
    date: "2024-02-22",
    branch: "Northside"
  }
];

const ComplainManagement = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState(SAMPLE_COMPLAINTS);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    complaintType: '',
    description: '',
    priority: 'medium',
    branch: '',
    status: 'pending'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingComplaint) {
      // Update existing
      setComplaints(complaints.map(c => 
        c.id === editingComplaint.id ? { ...formData, id: c.id } : c
      ));
    } else {
      // Add new
      const newComplaint = {
        ...formData,
        id: complaints.length + 1,
        date: new Date().toISOString().split('T')[0]
      };
      setComplaints([newComplaint, ...complaints]);
    }
    
    // Reset form
    setFormData({
      customerName: '',
      phone: '',
      complaintType: '',
      description: '',
      priority: 'medium',
      branch: '',
      status: 'pending'
    });
    setShowForm(false);
    setEditingComplaint(null);
  };

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setFormData(complaint);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <CallCenterSidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Complain Management
          </h1>
          
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
            
            <button
              onClick={() => {
                setShowForm(true);
                setEditingComplaint(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + New Complaint
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{complaints.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {complaints.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {complaints.filter(c => c.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint.id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-3">#{complaint.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{complaint.customerName}</div>
                      <div className="text-sm text-gray-500">{complaint.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{complaint.complaintType}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{complaint.description}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{complaint.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(complaint)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Complaint Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingComplaint ? 'Edit Complaint' : 'New Complaint'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Customer Name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  
                  <input
                    type="text"
                    name="complaintType"
                    placeholder="Complaint Type"
                    value={formData.complaintType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    rows="3"
                    required
                  />
                  
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  
                  <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  
                  {editingComplaint && (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingComplaint ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingComplaint(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplainManagement;