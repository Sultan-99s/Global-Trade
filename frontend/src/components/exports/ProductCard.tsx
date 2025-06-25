import React, { useState } from 'react';
import { MapPin, Calendar, TrendingUp, Users, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    unit: string;
    quantity: number;
    tax_rate: number;
    time_period: string;
    category: string;
    country: {
      name: string;
      code: string;
      flag_url?: string;
    };
    updated_at: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const [showExporters, setShowExporters] = useState(false);

  const getFlagEmoji = (countryCode: string) => {
    const flagMap: { [key: string]: string } = {
      'USA': '🇺🇸', 'BRA': '🇧🇷', 'IND': '🇮🇳', 'RUS': '🇷🇺', 'CHN': '🇨🇳',
      'GER': '🇩🇪', 'FRA': '🇫🇷', 'ESP': '🇪🇸', 'BGD': '🇧🇩', 'JPN': '🇯🇵'
    };
    return flagMap[countryCode] || '🌍';
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (quantity >= 1000000) {
      return `${(quantity / 1000000).toFixed(1)}M ${unit}`;
    } else if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)}K ${unit}`;
    }
    return `${quantity} ${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-lg">{getFlagEmoji(product.country.code)}</span>
              <span>{product.country.name}</span>
            </div>
          </div>
          <div className="bg-blue-50 px-2 py-1 rounded-lg">
            <span className="text-xs font-medium text-blue-600">{product.category}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">{t('exports.card.quantity')}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatQuantity(product.quantity, product.unit)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-600">{t('exports.card.taxRate')}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{product.tax_rate}%</p>
          </div>
        </div>

        {/* Time Period */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{product.time_period}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {t('exports.card.updated')}: {formatDate(product.updated_at)}
          </div>
          <button
            onClick={() => setShowExporters(!showExporters)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>{t('exports.card.viewExporters')}</span>
          </button>
        </div>
      </div>

      {/* Exporters Section (Expandable) */}
      {showExporters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-100 bg-gray-50 px-6 py-4"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t('exports.card.authorizedExporters')}
          </h4>
          <div className="space-y-2">
            {/* Mock exporter data - would come from API */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900">Global Trade Corp</span>
              <span className="text-gray-500">License: GTC-2024-001</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900">International Exports Ltd</span>
              <span className="text-gray-500">License: IEL-2024-045</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard;