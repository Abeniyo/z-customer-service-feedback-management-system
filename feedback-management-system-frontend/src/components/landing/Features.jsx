// src/components/landing/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiTrendingUp, 
  FiPieChart, 
  FiUsers,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiSmartphone
} from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiMessageCircle className="w-6 h-6" />,
      title: "Multi-Channel Collection",
      description: "Gather feedback from email, chat, social media, and surveys in one place",
      color: "purple"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Sentiment Analysis",
      description: "AI-powered analysis that understands customer emotions and priorities",
      color: "blue"
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Trend Reporting",
      description: "Visual graphs showing recurring issues and satisfaction trends",
      color: "green"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Assign tasks, track resolution, and collaborate with your team",
      color: "orange"
    }
  ];

  const channels = [
    { icon: <FiMail />, name: "Email", color: "blue" },
    { icon: <FiFacebook />, name: "Facebook", color: "indigo" },
    { icon: <FiTwitter />, name: "Twitter", color: "sky" },
    { icon: <FiInstagram />, name: "Instagram", color: "pink" },
    { icon: <FiSmartphone />, name: "SMS", color: "green" },
    { icon: <FiMessageCircle />, name: "WhatsApp", color: "emerald" }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for{' '}
            <span className="text-purple-600">Modern Support Teams</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to turn customer feedback into your competitive advantage
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl 
                       transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 
                            rounded-lg flex items-center justify-center text-${feature.color}-600 
                            mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Multi-channel Integration Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connect All Your Channels
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Integrate with every platform your customers use
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {channels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 
                         dark:hover:bg-gray-800 transition group"
              >
                <div className={`w-12 h-12 bg-${channel.color}-100 dark:bg-${channel.color}-900/30 
                              rounded-full flex items-center justify-center text-${channel.color}-600 
                              mb-2 group-hover:scale-110 transition`}>
                  {channel.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {channel.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;