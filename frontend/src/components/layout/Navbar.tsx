import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, LogIn, LogOut, User, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`shadow-lg border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className={`bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300 ${
                isDarkMode ? 'shadow-lg shadow-blue-500/20' : ''
              }`}>
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className={`text-xl font-bold group-hover:text-blue-600 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                GEVP
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? isDarkMode
                    ? 'text-blue-400 bg-blue-900/50'
                    : 'text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/exports"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/exports') 
                  ? isDarkMode
                    ? 'text-blue-400 bg-blue-900/50'
                    : 'text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {t('nav.exports')}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? isDarkMode
                      ? 'text-blue-400 bg-blue-900/50'
                      : 'text-blue-600 bg-blue-50'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}
            {user?.role === 'SUPER_ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? isDarkMode
                      ? 'text-blue-400 bg-blue-900/50'
                      : 'text-blue-600 bg-blue-50'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/30'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;