// src/components/landing/FAQ.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How does the feedback collection work?",
      answer: "Our system integrates with multiple channels including email, social media, WhatsApp, live chat, and your website forms. All feedback is automatically centralized in one dashboard in real-time. You can also collect feedback via custom forms and surveys."
    },
    {
      id: 2,
      question: "Can I import my existing feedback data?",
      answer: "Yes! We support CSV, Excel, and API imports. Our team can help you migrate your historical data seamlessly. We also offer custom migration services for enterprise customers."
    },
    {
      id: 3,
      question: "Is there a mobile app available?",
      answer: "Absolutely! We offer fully responsive web access that works perfectly on all devices, plus native mobile apps for iOS and Android. You can manage feedback, respond to customers, and view reports on the go."
    },
    {
      id: 4,
      question: "How secure is my data?",
      answer: "We use enterprise-grade encryption (256-bit) both in transit and at rest. We are GDPR compliant, SOC 2 Type II certified, and regularly undergo security audits. Your data is backed up daily and stored securely in multiple regions."
    },
    {
      id: 5,
      question: "What kind of support do you offer?",
      answer: "All plans include email support with 24-hour response time. Pro and Enterprise plans include 24/7 priority phone support, live chat, and a dedicated account manager. We also have extensive documentation and video tutorials."
    },
    {
      id: 6,
      question: "Can I customize the reports?",
      answer: "Yes! Our analytics dashboard is fully customizable. You can create custom reports, set up automated email reports, schedule exports, and choose from multiple visualization options. Enterprise plans include custom report builder."
    },
    {
      id: 7,
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial with no credit card required. You'll have access to all Pro features to see if FeedbackFlow is right for your team. No commitment, cancel anytime."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
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
            Frequently Asked{' '}
            <span className="text-purple-600">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about FeedbackFlow
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between 
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <FiChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Still have questions?{' '}
            <a href="/contact" className="text-purple-600 hover:text-purple-700 font-semibold">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;