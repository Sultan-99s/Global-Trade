import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 translate-x-3' 
            : 'bg-white translate-x-[-3px]'
        }`}
        layout
      >
        {isDarkMode ? (
          <Moon className="h-3 w-3 text-blue-400" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;