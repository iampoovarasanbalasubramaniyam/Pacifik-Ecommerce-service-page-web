import { List, Grid, Plus, Search, Crown, CheckSquare } from 'lucide-react';
import Link from 'next/link';

interface ToolbarProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  isSelectionMode: boolean;
  onSelectionModeToggle: () => void;
}

export default function ServiceToolbar({ 
  viewMode, 
  setViewMode, 
  searchQuery,
  onSearchChange,
  isSelectionMode,
  onSelectionModeToggle
}: ToolbarProps) {
  return (
    <div className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-gray-200/60 mb-6 flex flex-row items-center justify-between gap-3">
      
      {/* Search and Select */}
      <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={onSelectionModeToggle}
          title={isSelectionMode ? 'Cancel Selection' : 'Select Services'}
          className={`flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 border rounded-xl text-sm font-semibold transition shrink-0 ${
            isSelectionMode 
              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">{isSelectionMode ? 'Cancel' : 'Select'}</span>
        </button>
      </div>

      {/* View Mode Toggle and Add Service buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle List/Grid */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Add Service and Pro */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/services/new"
            title="Add Service"
            className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Service</span>
          </Link>

          <Link
            href="/services/pro"
            title="Service Pro"
            className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-amber-950 rounded-xl text-sm font-bold transition shadow-sm whitespace-nowrap"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Service Pro</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
