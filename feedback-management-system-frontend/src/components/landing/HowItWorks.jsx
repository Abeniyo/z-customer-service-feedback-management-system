// src/components/landing/HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCpu, FiTrendingUp } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <FiDownload className="w-8 h-8" />,
      title: "Connect Your Channels",
      description: "Integrate email, social media, chat, and surveys in minutes with our one-click connectors.",
      color: "purple"
    },
    {
      number: "02",
      icon: <FiCpu className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Our AI automatically categorizes feedback, detects sentiment, and identifies urgent issues.",
      color: "blue"
    },
    {
      number: "03",
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Take Action & Improve",
      description: "Get actionable insights, assign tasks to your team, and watch your satisfaction scores soar.",
      color: "green"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Started in{' '}
            <span className="text-purple-600">3 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From integration to insights in minutes. No coding required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Number */}
              <div className="relative inline-block mb-6">
                <div className={`w-20 h-20 bg-${step.color}-100 dark:bg-${step.color}-900/30 
                              rounded-full flex items-center justify-center text-${step.color}-600 
                              mx-auto relative z-10`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 
                              rounded-full border-2 border-purple-200 dark:border-purple-800 
                              flex items-center justify-center text-sm font-bold text-purple-600">
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>

              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden text-gray-300 dark:text-gray-600 text-2xl my-4">
                  ↓
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Demo Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative group cursor-pointer"
        >
          <div className="aspect-video bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl 
                        overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center 
                            group-hover:scale-110 transition">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent 
                              border-l-[20px] border-l-purple-600 
                              border-b-[12px] border-b-transparent ml-1"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-lg font-semibold">Watch 2-minute demo</p>
              <p className="text-sm opacity-90">See how FeedbackFlow works</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;