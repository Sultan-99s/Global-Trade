import React, { useState } from 'react';
import { Plus, Package, Users, TrendingUp, Calendar, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/apiService';
import ProductModal from '../components/dashboard/ProductModal';
import ExporterModal from '../components/dashboard/ExporterModal';

const CountryDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'products' | 'exporters'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showExporterModal, setShowExporterModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingExporter, setEditingExporter] = useState(null);

  const { data: products, refetch: refetchProducts } = useQuery(
    ['countryProducts', user?.countryId],
    () => apiService.getCountryProducts(user?.countryId!),
    { enabled: !!user?.countryId }
  );

  const { data: exporters, refetch: refetchExporters } = useQuery(
    ['countryExporters', user?.countryId],
    () => apiService.getExporters(user?.countryId),
    { enabled: !!user?.countryId }
  );

  const stats = [
    {
      icon: Package,
      label: t('dashboard.stats.totalProducts'),
      value: products?.length || 0,
      color: 'blue'
    },
    {
      icon: Users,
      label: t('dashboard.stats.authorizedExporters'),
      value: exporters?.length || 0,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: t('dashboard.stats.activeExports'),
      value: '12',
      color: 'purple'
    }
  ];

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleEditExporter = (exporter: any) => {
    setEditingExporter(exporter);
    setShowExporterModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm(t('dashboard.confirmDelete'))) {
      try {
        await apiService.deleteProduct(productId);
        refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('dashboard.welcome')}, {user?.email}
                </h1>
                <p className="text-gray-600">
                  {t('dashboard.subtitle')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{t('dashboard.lastLogin')}</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
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
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>{t('dashboard.tabs.products')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('exporters')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'exporters'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{t('dashboard.tabs.exporters')}</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('dashboard.products.title')}
                  </h2>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('dashboard.products.add')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products?.map((product: any) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>{t('dashboard.products.quantity')}:</span>
                          <span>{product.quantity} {product.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('dashboard.products.taxRate')}:</span>
                          <span>{product.tax_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('dashboard.products.period')}:</span>
                          <span>{product.time_period}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'exporters' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('dashboard.exporters.title')}
                  </h2>
                  <button
                    onClick={() => setShowExporterModal(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('dashboard.exporters.add')}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {exporters?.map((exporter: any) => (
                    <motion.div
                      key={exporter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{exporter.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {t('dashboard.exporters.license')}: {exporter.license_id}
                          </p>
                          {exporter.contact && (
                            <p className="text-sm text-gray-600">{exporter.contact}</p>
                          )}
                          {exporter.website && (
                            <a
                              href={exporter.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              {exporter.website}
                            </a>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditExporter(exporter)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            refetchProducts();
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showExporterModal && (
        <ExporterModal
          exporter={editingExporter}
          onClose={() => {
            setShowExporterModal(false);
            setEditingExporter(null);
          }}
          onSuccess={() => {
            refetchExporters();
            setShowExporterModal(false);
            setEditingExporter(null);
          }}
        />
      )}
    </div>
  );
};

export default CountryDashboard;