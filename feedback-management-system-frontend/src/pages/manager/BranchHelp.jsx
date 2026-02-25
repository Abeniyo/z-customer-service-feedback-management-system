import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiHelpCircle,
  FiBook,
  FiVideo,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiSearch,
  FiFileText,
  FiUsers,
  FiSettings,
  FiShield,
  FiDownload
} from 'react-icons/fi';

const BranchHelp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: FiHelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: FiBook },
    { id: 'agents', label: 'Agent Management', icon: FiUsers },
    { id: 'calls', label: 'Call Management', icon: FiVideo },
    { id: 'reports', label: 'Reports & Analytics', icon: FiFileText },
    { id: 'settings', label: 'Settings', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  const articles = [
    {
      id: 1,
      title: 'Getting Started as a Branch Manager',
      description: 'Learn the basics of managing your branch effectively',
      category: 'getting-started',
      reads: 1245,
      helpful: 98,
      icon: FiBook
    },
    {
      id: 2,
      title: 'How to Add and Manage Agents',
      description: 'Step-by-step guide to adding new agents to your branch',
      category: 'agents',
      reads: 892,
      helpful: 95,
      icon: FiUsers
    },
    {
      id: 3,
      title: 'Understanding Call Metrics',
      description: 'Comprehensive guide to call analytics and reporting',
      category: 'calls',
      reads: 756,
      helpful: 92,
      icon: FiVideo
    },
    {
      id: 4,
      title: 'Generating Performance Reports',
      description: 'Learn how to create and export branch reports',
      category: 'reports',
      reads: 623,
      helpful: 94,
      icon: FiFileText
    },
    {
      id: 5,
      title: 'Configuring Branch Settings',
      description: 'Customize your branch preferences and notifications',
      category: 'settings',
      reads: 541,
      helpful: 91,
      icon: FiSettings
    },
    {
      id: 6,
      title: 'Security Best Practices',
      description: 'Keep your branch data safe and secure',
      category: 'security',
      reads: 487,
      helpful: 99,
      icon: FiShield
    },
    {
      id: 7,
      title: 'Managing Agent Schedules',
      description: 'Create and manage agent shift schedules',
      category: 'agents',
      reads: 712,
      helpful: 96,
      icon: FiUsers
    },
    {
      id: 8,
      title: 'Handling Escalated Calls',
      description: 'Best practices for managing difficult calls',
      category: 'calls',
      reads: 634,
      helpful: 97,
      icon: FiVideo
    }
  ];

  const faqs = [
    {
      question: 'How do I add a new agent to my branch?',
      answer: 'Go to Agents page and click "Add New Agent". Fill in their details and assign their role and shift.'
    },
    {
      question: 'How can I export call reports?',
      answer: 'Navigate to Reports page, select the date range, and click the Export button to download in your preferred format.'
    },
    {
      question: 'What should I do if an agent is not showing up?',
      answer: 'Check their schedule in the Schedule page and contact them directly. You can also reassign calls temporarily.'
    },
    {
      question: 'How do I change my branch information?',
      answer: 'Go to Branch Info page and click "Edit Information" to update your branch details.'
    },
    {
      question: 'How are agent ratings calculated?',
      answer: 'Ratings are based on customer feedback after each call, averaged over the selected time period.'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && article.category === activeCategory;
  });

  const supportOptions = [
    { icon: FiMessageCircle, label: 'Live Chat', description: 'Chat with support team', action: 'Start Chat', color: 'green' },
    { icon: FiMail, label: 'Email Support', description: 'Get help via email', action: 'Send Email', color: 'blue' },
    { icon: FiPhone, label: 'Phone Support', description: 'Call us directly', action: 'Call Now', color: 'purple' },
  ];

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            const Icon = article.icon;
            return (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-400">{article.reads.toLocaleString()} reads</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600">{article.helpful}% helpful</span>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <p className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            const colors = {
              green: 'bg-green-600 hover:bg-green-700',
              blue: 'bg-blue-600 hover:bg-blue-700',
              purple: 'bg-purple-600 hover:bg-purple-700'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colors[option.color]} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${option.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{option.label}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
                <button className={`w-full py-2 rounded-lg text-white transition-colors ${colors[option.color]}`}>
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>

        {/* Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <FiDownload className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">User Manual</p>
                <p className="text-xs text-gray-500">Download PDF guide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <FiVideo className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Video Tutorials</p>
                <p className="text-xs text-gray-500">Watch training videos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <FiBook className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">API Documentation</p>
                <p className="text-xs text-gray-500">For developers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <FiMessageCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Community Forum</p>
                <p className="text-xs text-gray-500">Discuss with peers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchHelp;