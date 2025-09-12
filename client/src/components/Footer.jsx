import { Link } from 'react-router-dom';
import { CreditCard, Shield, BarChart2, HelpCircle, Mail, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const features = [
    { name: 'Expense Tracking', icon: <CreditCard size={18} className="mr-2" /> },
    { name: 'Income Management', icon: <BarChart2 size={18} className="mr-2" /> },
    { name: 'Budget Planning', icon: <Shield size={18} className="mr-2" /> },
  ];

  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-800 to-indigo-900 dark:from-gray-800 dark:to-gray-900 text-white mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-yellow-400 p-2 rounded-lg mr-3">
                <CreditCard className="text-indigo-900" size={24} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-400 dark:to-yellow-300 bg-clip-text text-transparent">
                Finance Tracker
              </h2>
            </div>
            <p className="text-indigo-200 dark:text-gray-300 text-sm leading-relaxed">
              Take control of your finances with our intuitive expense tracking solution. 
              Manage your money smarter and reach your financial goals faster.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <BarChart2 size={18} className="mr-2 text-yellow-400" />
              Features
            </h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-indigo-200 dark:text-gray-300 hover:text-white transition-colors">
                  {feature.icon}
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-indigo-200 dark:text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <HelpCircle size={18} className="mr-2 text-yellow-400" />
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-indigo-200 dark:text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center text-indigo-200 dark:text-gray-300 mt-4">
                <Mail size={16} className="mr-2 text-yellow-400" />
                support@financetracker.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-indigo-700 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-indigo-300 dark:text-gray-400 text-center md:text-left mb-2 md:mb-0">
            &copy; {currentYear} Finance Tracker. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-sm text-indigo-300 dark:text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-indigo-300 dark:text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-sm text-indigo-300 dark:text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
