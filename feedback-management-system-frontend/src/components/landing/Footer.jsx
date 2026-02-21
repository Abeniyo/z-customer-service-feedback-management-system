// src/components/landing/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGithub, 
  FiTwitter, 
  FiLinkedin,
  FiHeart,
  FiSend,
  FiChevronRight,
  FiShield,
  FiLock,
  FiFileText
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Integrations', path: '/integrations' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'FAQ', path: '/faq' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Contact', path: '/contact' }
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'API Reference', path: '/api' },
      { name: 'Community', path: '/community' },
      { name: 'Support', path: '/support' },
      { name: 'Status', path: '/status' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' },
      { name: 'Security', path: '/security' }
    ]
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'Youtube' },
    { icon: FiGithub, href: 'https://github.com', label: 'Github' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Section with Newsletter */}
        <div className="grid lg:grid-cols-2 gap-8 pb-12 border-b border-gray-200 dark:border-gray-700">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logo} alt="FeedbackFlow" className="h-10 w-auto relative z-10" />
                <div className="absolute -inset-1 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-md"></div>
              </div>

            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
              Transform customer feedback into actionable insights with our AI-powered platform. 
              Join thousands of businesses improving their customer experience every day.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 
                             flex items-center justify-center text-gray-600 
                             dark:text-gray-400 hover:bg-purple-600 hover:text-white 
                             dark:hover:bg-purple-600 transition-all duration-300 
                             hover:scale-110 shadow-sm hover:shadow-purple-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:pl-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get the latest updates, features, and insights delivered to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 
                           dark:border-gray-700 bg-white dark:bg-gray-800 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg 
                         hover:bg-purple-700 transition font-medium
                         flex items-center justify-center gap-2 group
                         shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
              >
                <span>Subscribe</span>
                <FiSend className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 
                             hover:text-purple-600 dark:hover:text-purple-400 
                             transition-colors inline-flex items-center gap-1 group"
                  >
                    <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 
                                             -ml-4 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 
                             hover:text-blue-600 dark:hover:text-blue-400 
                             transition-colors inline-flex items-center gap-1 group"
                  >
                    <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 
                                             -ml-4 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-green-600 rounded-full"></span>
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 
                             hover:text-green-600 dark:hover:text-green-400 
                             transition-colors inline-flex items-center gap-1 group"
                  >
                    <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 
                                             -ml-4 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-600 rounded-full"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:support@feedbackflow.com"
                  className="flex items-start gap-3 text-sm text-gray-600 
                           dark:text-gray-400 hover:text-purple-600 
                           dark:hover:text-purple-400 transition-colors group"
                >
                  <FiMail className="w-5 h-5 text-purple-600 flex-shrink-0 
                                   group-hover:scale-110 transition" />
                  <span className="break-all">support@feedbackflow.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+15551234567"
                  className="flex items-start gap-3 text-sm text-gray-600 
                           dark:text-gray-400 hover:text-purple-600 
                           dark:hover:text-purple-400 transition-colors group"
                >
                  <FiPhone className="w-5 h-5 text-purple-600 flex-shrink-0 
                                   group-hover:scale-110 transition" />
                  <span>+1 (555) 123-4567</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <address className="not-italic">
                  123 Business Ave, Suite 100
                  <br />
                  San Francisco, CA 94105
                </address>
              </li>
            </ul>


          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 text-center lg:text-left">
              © {currentYear} Gebeta. All rights reserved. 
              <span className="hidden sm:inline mx-1"> </span>
              <span className="flex items-center gap-1 justify-center">
                 For better customer service.
              </span>
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link 
                to="/privacy" 
                className="text-gray-500 dark:text-gray-500 hover:text-purple-600 
                         dark:hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link 
                to="/terms" 
                className="text-gray-500 dark:text-gray-500 hover:text-purple-600 
                         dark:hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link 
                to="/cookies" 
                className="text-gray-500 dark:text-gray-500 hover:text-purple-600 
                         dark:hover:text-purple-400 transition-colors"
              >
                Cookie Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link 
                to="/sitemap" 
                className="text-gray-500 dark:text-gray-500 hover:text-purple-600 
                         dark:hover:text-purple-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>


          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center lg:text-left">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button (visible on mobile) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 lg:hidden bg-purple-600 text-white 
                   w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                   hover:bg-purple-700 transition z-50"
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;