import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UnitConverter = () => {
  const { t } = useTranslation();
  const [system, setSystem] = useState<'metric' | 'imperial'>('metric');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lb');

  const units = {
    weight: {
      metric: ['kg', 'ton', 'g'],
      imperial: ['lb', 'oz', 'ton (US)']
    },
    volume: {
      metric: ['liter', 'ml', 'm³'],
      imperial: ['gallon', 'fl oz', 'ft³']
    },
    area: {
      metric: ['m²', 'hectare', 'km²'],
      imperial: ['ft²', 'acre', 'mile²']
    }
  };

  const conversions: { [key: string]: number } = {
    'kg-lb': 2.20462,
    'ton-ton (US)': 1.10231,
    'liter-gallon': 0.264172,
    'm²-ft²': 10.7639
  };

  const convert = (value: number, from: string, to: string): number => {
    const conversionKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    
    if (conversions[conversionKey]) {
      return value * conversions[conversionKey];
    } else if (conversions[reverseKey]) {
      return value / conversions[reverseKey];
    }
    return value;
  };

  const convertedValue = convert(value, fromUnit, toUnit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {t('converter.title')}
        </span>
        <button
          onClick={() => setSystem(system === 'metric' ? 'imperial' : 'metric')}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{system === 'metric' ? 'Imperial' : 'Metric'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter value"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {units.weight.metric.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {units.weight.imperial.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-900">
            <span className="font-medium">{value} {fromUnit}</span>
            <span className="mx-2">=</span>
            <span className="font-medium">{convertedValue.toFixed(2)} {toUnit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;