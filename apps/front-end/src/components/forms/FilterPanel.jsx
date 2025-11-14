import React, { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  PRICE_RANGES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  PROPERTY_AMENITIES,
} from '@/utils/constants';
import Button from '@/components/common/Button';
import { useMultiSelect } from '@/hooks/useForm';

/**
 * FilterPanel Component
 * Advanced filtering options for property listings
 */

const FilterPanel = ({ initialFilters = {}, onFilterChange, className = '' }) => {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    status: initialFilters.status || '',
    priceRange: initialFilters.priceRange || '',
    bedrooms: initialFilters.bedrooms || '',
    bathrooms: initialFilters.bathrooms || '',
    ...initialFilters,
  });

  const amenitiesSelect = useMultiSelect(initialFilters.amenities || []);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    if (amenitiesSelect.selected.length > 0) {
      amenitiesSelect.selected.forEach(amenity => {
        queryParams.append('amenities', amenity);
      });
    }

    router.push(`/properties?${queryParams.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      status: '',
      priceRange: '',
      bedrooms: '',
      bathrooms: '',
    });
    amenitiesSelect.clear();
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-neutral-200 pb-4 mb-4 last:border-0">
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">{title}</h3>
      {children}
    </div>
  );

  const SelectFilter = ({ name, label, options, value, onChange }) => (
    <div>
      <label htmlFor={name} className="block text-xs text-neutral-600 mb-2">
        {label}
      </label>
      <select
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={clsx('bg-white rounded-lg border border-neutral-200 p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        <button
          onClick={handleResetFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Reset
        </button>
      </div>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleFilterChange('type', type.value)}
              className={clsx(
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                filters.type === type.value
                  ? 'bg-primary-100 border-primary-600 text-primary-700'
                  : 'border-neutral-300 hover:bg-neutral-50'
              )}
            >
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        <div className="space-y-2">
          {Object.entries(PROPERTY_STATUS).map(([key, value]) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={value}
                checked={filters.status === value}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 capitalize">
                {value.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <SelectFilter
          name="priceRange"
          label="Select price range"
          options={PRICE_RANGES.map((range) => ({
            value: `${range.min}-${range.max}`,
            label: range.label,
          }))}
          value={filters.priceRange}
          onChange={handleFilterChange}
        />
      </FilterSection>

      {/* Bedrooms & Bathrooms */}
      <FilterSection title="Rooms">
        <div className="grid grid-cols-2 gap-3">
          <SelectFilter
            name="bedrooms"
            label="Bedrooms"
            options={BEDROOM_OPTIONS}
            value={filters.bedrooms}
            onChange={handleFilterChange}
          />
          <SelectFilter
            name="bathrooms"
            label="Bathrooms"
            options={BATHROOM_OPTIONS}
            value={filters.bathrooms}
            onChange={handleFilterChange}
          />
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {PROPERTY_AMENITIES.map((amenity) => (
            <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={amenitiesSelect.isSelected(amenity.value)}
                onChange={() => amenitiesSelect.toggle(amenity.value)}
                className="text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">
                {amenity.icon} {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleApplyFilters}
        className="mt-4"
      >
        Apply Filters
      </Button>
    </div>
  );
};

/**
 * Mobile Filter Panel (Drawer)
 */
export const MobileFilterPanel = ({ isOpen, onClose, ...props }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <FilterPanel {...props} onFilterChange={(filters) => {
            props.onFilterChange?.(filters);
            onClose();
          }} />
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
