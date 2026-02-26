import React from "react";
import { motion } from "framer-motion";

import {
  FiMail,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiPhone,
  FiSlack,
  FiZap,
  FiGitBranch,
} from "react-icons/fi";

import {
  FaWhatsapp,
  FaTelegram,
  FaWeixin,
  FaLine,
} from "react-icons/fa";

import { FaFacebookMessenger } from "react-icons/fa6";

const Integrations = () => {
  // Production-safe Tailwind color classes
  const colorStyles = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600",
    },
    sky: {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-600",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-600",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600",
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      text: "text-indigo-600",
    },
    gray: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-600",
    },
  };

  const integrations = [
    { name: "Email", icon: FiMail, color: "blue" },
    { name: "WhatsApp", icon: FaWhatsapp, color: "green" },
    { name: "Messenger", icon: FaFacebookMessenger, color: "blue" },
    { name: "Telegram", icon: FaTelegram, color: "sky" },
    { name: "Twitter", icon: FiTwitter, color: "sky" },
    { name: "Instagram", icon: FiInstagram, color: "pink" },
    { name: "Slack", icon: FiSlack, color: "purple" },
    { name: "SMS", icon: FiPhone, color: "indigo" },
    { name: "WeChat", icon: FaWeixin, color: "green" },
    { name: "Line", icon: FaLine, color: "green" },
    { name: "Facebook", icon: FiFacebook, color: "indigo" },
    { name: "API", icon: FiGitBranch, color: "gray" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Connect With All Your{" "}
            <span className="text-purple-600">Favorite Channels</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Seamless integration with 30+ platforms your customers already use
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            const styles = colorStyles[integration.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md 
                           hover:shadow-xl transition-all duration-300 
                           flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 ${styles.bg} 
                              rounded-2xl flex items-center justify-center mb-4 
                              group-hover:scale-110 transition`}
                >
                  <Icon className={`w-8 h-8 ${styles.text}`} />
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {integration.name}
                </h3>

                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Available
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="inline-flex items-center gap-2 text-purple-600 
                             hover:text-purple-700 font-semibold transition">
            <FiZap className="w-5 h-5" />
            View all 30+ integrations
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;