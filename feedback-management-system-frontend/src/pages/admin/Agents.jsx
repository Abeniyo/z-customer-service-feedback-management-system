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
  FiTrendingUp,
  FiLogOut,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
  FiStar,
  FiPhone,
  FiMail,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMoreVertical,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

const Agents = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/agents', label: 'Agents', icon: FiUsers, active: true },
    { path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  // Mock data
  const agents = [
    { 
      id: 1, 
      name: 'Jane Smith', 
      email: 'jane.smith@company.com', 
      phone: '+1 234-567-8901',
      role: 'Senior Agent',
      status: 'online',
      calls: 145,
      avgRating: 4.9,
      satisfaction: 98,
      avgTime: '3.2 min',
      department: 'Technical Support',
      joinDate: '2024-01-15',
      avatar: null
    },
    { 
      id: 2, 
      name: 'John Doe', 
      email: 'john.doe@company.com', 
      phone: '+1 234-567-8902',
      role: 'Agent',
      status: 'busy',
      calls: 128,
      avgRating: 4.7,
      satisfaction: 94,
      avgTime: '4.1 min',
      department: 'Billing',
      joinDate: '2024-03-20',
      avatar: null
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.j@company.com', 
      phone: '+1 234-567-8903',
      role: 'Agent',
      status: 'offline',
      calls: 112,
      avgRating: 4.8,
      satisfaction: 96,
      avgTime: '3.8 min',
      department: 'General Support',
      joinDate: '2024-02-10',
      avatar: null
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah.w@company.com', 
      phone: '+1 234-567-8904',
      role: 'Senior Agent',
      status: 'online',
      calls: 156,
      avgRating: 5.0,
      satisfaction: 100,
      avgTime: '2.9 min',
      department: 'Technical Support',
      joinDate: '2023-11-05',
      avatar: null
    },
    { 
      id: 5, 
      name: 'David Brown', 
      email: 'david.b@company.com', 
      phone: '+1 234-567-8905',
      role: 'Agent',
      status: 'online',
      calls: 98,
      avgRating: 4.6,
      satisfaction: 92,
      avgTime: '4.5 min',
      department: 'Billing',
      joinDate: '2024-04-01',
      avatar: null
    },
    { 
      id: 6, 
      name: 'Emily Davis', 
      email: 'emily.d@company.com', 
      phone: '+1 234-567-8906',
      role: 'Junior Agent',
      status: 'busy',
      calls: 76,
      avgRating: 4.5,
      satisfaction: 90,
      avgTime: '5.0 min',
      department: 'General Support',
      joinDate: '2024-05-12',
      avatar: null
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && agent.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case 'online': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'busy': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'offline': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
      default: return '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Agents', value: agents.length, icon: FiUsers, change: '+2', color: 'blue' },
    { label: 'Online Now', value: agents.filter(a => a.status === 'online').length, icon: FiCheckCircle, change: '+1', color: 'green' },
    { label: 'Busy', value: agents.filter(a => a.status === 'busy').length, icon: FiClock, change: '-1', color: 'yellow' },
    { label: 'Avg Rating', value: '4.8', icon: FiStar, change: '+0.1', color: 'purple' }
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'admin@company.com'}</p>
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
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`} />
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
                  className="lg:hidden p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Agent Management
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiPlus className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Your Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
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
                  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                  green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
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
                    placeholder="Search agents by name, email or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="online">Online</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <FiPlus className="w-5 h-5" />
                    Add Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map(agent => (
                <div 
                  key={agent.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{agent.role}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(agent.status)}`}>
                        <div className={`w-1.5 h-1.5 ${getStatusColor(agent.status)} rounded-full`}></div>
                        <span className="capitalize">{agent.status}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{agent.department}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.calls}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-600">{agent.avgRating}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{agent.satisfaction}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiPhone className="w-4 h-4 flex-shrink-0" />
                        <span>{agent.phone}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {new Date(agent.joinDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredAgents.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No agents found matching your search</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Agents;