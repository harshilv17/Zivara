'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

interface FilterState {
  category: string[];
  priceRange: [number, number];
  material: string[];
  sortBy: string;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories?: string[];
  materials?: string[];
  maxPrice?: number;
}

const defaultCategories = ['Totes', 'Slings', 'Wallets', 'Clutches', 'Backpacks'];
const defaultMaterials = ['Vegan Leather', 'Canvas', 'Faux Suede', 'Premium PU'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function ProductFilter({
  onFilterChange,
  categories = defaultCategories,
  materials = defaultMaterials,
  maxPrice = 10000,
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, maxPrice],
    material: [],
    sortBy: 'newest',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const toggleMaterial = (mat: string) => {
    setFilters((prev) => ({
      ...prev,
      material: prev.material.includes(mat)
        ? prev.material.filter((m) => m !== mat)
        : [...prev.material, mat],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, maxPrice],
      material: [],
      sortBy: 'newest',
    });
  };

  const activeFilterCount =
    filters.category.length +
    filters.material.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <FilterDropdown
            label="Category"
            options={categories}
            selected={filters.category}
            onToggle={toggleCategory}
          />
          <FilterDropdown
            label="Material"
            options={materials}
            selected={filters.material}
            onToggle={toggleMaterial}
          />
          <PriceRangeFilter
            min={0}
            max={maxPrice}
            value={filters.priceRange}
            onChange={(range) => setFilters((prev) => ({ ...prev, priceRange: range }))}
          />
        </div>
        <div className="flex items-center gap-4">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-[#5a7c65]"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
          <SortDropdown
            value={filters.sortBy}
            onChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex items-center justify-between py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#5a7c65] text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        <SortDropdown
          value={filters.sortBy}
          onChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
        />
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden max-h-[80vh] overflow-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          filters.category.includes(cat)
                            ? 'bg-[#5a7c65] text-white border-[#5a7c65]'
                            : 'border-gray-200 hover:border-[#5a7c65]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Material</h4>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => toggleMaterial(mat)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          filters.material.includes(mat)
                            ? 'bg-[#5a7c65] text-white border-[#5a7c65]'
                            : 'border-gray-200 hover:border-[#5a7c65]'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <PriceRangeFilter
                    min={0}
                    max={maxPrice}
                    value={filters.priceRange}
                    onChange={(range) => setFilters((prev) => ({ ...prev, priceRange: range }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 border border-gray-200 rounded-lg font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 bg-[#5a7c65] text-white rounded-lg font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Dropdown for desktop filters
function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-[#5a7c65]/10 text-[#5a7c65] text-xs px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[180px] z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <span>{option}</span>
                  {selected.includes(option) && <Check className="w-4 h-4 text-[#5a7c65]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Price range slider
function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">₹{value[0].toLocaleString()}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
        className="w-24 accent-[#5a7c65]"
      />
      <span className="text-gray-300">-</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
        className="w-24 accent-[#5a7c65]"
      />
      <span className="text-sm text-gray-500">₹{value[1].toLocaleString()}</span>
    </div>
  );
}

// Sort dropdown
function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLabel = sortOptions.find((opt) => opt.value === value)?.label || 'Sort';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[180px] z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <span>{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 text-[#5a7c65]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
