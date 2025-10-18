'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchParams {
  search?: string;
  location?: string;
  contractType?: string;
  minSalary?: string;
  maxSalary?: string;
}

interface JobSearchFiltersProps {
  locations: string[];
  contractTypes: string[];
  searchParams: SearchParams;
}

export default function JobSearchFilters({ 
  locations, 
  contractTypes, 
  searchParams 
}: JobSearchFiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    location: searchParams.location || '',
    contractType: searchParams.contractType || '',
    minSalary: searchParams.minSalary || '',
    maxSalary: searchParams.maxSalary || '',
  });

  const [showAdvanced, setShowAdvanced] = useState(
    !!searchParams.location || !!searchParams.contractType || !!searchParams.minSalary || !!searchParams.maxSalary
  );

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      contractType: '',
      minSalary: '',
      maxSalary: '',
    });
    router.push('/jobs');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={applyFilters}
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Search
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-border"
          >
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
      >
        <span>Advanced Filters</span>
        <svg
          className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <select
              id="location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Type Filter */}
          <div>
            <label htmlFor="contractType" className="block text-sm font-medium text-foreground mb-2">
              Job Type
            </label>
            <select
              id="contractType"
              value={filters.contractType}
              onChange={(e) => handleFilterChange('contractType', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background"
            >
              <option value="">All Types</option>
              {contractTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Min Salary Filter */}
          <div>
            <label htmlFor="minSalary" className="block text-sm font-medium text-foreground mb-2">
              Min Salary (KSH)
            </label>
            <input
              type="number"
              id="minSalary"
              placeholder="0"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange('minSalary', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Max Salary Filter */}
          <div>
            <label htmlFor="maxSalary" className="block text-sm font-medium text-foreground mb-2">
              Max Salary (KSH)
            </label>
            <input
              type="number"
              id="maxSalary"
              placeholder="Any"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
              Search: {filters.search}
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 hover:text-primary/70 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-2 hover:text-secondary/70 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
          {filters.contractType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
              Type: {filters.contractType}
              <button
                onClick={() => handleFilterChange('contractType', '')}
                className="ml-2 hover:text-accent/70 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
          {(filters.minSalary || filters.maxSalary) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-foreground border border-border">
              Salary: {filters.minSalary || '0'} - {filters.maxSalary || 'Any'} KSH
              <button
                onClick={() => {
                  handleFilterChange('minSalary', '');
                  handleFilterChange('maxSalary', '');
                }}
                className="ml-2 hover:text-foreground/70 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}