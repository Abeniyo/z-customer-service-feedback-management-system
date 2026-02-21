// src/components/landing/FinalCTA.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const FinalCTA = () => {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Cancel anytime",
    "24/7 support"
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center text-white relative z-10"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Transform Your{' '}
          <span className="text-yellow-300">Customer Feedback?</span>
        </h2>
        
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already using FeedbackFlow to understand 
          and delight their customers.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-purple-100">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg 
                     hover:bg-gray-100 transition shadow-xl text-lg font-semibold
                     inline-flex items-center justify-center gap-2 group"
          >
            Start Your Free Trial
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
          
          <Link
            to="/demo"
            className="border-2 border-white text-white px-8 py-4 rounded-lg 
                     hover:bg-white/10 transition text-lg font-semibold"
          >
            Schedule a Demo
          </Link>
        </div>

        <p className="mt-6 text-sm text-purple-200">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </motion.div>
    </section>
  );
};

export default FinalCTA;