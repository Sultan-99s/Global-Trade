import React, { useState } from 'react';
import { Users, Globe, Activity, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { apiService } from '../services/apiService';

const SuperAdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'users' | 'countries' | 'logs'>('users');

  const { data: users, refetch: refetchUsers } = useQuery('adminUsers', () => apiService.getAllUsers());
  const { data: countries } = useQuery('countries', () => apiService.getCountries());
  const { data: auditLogs } = useQuery('auditLogs', () => apiService.getAuditLogs());

  const handleActivateUser = async (userId: string) => {
    try {
      await apiService.activateUser(userId);
      refetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const stats = [
    {
      icon: Users,
      label: t('admin.stats.totalUsers'),
      value: users?.length || 0,
      color: 'blue'
    },
    {
      icon: Globe,
      label: t('admin.stats.countries'),
      value: countries?.length || 0,
      color: 'green'
    },
    {
      icon: Activity,
      label: t('admin.stats.activeUsers'),
      value: users?.filter((u: any) => u.isActive).length || 0,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-gray-600">
              {t('admin.subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{t('admin.tabs.users')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('countries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'countries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{t('admin.tabs.countries')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>{t('admin.tabs.logs')}</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('admin.users.title')}
                </h2>
                <div className="space-y-4">
                  {users?.map((user: any) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{user.email}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? t('admin.users.active') : t('admin.users.inactive')}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {user.country?.name || t('admin.users.noCountry')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!user.isActive && (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>{t('admin.users.activate')}</span>
                          </button>
                        )}
                        <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>{t('admin.users.view')}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'countries' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('admin.countries.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countries?.map((country: any) => (
                    <motion.div
                      key={country.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{country.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{t('admin.countries.code')}: {country.code}</p>
                        <p>{t('admin.countries.region')}: {country.region}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('admin.logs.title')}
                </h2>
                <div className="space-y-3">
                  {auditLogs?.map((log: any) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{log.user?.email}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-blue-600">{log.action}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{log.description}</p>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;