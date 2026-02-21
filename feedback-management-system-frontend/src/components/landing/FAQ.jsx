// src/components/landing/FAQ.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How does feedback collection work?",
      answer: "Our platform integrates with email, social media, WhatsApp, live chat, and website forms. All feedback is automatically centralized in one dashboard in real-time. You can also create custom feedback forms and surveys."
    },
    {
      id: 2,
      question: "Can I import existing feedback data?",
      answer: "Yes! We support CSV, Excel, and API imports. Our team can help you migrate your historical data seamlessly. Enterprise customers get dedicated migration assistance."
    },
    {
      id: 3,
      question: "Is there a mobile app?",
      answer: "Absolutely! We offer fully responsive web access that works perfectly on all devices, plus native mobile apps for iOS and Android. Manage feedback and respond to customers on the go."
    },
    {
      id: 4,
      question: "How secure is my data?",
      answer: "We use enterprise-grade 256-bit encryption both in transit and at rest. We're GDPR compliant, SOC 2 Type II certified, and undergo regular security audits. Your data is backed up daily."
    },
    {
      id: 5,
      question: "What support options are available?",
      answer: "All plans include email support. Pro and Enterprise plans include priority phone support, live chat, and a dedicated account manager. We also have extensive documentation and tutorials."
    },
    {
      id: 6,
      question: "Can I customize reports?",
      answer: "Yes! Create custom reports, schedule automated email reports, export in multiple formats, and choose from various visualization options. Enterprise plans include custom report builder."
    },
    {
      id: 7,
      question: "Is there a free trial?",
      answer: "Yes! Start with a 14-day free trial - no credit card required. You'll have access to all Pro features. Cancel anytime, no questions asked."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 
                        dark:bg-purple-900/30 rounded-full mb-4">
            <FiHelpCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about FeedbackFlow
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden
                       border border-gray-100 dark:border-gray-700
                       hover:border-purple-200 dark:hover:border-purple-800 
                       transition-all duration-300"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between
                         hover:bg-white dark:hover:bg-gray-700/50 transition"
              >
                <span className="font-medium text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                <FiChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    openId === faq.id ? 'rotate-180 text-purple-600' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Still have questions?{' '}
            <a 
              href="/contact" 
              className="text-purple-600 hover:text-purple-700 font-medium 
                       inline-flex items-center gap-1 group"
            >
              Contact our support team
              <FiChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition" />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;