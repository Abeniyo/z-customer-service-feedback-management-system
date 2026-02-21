// src/components/landing/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPlay, 
  FiTrendingUp, 
  FiClock, 
  FiStar,
  FiBarChart2,
  FiMessageCircle,
  FiZap,
  FiUsers,
  FiSmile,
  FiHeart,
  FiThumbsUp,
  FiBell
} from 'react-icons/fi';

const HeroSection = () => {
  // Animation variants for floating icons
  const floatAnimation = {
    initial: { y: 0 },
    animate: (delay) => ({
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateAnimation = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="home" className="relative pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decoration - enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay - FIXED */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - enhanced with animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >


            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Turn Customer Feedback into{' '}
              <span className="text-purple-600 relative">
                Actionable Insights
                <motion.svg 
                  className="absolute -bottom-2 left-0 w-full" 
                  viewBox="0 0 300 12" 
                  fill="none"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <path d="M0 0 L300 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" 
                        className="text-purple-300 dark:text-purple-700"/>
                </motion.svg>
              </span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Stop guessing what customers want. Our AI-powered platform collects, analyzes, 
              and helps you act on feedback from every channel in real-time.
            </motion.p>

            {/* Animated CTA buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >


            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced with more attractive animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Enhanced abstract decorative shapes */}
              <motion.div 
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-30"
              ></motion.div>
              <motion.div 
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full blur-3xl opacity-30"
              ></motion.div>
              
              {/* Main floating icon cards with enhanced animations */}
              <motion.div 
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                custom={0}
                className="absolute top-10 right-10 w-36 h-36 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center transform rotate-12 border border-purple-100 dark:border-gray-700"
              >
                <FiBarChart2 className="w-14 h-14 text-purple-600 mb-2" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Analytics</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <FiTrendingUp className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={rotateAnimation}
                initial="initial"
                animate="animate"
                className="absolute bottom-10 left-10 w-36 h-36 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center transform -rotate-6 border border-blue-100 dark:border-gray-700"
              >
                <FiMessageCircle className="w-14 h-14 text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Feedback</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <FiHeart className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Center piece - enhanced */}
              <motion.div 
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <FiZap className="w-20 h-20 text-white mb-2" />
                </motion.div>
                <span className="text-base font-bold text-white">AI-Powered</span>
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 w-16 h-1 bg-white rounded-full blur-sm"
                ></motion.div>
              </motion.div>

              {/* Small floating icons with enhanced animations */}
              <motion.div 
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                custom={2}
                className="absolute top-32 left-32 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm"
              >
                <FiSmile className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <motion.div 
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                custom={3}
                className="absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm"
              >
                <FiStar className="w-10 h-10 text-yellow-600 fill-current" />
              </motion.div>

              <motion.div 
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                custom={1.5}
                className="absolute top-40 right-40 w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm"
              >
                <FiHeart className="w-8 h-8 text-pink-600" />
              </motion.div>

              <motion.div 
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                custom={2.5}
                className="absolute bottom-40 left-40 w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm"
              >
                <FiThumbsUp className="w-8 h-8 text-blue-600" />
              </motion.div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <motion.circle 
                  cx="50%" 
                  cy="50%" 
                  r="180" 
                  stroke="url(#gradient)" 
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  fill="none"
                  initial={{ pathLength: 0, rotate: 0 }}
                  animate={{ pathLength: 1, rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;