import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductForm {
  name: string;
  unit: string;
  quantity: number;
  tax_rate: number;
  time_period: string;
  category: string;
  tags: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductForm>({
    defaultValues: product ? {
      ...product,
      tags: product.tags?.join(', ') || ''
    } : {}
  });

  const categories = [
    'Agriculture',
    'Manufacturing',
    'Energy',
    'Technology',
    'Textiles',
    'Chemicals',
    'Food & Beverages',
    'Raw Materials'
  ];

  const units = [
    'kg', 'ton', 'liter', 'gallon', 'm³', 'pieces', 'boxes', 'tons'
  ];

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    try {
      const productData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (product) {
        await apiService.updateProduct(product.id, productData);
        toast.success(t('dashboard.products.updateSuccess'));
      } else {
        await apiService.createProduct(productData);
        toast.success(t('dashboard.products.createSuccess'));
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || t('dashboard.products.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {product ? t('dashboard.products.edit') : t('dashboard.products.add')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.products.name')}
              </label>
              <input
                {...register('name', { required: t('dashboard.validation.required') })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('dashboard.products.namePlaceholder')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.products.quantity')}
                </label>
                <input
                  {...register('quantity', { 
                    required: t('dashboard.validation.required'),
                    min: { value: 0, message: t('dashboard.validation.positive') }
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.products.unit')}
                </label>
                <select
                  {...register('unit', { required: t('dashboard.validation.required') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('dashboard.products.selectUnit')}</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.products.taxRate')} (%)
                </label>
                <input
                  {...register('tax_rate', { 
                    required: t('dashboard.validation.required'),
                    min: { value: 0, message: t('dashboard.validation.positive') },
                    max: { value: 100, message: t('dashboard.validation.maxPercent') }
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.tax_rate && (
                  <p className="mt-1 text-sm text-red-600">{errors.tax_rate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.products.category')}
                </label>
                <select
                  {...register('category', { required: t('dashboard.validation.required') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('dashboard.products.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.products.timePeriod')}
              </label>
              <input
                {...register('time_period', { required: t('dashboard.validation.required') })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Q1 2024, Jan-Mar 2024, etc."
              />
              {errors.time_period && (
                <p className="mt-1 text-sm text-red-600">{errors.time_period.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.products.tags')}
              </label>
              <input
                {...register('tags')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('dashboard.products.tagsPlaceholder')}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('dashboard.products.tagsHint')}
              </p>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;