// src/components/landing/FinalCTA.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiArrowRight, 
  FiZap, 
  FiStar,
  FiTrendingUp ,
  FiPlay
} from 'react-icons/fi';

const FinalCTA = () => {
  const benefits = [
    { text: "14-day free trial", icon: FiZap },
    { text: "No credit card", icon: FiCheckCircle },
    { text: "Cancel anytime", icon: FiStar },
    { text: "24/7 support", icon: FiTrendingUp }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div 
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          custom={1}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          custom={2}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }} />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 30, -30, 30],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center text-white relative z-10"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm 
                     px-4 py-2 rounded-full mb-8 border border-white/20"
        >
          <FiZap className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2 
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          Ready to Transform{' '}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Customer Feedback?
            </span>
            <motion.svg 
              className="absolute -bottom-2 left-0 w-full" 
              viewBox="0 0 300 12" 
              fill="none"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <path 
                d="M0 6 L300 6" 
                stroke="url(#gradient)" 
                strokeWidth="4" 
                strokeDasharray="8 8"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto"
        >
          Join <span className="font-bold text-white">10,000+ businesses</span> already using 
          FeedbackFlow to understand and delight their customers.
        </motion.p>

        {/* Benefits Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 
                         border border-white/20 hover:bg-white/20 
                         transition-all duration-300"
              >
                <Icon className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <span className="text-sm font-medium text-white">
                  {benefit.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="group relative bg-white text-purple-900 px-8 py-4 
                       rounded-lg hover:shadow-2xl transition-all duration-300 
                       text-lg font-semibold inline-flex items-center justify-center 
                       gap-2 overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <FiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/demo"
              className="group border-2 border-white text-white px-8 py-4 
                       rounded-lg hover:bg-white/10 transition-all duration-300 
                       text-lg font-semibold inline-flex items-center justify-center 
                       gap-2 relative overflow-hidden"
            >
              <span className="relative z-10">Schedule a Demo</span>
              <FiPlay className="w-5 h-5 relative z-10 group-hover:rotate-12 transition" />
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Message */}
        <motion.p 
          variants={itemVariants}
          className="text-sm text-purple-200 flex items-center justify-center gap-2"
        >
          <FiCheckCircle className="w-4 h-4 text-yellow-300" />
          No credit card required • 14-day free trial • Cancel anytime
        </motion.p>

        {/* Social Proof */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-4 text-sm text-purple-200"
        >
          <div className="flex -space-x-2">
            {[1,2,3,4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 
                         border-2 border-white/20 flex items-center justify-center text-xs 
                         font-bold text-white"
              >
                {i}
              </div>
            ))}
          </div>
          <span>Trusted by leading companies worldwide</span>
        </motion.div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="0.1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default FinalCTA;