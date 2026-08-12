import { ClipboardList, Check, Pause } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  activeFilter?: 'all' | 'active' | 'inactive';
  onFilterChange?: (filter: 'all' | 'active' | 'inactive') => void;
}

export default function ServiceStats({ stats, activeFilter = 'all', onFilterChange }: StatsProps) {
  const { total, active, inactive } = stats;

  const activePercent = total > 0 ? ((active / total) * 100).toFixed(1) : '0';
  const inactivePercent = total > 0 ? ((inactive / total) * 100).toFixed(1) : '0';

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-tight">Service Overview</h3>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
        {/* Total Services */}
        <button
          type="button"
          onClick={() => onFilterChange?.('all')}
          className={`text-left p-2.5 sm:p-4.5 rounded-2xl flex items-center gap-2 sm:gap-4 transition-all duration-200 border shadow-sm ${
            activeFilter === 'all'
              ? 'bg-[#EFF6FF] border-[#BFDBFE] ring-2 ring-blue-50'
              : 'bg-white border-gray-200/60 hover:border-blue-200'
          }`}
        >
          <div className="bg-[#2B81FB] text-white p-2 sm:p-3 rounded-xl shrink-0 shadow-sm shadow-blue-200">
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wide uppercase truncate">
              Total<span className="hidden sm:inline"> Services</span>
            </p>
            <h3 className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5">{total}</h3>
            <p className="text-[8px] sm:text-[10px] font-medium text-gray-400 mt-0.5 truncate">All services</p>
          </div>
        </button>

        {/* Active Services */}
        <button
          type="button"
          onClick={() => onFilterChange?.('active')}
          className={`text-left p-2.5 sm:p-4.5 rounded-2xl flex items-center gap-2 sm:gap-4 transition-all duration-200 border shadow-sm ${
            activeFilter === 'active'
              ? 'bg-[#E6F4EA] border-[#A7F3D0] ring-2 ring-green-50'
              : 'bg-white border-gray-200/60 hover:border-green-200'
          }`}
        >
          <div className="bg-[#10B981] text-white p-2 sm:p-3 rounded-xl shrink-0 shadow-sm shadow-emerald-100">
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wide uppercase truncate">
              Active<span className="hidden sm:inline"> Services</span>
            </p>
            <h3 className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5">{active}</h3>
            <p className="text-[8px] sm:text-[10px] font-bold text-[#137333] mt-0.5 truncate">
              {activePercent}%<span className="hidden sm:inline"> of total</span>
            </p>
          </div>
        </button>

        {/* Inactive Services */}
        <button
          type="button"
          onClick={() => onFilterChange?.('inactive')}
          className={`text-left p-2.5 sm:p-4.5 rounded-2xl flex items-center gap-2 sm:gap-4 transition-all duration-200 border shadow-sm ${
            activeFilter === 'inactive'
              ? 'bg-[#FFF7ED] border-[#FFEDD5] ring-2 ring-orange-50'
              : 'bg-white border-gray-200/60 hover:border-orange-200'
          }`}
        >
          <div className="bg-[#F97316] text-white p-2 sm:p-3 rounded-xl shrink-0 shadow-sm shadow-orange-100">
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wide uppercase truncate">
              Inactive<span className="hidden sm:inline"> Services</span>
            </p>
            <h3 className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5">{inactive}</h3>
            <p className="text-[8px] sm:text-[10px] font-bold text-[#C2410C] mt-0.5 truncate">
              {inactivePercent}%<span className="hidden sm:inline"> of total</span>
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
