import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGithub, 
  FiTwitter, 
  FiLinkedin,
  FiHeart
} from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="FeedbackFlow" className="h-8 w-auto" />
              
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Empowering businesses with intelligent feedback management and customer 
              support solutions. Transform customer feedback into actionable insights.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 
                                           hover:text-purple-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-gray-600 dark:text-gray-400 
                                              hover:text-purple-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-400 
                                             hover:text-purple-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-400 
                                          hover:text-purple-600 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiMail className="w-4 h-4 text-purple-600" />
                support@feedbackflow.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiPhone className="w-4 h-4 text-purple-600" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin className="w-4 h-4 text-purple-600" />
                123 Business Ave, Suite 100
                <br />
                San Francisco, CA 94105
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              © {currentYear} FeedbackFlow. All rights reserved. Made with 
              <FiHeart className="w-4 h-4 text-red-500 mx-1" />
              for better customer service.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 
                                           hover:text-purple-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 
                                         hover:text-purple-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 dark:text-gray-400 
                                           hover:text-purple-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;