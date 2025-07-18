import React, { useState } from 'react';
import { Search, TrendingUp, Globe, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../stores/themeStore';

const HomePage = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProducts = [
    { name: 'Coffee Beans', country: 'Brazil', quantity: '2.5M tons', flag: '🇧🇷' },
    { name: 'Rice', country: 'India', quantity: '45M tons', flag: '🇮🇳' },
    { name: 'Wheat', country: 'Russia', quantity: '32M tons', flag: '🇷🇺' },
    { name: 'Soybeans', country: 'USA', quantity: '96M tons', flag: '🇺🇸' },
  ];

  const stats = [
    { icon: Globe, value: '195', label: 'Countries' },
    { icon: TrendingUp, value: '15K+', label: 'Products' },
    { icon: Users, value: '2.5K+', label: 'Exporters' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative overflow-hidden py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900' 
          : 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
      }`}>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6169662/pexels-photo-6169662.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {t('home.hero.title')}
            </h1>
            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
              isDarkMode ? 'text-blue-200' : 'text-blue-100'
            }`}>
              {t('home.hero.subtitle')}
            </p>

            {/* Global Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-6 py-4 text-lg rounded-full shadow-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                    isDarkMode
                      ? 'text-white bg-gray-800 border border-gray-600 focus:ring-blue-500/50 placeholder-gray-400'
                      : 'text-gray-900 bg-white focus:ring-blue-300 placeholder-gray-500'
                  }`}
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
              <p className={`text-sm mt-3 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-200'
              }`}>
                {t('home.search.hint')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link
                to="/exports"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>{t('home.cta.viewExports')}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className={`bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? 'shadow-lg shadow-blue-500/20' : ''
                }`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`py-16 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.featured.title')}
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('home.featured.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{product.flag}</div>
                  <h3 className={`text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </h3>
                  <p className={`mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{product.country}</p>
                  <p className="text-blue-600 font-medium">{product.quantity}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/exports"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              <span>{t('home.featured.viewAll')}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 text-white ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-800 to-purple-800' 
          : 'bg-gradient-to-r from-green-600 to-blue-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('home.cta.title')}
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-blue-100' : 'text-green-100'
            }`}>
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className={`px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg ${
                  isDarkMode
                    ? 'bg-white text-blue-800 hover:bg-gray-100'
                    : 'bg-white text-green-600 hover:bg-gray-100'
                }`}
              >
                {t('home.cta.getStarted')}
              </Link>
              <Link
                to="/exports"
                className={`border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isDarkMode
                    ? 'hover:bg-white hover:text-blue-800'
                    : 'hover:bg-white hover:text-green-600'
                }`}
              >
                {t('home.cta.exploreNow')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;