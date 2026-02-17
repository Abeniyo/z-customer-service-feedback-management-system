import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';

// Import React Icons
import { 
  FiSearch, 
  FiFilter, 
  FiMail, 
  FiPhone, 
  FiStar, 
  FiCalendar,
  FiUser,
  FiMoreVertical,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit
} from 'react-icons/fi';

const Customers = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  // Mock data
  const customers = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      phone: '+1 234-567-8901',
      totalCalls: 12,
      averageRating: 4.8,
      lastContact: '2026-02-17',
      status: 'active',
      feedbacks: [
        { id: 1, date: '2026-02-17', rating: 5, message: 'Excellent service!', agent: 'Jane Smith' },
        { id: 2, date: '2026-02-15', rating: 4, message: 'Very helpful', agent: 'Jane Smith' }
      ]
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@email.com', 
      phone: '+1 234-567-8902',
      totalCalls: 8,
      averageRating: 4.5,
      lastContact: '2026-02-16',
      status: 'active',
      feedbacks: [
        { id: 3, date: '2026-02-16', rating: 4, message: 'Good support', agent: 'John Agent' }
      ]
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob.johnson@email.com', 
      phone: '+1 234-567-8903',
      totalCalls: 5,
      averageRating: 4.2,
      lastContact: '2026-02-14',
      status: 'inactive',
      feedbacks: []
    },
    { 
      id: 4, 
      name: 'Alice Williams', 
      email: 'alice.w@email.com', 
      phone: '+1 234-567-8904',
      totalCalls: 15,
      averageRating: 4.9,
      lastContact: '2026-02-17',
      status: 'active',
      feedbacks: [
        { id: 4, date: '2026-02-17', rating: 5, message: 'Amazing service!', agent: 'Jane Smith' }
      ]
    },
    { 
      id: 5, 
      name: 'Charlie Brown', 
      email: 'charlie.b@email.com', 
      phone: '+1 234-567-8905',
      totalCalls: 3,
      averageRating: 4.0,
      lastContact: '2026-02-10',
      status: 'inactive',
      feedbacks: []
    },
    { 
      id: 6, 
      name: 'Diana Prince', 
      email: 'diana.p@email.com', 
      phone: '+1 234-567-8906',
      totalCalls: 20,
      averageRating: 5.0,
      lastContact: '2026-02-17',
      status: 'active',
      feedbacks: [
        { id: 5, date: '2026-02-17', rating: 5, message: 'Perfect!', agent: 'Jane Smith' }
      ]
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && customer.status === filter;
  });

  const getStatusStyles = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: FiUsers, color: 'purple' },
    { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, icon: FiCheckCircle, color: 'green' },
    { label: 'Avg Rating', value: '4.7', icon: FiStar, color: 'yellow' },
    { label: 'Total Calls', value: customers.reduce((acc, c) => acc + c.totalCalls, 0), icon: FiPhone, color: 'blue' }
  ];

  const getColorStyles = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed at top */}


        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${getColorStyles(stat.color)} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select 
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <div 
                  key={customer.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-1 cursor-pointer group"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setViewModal(true);
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiPhone className="w-4 h-4 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{customer.totalCalls}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{customer.averageRating}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {new Date(customer.lastContact).toLocaleDateString().slice(0,5)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.feedbacks.length} feedbacks
                      </span>
                      <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details
                        <FiEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No customers found matching your search</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilter('all'); }}
                  className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Customer Modal */}
      {viewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h2>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiMail className="w-4 h-4" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiPhone className="w-4 h-4" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedCustomer.totalCalls}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.averageRating}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Feedback History</h3>
                {selectedCustomer.feedbacks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.feedbacks.map(feedback => (
                      <div key={feedback.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{feedback.rating}/5</span>
                          </div>
                          <span className="text-xs text-gray-500">{feedback.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">"{feedback.message}"</p>
                        <p className="text-xs text-gray-500">Agent: {feedback.agent}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">No feedback history available</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <Link
                  to="/callcenter/new-feedback"
                  state={{ customer: selectedCustomer }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  New Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;