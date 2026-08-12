import { Pencil, Trash, Clock } from 'lucide-react';
import Link from 'next/link';

interface ServiceGridProps {
  services: any[];
  onPreview: (service: any) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  isSelectionMode?: boolean;
  selectedServiceIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export default function ServiceGrid({ 
  services, 
  onPreview, 
  onUpdateStatus, 
  onDelete,
  isSelectionMode,
  selectedServiceIds,
  onToggleSelect
}: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm w-full col-span-full">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">No services found</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            We couldn't find any services matching the current filter. Try selecting another tab or adding a new service.
          </p>
        </div>
      </div>
    );
  }

  const renderTimeAvailability = (service: any) => {
    if (service.slotAvailabilityEnabled) {
      try {
        const slots = typeof service.slots === 'string' ? JSON.parse(service.slots) : service.slots;
        if (slots && slots.length > 0) {
          return `${slots.length} Slots Available`;
        }
      } catch (e) {}
    }
    
    if (service.timeAvailabilityEnabled && service.startTime && service.endTime) {
      return `${service.startTime} - ${service.endTime}`;
    }

    return 'No schedule set';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map(service => (
        <div 
          key={service.id}
          className="bg-white rounded-2xl border border-gray-150 transition-all cursor-pointer group flex flex-col hover:shadow-md"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.no-preview')) return;
            if (isSelectionMode) {
              onToggleSelect?.(service.id);
            } else {
              onPreview(service);
            }
          }}
        >
          {/* Cover Image Container */}
          <div className="relative h-44 bg-gray-50 rounded-t-2xl overflow-hidden border-b border-gray-100 flex items-center justify-center">
            {isSelectionMode && (
              <div className="absolute top-3 left-3 no-preview z-10" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedServiceIds?.includes(service.id) || false}
                  onChange={() => onToggleSelect?.(service.id)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4.5 h-4.5 bg-white border border-gray-300"
                />
              </div>
            )}
            {service.coverImage ? (
              <img 
                src={service.coverImage} 
                alt={service.name} 
                className="w-full h-full object-cover group-hover:scale-102 transition duration-300" 
              />
            ) : (
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            )}
            
            <div className="absolute top-3 right-3 no-preview flex gap-1.5 z-10">
              <Link 
                href={`/services/${service.id}/edit`} 
                className="w-8 h-8 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm transition"
                title="Edit Service"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(service.id);
                }}
                className="w-8 h-8 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-gray-500 hover:text-red-600 shadow-sm transition"
                title="Delete Service"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-1 group-hover:text-blue-600 transition mb-1">{service.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{service.description || 'No description provided.'}</p>

            <div className="mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-3">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate">{renderTimeAvailability(service)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-base text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(service.price)}
                </span>
                
                <div className="no-preview">
                  <select 
                    value={service.status}
                    onChange={(e) => onUpdateStatus?.(service.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer text-center focus:outline-none ${
                      service.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 
                      service.status === 'Inactive' ? 'bg-orange-50 text-orange-700' : 
                      'bg-gray-150 text-gray-700'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
