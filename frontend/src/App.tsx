import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import './i18n/config';

import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ExportDirectory from './pages/ExportDirectory';
import CountryDashboard from './pages/CountryDashboard';
import SuperAdminPanel from './pages/SuperAdminPanel';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './stores/themeStore';

const queryClient = new QueryClient();

function App() {
  const { isDarkMode } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 to-slate-900 text-white' 
            : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'
        }`}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exports" element={<ExportDirectory />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CountryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="SUPER_ADMIN">
                    <SuperAdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: isDarkMode ? 'dark-toast' : '',
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB'
              }
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;