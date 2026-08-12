import { useState } from 'react';
import { Clock, MoreVertical, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ServiceTableProps {
  services: any[];
  onPreview: (service: any) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  isSelectionMode?: boolean;
  selectedServiceIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
}

export default function ServiceTable({ 
  services, 
  onPreview,
  onUpdateStatus,
  onDelete,
  isSelectionMode,
  selectedServiceIds,
  onToggleSelect,
  onSelectAll
}: ServiceTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const renderTimeAvailability = (service: any) => {
    let slots: any[] = [];
    if (service.slotAvailabilityEnabled) {
      try {
        slots = typeof service.slots === 'string' ? JSON.parse(service.slots) : service.slots;
      } catch (e) {}
    } else if (service.timeAvailabilityEnabled && service.startTime && service.endTime) {
      slots = [{ startTime: service.startTime, endTime: service.endTime }];
    }

    if (slots && slots.length > 0) {
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {slots.map((slot: any, idx: number) => (
              <span key={idx} className="inline-flex items-center bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                {slot.startTime} - {slot.endTime}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return <span className="text-gray-400 text-xs">-</span>;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-visible shadow-sm">
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {isSelectionMode && (
                <th className="py-4.5 px-6 w-12 no-preview">
                  <input 
                    type="checkbox" 
                    checked={services.length > 0 && selectedServiceIds?.length === services.length}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                  />
                </th>
              )}
              <th className="py-4.5 px-6">Service</th>
              <th className="py-4.5 px-4">Service Code</th>
              <th className="py-4.5 px-4">Price</th>
              <th className="py-4.5 px-4">Time Availability</th>
              <th className="py-4.5 px-4">Status</th>
              <th className="py-4.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => {
              const codeDisplay = service.code || '-';
              return (
                <tr key={service.id} className="hover:bg-gray-50/30 transition group cursor-pointer" onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('.no-preview')) return;
                  if (isSelectionMode) {
                    onToggleSelect?.(service.id);
                  } else {
                    onPreview(service);
                  }
                }}>
                  {isSelectionMode && (
                    <td className="py-4 px-6 no-preview" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedServiceIds?.includes(service.id) || false}
                        onChange={() => onToggleSelect?.(service.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                      />
                    </td>
                  )}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-blue-100">
                      {service.coverImage ? (
                        <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition leading-tight">{service.name}</p>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium line-clamp-1">{service.description || 'No description provided.'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-700 font-bold tracking-tight">{codeDisplay}</td>
                  <td className="py-4 px-4 text-xs font-black text-gray-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(service.price)}
                  </td>
                  <td className="py-4 px-4">{renderTimeAvailability(service)}</td>
                  <td className="py-4 px-4 no-preview">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUpdateStatus) {
                          onUpdateStatus(service.id, service.status === 'Active' ? 'Inactive' : 'Active');
                        }
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                        service.status === 'Active' 
                          ? 'bg-[#E6F4EA] text-[#137333] hover:bg-[#d4edd9]' 
                          : 'bg-[#F1F3F4] text-[#3C4043] hover:bg-[#e4e6e7]'
                      }`}
                    >
                      {service.status}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right no-preview relative overflow-visible">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === service.id ? null : service.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition inline-flex"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>

                    {activeMenuId === service.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-6 top-12 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-fade-in text-left">
                          <Link 
                            href={`/services/${service.id}/edit`} 
                            className="flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-semibold"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Edit</span>
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveMenuId(null);
                              onDelete?.(service.id);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition font-semibold text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {services.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center no-preview">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">No services found</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      We couldn't find any services matching the current filter. Try selecting another tab or adding a new service.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden flex flex-col divide-y divide-gray-100">
        {services.length === 0 ? (
          <div className="py-16 text-center px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
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
        ) : (
          services.map(service => (
            <div 
              key={service.id} 
              className="p-4 hover:bg-gray-50/50 transition cursor-pointer"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('.no-preview')) {
                  onPreview(service);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-blue-100">
                    {service.coverImage ? (
                       <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{service.code || '-'}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(service.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 no-preview">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateStatus) {
                        onUpdateStatus(service.id, service.status === 'Active' ? 'Inactive' : 'Active');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      service.status === 'Active' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#F1F3F4] text-[#3C4043]'
                    }`}
                  >
                    {service.status}
                  </button>

                  <div className="flex gap-1.5 mt-1">
                    <Link href={`/services/${service.id}/edit`} className="p-1.5 rounded border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete?.(service.id);
                      }}
                      className="p-1.5 rounded border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 border-t border-gray-50 pt-2.5 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] text-gray-400 font-medium shrink-0">Availability:</span>
                {renderTimeAvailability(service)}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
