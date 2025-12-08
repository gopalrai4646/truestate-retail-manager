import React, { useState, useRef, useEffect } from 'react';
import { FilterState } from '../types';
import { AVAILABLE_REGIONS, AVAILABLE_CATEGORIES, AVAILABLE_PAYMENT_METHODS, AVAILABLE_TAGS, AVAILABLE_GENDERS } from '../constants';
import { ChevronDown, Calendar, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

type DropdownType = 'region' | 'gender' | 'age' | 'category' | 'tags' | 'payment' | 'date' | null;

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type: DropdownType) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const newArray = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: newArray });
  };

  const handleRangeChange = (key: 'min' | 'max', value: string) => {
    const num = parseInt(value, 10);
    onFilterChange({
      ...filters,
      ageRange: { ...filters.ageRange, [key]: isNaN(num) ? 0 : num }
    });
  };

  const handleDateChange = (key: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, [key]: value }
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: filters.searchQuery,
      regions: [],
      genders: [],
      ageRange: { min: 0, max: 100 },
      categories: [],
      tags: [],
      paymentMethods: [],
      dateRange: { start: '', end: '' },
    });
    setActiveDropdown(null);
  };

  const isActive = (type: DropdownType) => {
    switch (type) {
      case 'region': return filters.regions.length > 0;
      case 'gender': return filters.genders.length > 0;
      case 'age': return filters.ageRange.min > 0 || filters.ageRange.max < 100;
      case 'category': return filters.categories.length > 0;
      case 'tags': return filters.tags.length > 0;
      case 'payment': return filters.paymentMethods.length > 0;
      case 'date': return !!filters.dateRange.start || !!filters.dateRange.end;
      default: return false;
    }
  };

  const getLabel = (type: DropdownType, defaultLabel: string) => {
    if (!isActive(type)) return defaultLabel;
    
    switch (type) {
      case 'region': return `Region (${filters.regions.length})`;
      case 'gender': return `Gender (${filters.genders.length})`;
      case 'category': return `Category (${filters.categories.length})`;
      case 'tags': return `Tags (${filters.tags.length})`;
      case 'payment': return `Payment (${filters.paymentMethods.length})`;
      case 'age': return `Age: ${filters.ageRange.min}-${filters.ageRange.max}`;
      case 'date': return 'Date Active';
      default: return defaultLabel;
    }
  };

  const renderDropdownContent = () => {
    switch (activeDropdown) {
      case 'region':
        return (
          <div className="space-y-2">
            {AVAILABLE_REGIONS.map(region => (
              <label key={region} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={filters.regions.includes(region)}
                  onChange={() => toggleArrayFilter('regions', region)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{region}</span>
              </label>
            ))}
          </div>
        );
      case 'gender':
        return (
          <div className="space-y-2">
            {AVAILABLE_GENDERS.map(gender => (
              <label key={gender} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={filters.genders.includes(gender)}
                  onChange={() => toggleArrayFilter('genders', gender)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        );
      case 'category':
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {AVAILABLE_CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleArrayFilter('categories', cat)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        );
      case 'tags':
        return (
          <div className="flex flex-wrap gap-2 w-64">
            {AVAILABLE_TAGS.map(tag => (
               <button
               key={tag}
               onClick={() => toggleArrayFilter('tags', tag)}
               className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                 filters.tags.includes(tag) 
                   ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                   : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
               }`}
             >
               {tag}
             </button>
            ))}
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-2">
            {AVAILABLE_PAYMENT_METHODS.map(method => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={filters.paymentMethods.includes(method)}
                  onChange={() => toggleArrayFilter('paymentMethods', method)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        );
      case 'age':
        return (
          <div className="flex items-center space-x-2 p-2">
            <input 
              type="number" 
              placeholder="Min"
              min="0" max="100"
              value={filters.ageRange.min}
              onChange={(e) => handleRangeChange('min', e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-primary-500 bg-white text-gray-900"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Max"
              min="0" max="100"
              value={filters.ageRange.max}
              onChange={(e) => handleRangeChange('max', e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-primary-500 bg-white text-gray-900"
            />
          </div>
        );
      case 'date':
        return (
          <div className="space-y-3 p-1">
             <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">From</label>
              <input 
                type="date" 
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">To</label>
              <input 
                type="date" 
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const FilterButton = ({ type, label }: { type: DropdownType; label: string }) => {
    // Determine color based on type for active state
    const getActiveColorClass = () => {
       if (type === 'region' || type === 'category') return 'bg-cyan-600 border-cyan-700 text-white';
       if (type === 'gender') return 'bg-pink-600 border-pink-700 text-white';
       if (type === 'tags') return 'bg-indigo-600 border-indigo-700 text-white';
       if (type === 'payment') return 'bg-emerald-600 border-emerald-700 text-white';
       return 'bg-primary-600 border-primary-700 text-white';
    };

    const isBtnActive = isActive(type);
    
    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(type)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${
            isBtnActive 
              ? getActiveColorClass() 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>{getLabel(type, label)}</span>
          {isBtnActive && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] ml-0.5">
               {type === 'age' || type === 'date' ? '•' : (filters as any)[type + 's']?.length || '•'}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-70 ${activeDropdown === type ? 'rotate-180' : ''}`} />
        </button>
      </div>
    );
  }

  const hasActiveFilters = Object.values(filters).some(val => 
    Array.isArray(val) ? val.length > 0 : 
    typeof val === 'object' ? (val as any).min > 0 || (val as any).start !== '' : false
  );

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm z-20 relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-2 text-gray-400">
          <Filter className="w-4 h-4" />
        </div>

        <FilterButton type="region" label="Customer Region" />
        <FilterButton type="gender" label="Gender" />
        <FilterButton type="age" label="Age Range" />
        <FilterButton type="category" label="Product Category" />
        <FilterButton type="tags" label="Tags" />
        <FilterButton type="payment" label="Payment Method" />
        
        <div className="relative">
          <button
            onClick={() => toggleDropdown('date')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${
              isActive('date')
                ? 'bg-gray-800 border-gray-900 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{getLabel('date', 'Date')}</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="flex items-center gap-1 ml-auto text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors border border-transparent hover:border-red-100"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Popover Content */}
      {activeDropdown && (
        <div className="absolute top-full mt-2 left-6 bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
             <h3 className="font-semibold text-gray-800 text-sm capitalize">
               {activeDropdown === 'date' ? 'Date Range' : activeDropdown}
             </h3>
             <button onClick={() => setActiveDropdown(null)} className="text-gray-400 hover:text-gray-600">
               <X className="w-4 h-4" />
             </button>
           </div>
           {renderDropdownContent()}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;