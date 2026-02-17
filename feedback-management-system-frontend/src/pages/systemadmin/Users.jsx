import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

// Import React Icons
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiLock,
  FiUnlock,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';

const SystemUsers = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  const menuItems = [
    { path: '/systemadmin', label: 'Dashboard', icon: FiHome },
    { path: '/systemadmin/users', label: 'User Management', icon: FiUsers, active: true },
    { path: '/systemadmin/audit-logs', label: 'Audit Logs', icon: FiBarChart2 },
    { path: '/systemadmin/settings', label: 'System Settings', icon: FiSettings },
  ];

  // Mock data
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@company.com', 
      phone: '+1 234-567-8901',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-02-17 09:30 AM',
      created: '2024-01-15',
      department: 'Management',
      avatar: null
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@company.com', 
      phone: '+1 234-567-8902',
      role: 'callcenter',
      status: 'active',
      lastLogin: '2026-02-17 08:45 AM',
      created: '2024-02-20',
      department: 'Customer Support',
      avatar: null
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.j@company.com', 
      phone: '+1 234-567-8903',
      role: 'callcenter',
      status: 'inactive',
      lastLogin: '2026-02-15 02:15 PM',
      created: '2024-03-10',
      department: 'Technical Support',
      avatar: null
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah.w@company.com', 
      phone: '+1 234-567-8904',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-02-16 11:20 AM',
      created: '2023-11-05',
      department: 'Operations',
      avatar: null
    },
    { 
      id: 5, 
      name: 'David Brown', 
      email: 'david.b@company.com', 
      phone: '+1 234-567-8905',
      role: 'systemadmin',
      status: 'active',
      lastLogin: '2026-02-17 10:15 AM',
      created: '2023-10-01',
      department: 'IT',
      avatar: null
    },
    { 
      id: 6, 
      name: 'Emily Davis', 
      email: 'emily.d@company.com', 
      phone: '+1 234-567-8906',
      role: 'callcenter',
      status: 'locked',
      lastLogin: '2026-02-14 04:30 PM',
      created: '2024-05-12',
      department: 'Customer Support',
      avatar: null
    },
    { 
      id: 7, 
      name: 'Robert Taylor', 
      email: 'robert.t@company.com', 
      phone: '+1 234-567-8907',
      role: 'callcenter',
      status: 'pending',
      lastLogin: 'Never',
      created: '2026-02-16',
      department: 'Billing',
      avatar: null
    },
    { 
      id: 8, 
      name: 'Lisa Anderson', 
      email: 'lisa.a@company.com', 
      phone: '+1 234-567-8908',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-02-16 03:45 PM',
      created: '2024-04-18',
      department: 'HR',
      avatar: null
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      case 'locked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'systemadmin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'callcenter': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FiCheckCircle className="w-4 h-4" />;
      case 'inactive': return <FiUserX className="w-4 h-4" />;
      case 'locked': return <FiLock className="w-4 h-4" />;
      case 'pending': return <FiClock className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: FiUsers, change: '+3', color: 'red' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: FiUserCheck, change: '+2', color: 'green' },
    { label: 'Locked Accounts', value: users.filter(u => u.status === 'locked').length, icon: FiLock, change: '-1', color: 'yellow' },
    { label: 'Pending Approval', value: users.filter(u => u.status === 'pending').length, icon: FiClock, change: '+1', color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col h-full
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FeedbackFlow" className="h-10 w-auto" />
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">FeedbackFlow</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                System Admin
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name || 'System Admin'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'admin@system.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${item.active 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Management
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCreateModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add User
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'S'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Your Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Settings
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = {
                  red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                  green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                };
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from last month
                        </p>
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
                    placeholder="Search users by name, email or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="locked">Locked</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
                              {userItem.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{userItem.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Created: {userItem.created}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FiMail className="w-3 h-3" />
                              <span>{userItem.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FiPhone className="w-3 h-3" />
                              <span>{userItem.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                            <FiShield className="w-3 h-3" />
                            {userItem.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(userItem.status)}`}>
                            {getStatusIcon(userItem.status)}
                            {userItem.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                          {userItem.lastLogin}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:text-blue-700">
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-700">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            {userItem.status === 'locked' ? (
                              <button className="p-1 text-green-600 hover:text-green-700">
                                <FiUnlock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="p-1 text-yellow-600 hover:text-yellow-700">
                                <FiLock className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing 1 to {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white text-sm">1</button>
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">2</button>
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">3</button>
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h2>
                <button
                  onClick={() => setCreateModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="user@company.com"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 234-567-8901"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Customer Support"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role *
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="callcenter">Call Center Agent</option>
                      <option value="admin">Admin</option>
                      <option value="systemadmin">System Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Temporary Password *
                    </label>
                    <input
                      type="password"
                      placeholder="Enter temporary password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setCreateModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsers;