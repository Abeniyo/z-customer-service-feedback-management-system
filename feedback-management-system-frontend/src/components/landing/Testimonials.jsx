// src/components/landing/Testimonials.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Customer Support Manager",
      company: "TechCorp Solutions",
      content: "FeedbackFlow has transformed how we handle customer feedback. We've reduced response time by 60% and increased satisfaction scores by 35%. The sentiment analysis is incredibly accurate.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Head of Customer Experience",
      company: "Global Retail Inc",
      content: "Finally, a tool that actually helps us understand our customers. The multi-channel integration means we never miss feedback, and the real-time alerts help us catch issues before they escalate.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Founder & CEO",
      company: "ServiceFirst",
      content: "We tried spreadsheets, other tools, nothing worked. FeedbackFlow is different. It's intuitive, powerful, and our team actually enjoys using it. Best decision we made this year.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Operations Director",
      company: "FastServe",
      content: "The reporting features alone are worth the investment. We now have clear visibility into customer sentiment trends and can make data-driven decisions confidently.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by{' '}
            <span className="text-purple-600">Customer-Centric Teams</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers say.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-xs text-purple-600">
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "{testimonials[currentIndex].content}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 
                       hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
            >
              <FiChevronLeft className="w-5 h-5 text-purple-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex 
                      ? 'bg-purple-600 w-4' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 
                       hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
            >
              <FiChevronRight className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-purple-600">10k+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">50M+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Feedback Processed</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">4.9/5</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">99.9%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;