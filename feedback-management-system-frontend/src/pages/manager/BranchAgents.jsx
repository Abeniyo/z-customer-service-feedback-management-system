import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiUsers, 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiStar,
  FiPhoneCall,
  FiClock,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const BranchAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const agents = [
    { 
      id: 1, 
      name: 'Sarah Wilson', 
      email: 'sarah.w@branch.com',
      phone: '+1 (212) 555-0145',
      status: 'online',
      calls: 145,
      rating: 4.9,
      joinDate: '2025-01-15',
      shift: 'Morning (9AM - 5PM)',
      avatar: 'SW'
    },
    { 
      id: 2, 
      name: 'Michael Brown', 
      email: 'michael.b@branch.com',
      phone: '+1 (212) 555-0146',
      status: 'online',
      calls: 138,
      rating: 4.8,
      joinDate: '2025-02-20',
      shift: 'Morning (9AM - 5PM)',
      avatar: 'MB'
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      email: 'emily.d@branch.com',
      phone: '+1 (212) 555-0147',
      status: 'busy',
      calls: 132,
      rating: 4.7,
      joinDate: '2024-11-10',
      shift: 'Afternoon (1PM - 9PM)',
      avatar: 'ED'
    },
    { 
      id: 4, 
      name: 'James Miller', 
      email: 'james.m@branch.com',
      phone: '+1 (212) 555-0148',
      status: 'online',
      calls: 128,
      rating: 4.6,
      joinDate: '2025-03-05',
      shift: 'Morning (9AM - 5PM)',
      avatar: 'JM'
    },
    { 
      id: 5, 
      name: 'Lisa Anderson', 
      email: 'lisa.a@branch.com',
      phone: '+1 (212) 555-0149',
      status: 'offline',
      calls: 125,
      rating: 4.6,
      joinDate: '2024-12-01',
      shift: 'Afternoon (1PM - 9PM)',
      avatar: 'LA'
    },
    { 
      id: 6, 
      name: 'Robert Taylor', 
      email: 'robert.t@branch.com',
      phone: '+1 (212) 555-0150',
      status: 'busy',
      calls: 118,
      rating: 4.5,
      joinDate: '2025-01-22',
      shift: 'Morning (9AM - 5PM)',
      avatar: 'RT'
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && agent.status === filter;
  });

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branch Agents</h1>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FiUserPlus className="w-4 h-4" />
            Add New Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Agents</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
            <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.status === 'online').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Busy</p>
            <p className="text-2xl font-bold text-yellow-600">{agents.filter(a => a.status === 'busy').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-600">4.7 ★</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
              <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg border border-gray-300 dark:border-gray-600">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Calls</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Shift</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                          {agent.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Joined {agent.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiMail className="w-3 h-3" />
                          {agent.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiPhone className="w-3 h-3" />
                          {agent.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${getStatusColor(agent.status)} rounded-full`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{agent.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.calls}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{agent.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.shift}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchAgents;