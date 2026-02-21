// src/components/landing/ProblemSolution.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiAlertCircle, 
  FiClock, 
  FiBarChart2, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiPieChart,
  FiZap,
  FiUsers
} from 'react-icons/fi';

const ProblemSolution = () => {
  const problems = [
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "No Real-time Insights",
      description: "You find out about problems days or weeks later",
      stat: "24h+",
      statLabel: "average response delay",
      color: "orange"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Poor Retention",
      description: "Missed feedback leads to customer churn",
      stat: "32%",
      statLabel: "higher churn rate",
      color: "yellow"
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Manual Reporting",
      description: "Hours spent compiling reports instead of helping customers",
      stat: "8h+",
      statLabel: "per week on manual work",
      color: "red"
    }
  ];

  const solutions = [
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Centralized Collection",
      description: "All feedback in one dashboard from every channel",
      benefit: "Never miss a customer message",
      color: "green"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Live dashboard with instant insights and alerts",
      benefit: "Catch issues before they escalate",
      color: "green"
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Automated Reports",
      description: "Daily/weekly reports sent directly to your inbox",
      benefit: "Save 8+ hours per week",
      color: "green"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 
                        px-4 py-2 rounded-full mb-4">
            <FiAlertCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              The Problem
            </span>
            <FiZap className="w-4 h-4 text-purple-600 ml-2" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Our Solution
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Stop Losing Customers to{' '}
            <span className="text-purple-600 relative">
              Poor Feedback Management
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path 
                  d="M0 4 L300 4" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeDasharray="8 8"
                  className="text-purple-300 dark:text-purple-700"
                />
              </svg>
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Traditional feedback collection is broken, costing you customers and revenue. 
            Here's how we fix it.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 
                          rounded-2xl p-6 md:p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FiAlertCircle className="w-6 h-6 text-red-500" />
                <span>What You're Dealing With</span>
              </h3>
              
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                             p-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${problem.color}-100 dark:bg-${problem.color}-900/40 
                                    rounded-lg flex items-center justify-center text-${problem.color}-600 
                                    flex-shrink-0`}>
                        {problem.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {problem.title}
                          </h4>
                          <motion.span 
                            variants={statsVariants}
                            className={`text-${problem.color}-600 font-bold text-lg`}
                          >
                            {problem.stat}
                          </motion.span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                          {problem.description}
                        </p>
                        <p className={`text-xs text-${problem.color}-600 dark:text-${problem.color}-400`}>
                          {problem.statLabel}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Impact Stat */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-red-600 text-xl">$1.6T</span> lost annually due to poor customer experience
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Solutions Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                          rounded-2xl p-6 md:p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FiZap className="w-6 h-6 text-green-500" />
                <span>How FeedbackFlow Fixes It</span>
              </h3>
              
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                             p-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${solution.color}-100 dark:bg-${solution.color}-900/40 
                                    rounded-lg flex items-center justify-center text-${solution.color}-600 
                                    flex-shrink-0`}>
                        {solution.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {solution.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                          {solution.description}
                        </p>
                        <p className={`text-xs text-${solution.color}-600 dark:text-${solution.color}-400 font-medium`}>
                          ✓ {solution.benefit}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ROI Stat */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-green-600 text-xl">3.5x</span> ROI within first year
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Based on average customer results
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Comparison Banner - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <div className="text-red-600 font-bold mb-3 flex items-center justify-center gap-2">
                <FiAlertCircle className="w-5 h-5" />
                Without FeedbackFlow
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> No real-time insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> Slow response times
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> High churn rate
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> Manual reporting
                </li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <div className="text-green-600 font-bold mb-3 flex items-center justify-center gap-2">
                <FiZap className="w-5 h-5" />
                With FeedbackFlow
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Instant alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 60% faster response
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 35% better retention
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Automated insights
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join <span className="font-bold text-purple-600">10,000+</span> businesses that have already made the switch
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;