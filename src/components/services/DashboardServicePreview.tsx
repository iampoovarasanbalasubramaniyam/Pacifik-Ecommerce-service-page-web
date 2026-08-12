import React from 'react';
import { X, Calendar, Clock, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DashboardServicePreviewProps {
  service: any;
  onClose: () => void;
  onEdit?: (service: any) => void;
}

export default function DashboardServicePreview({ service, onClose, onEdit }: DashboardServicePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const getDays = () => {
    let days: string[] = [];
    if (service.availableDays) {
      try {
        days = typeof service.availableDays === 'string' ? JSON.parse(service.availableDays) : service.availableDays;
      } catch (e) {}
    }
    return Array.isArray(days) && days.length > 0 ? days : [];
  };

  const availableDays = getDays();

  return (
    <div className="w-[400px] flex-shrink-0 sticky top-8 h-[calc(100vh-64px)] flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Align with "Service Overview" text on the left */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Service Preview</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Image */}
        <div className="w-full h-[240px] bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
          {service.coverImage ? (
            <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Title & Status */}
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-2xl font-bold text-[#1a2b4b] truncate pr-4">{service.name || 'Untitled Service'}</h3>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 ${
            service.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {service.status || 'Draft'}
          </span>
        </div>

        <div className="h-px bg-gray-100 w-full shrink-0" />

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
            <p className="text-[18px] font-bold text-[#1a2b4b]">{formatCurrency(service.price)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-[18px] font-bold text-[#1a2b4b]">{service.duration || 'Not specified'}</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full shrink-0" />

        {/* Available Days */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-[#1a2b4b] text-sm">Available Days</h4>
          </div>
          {availableDays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableDays.map(day => (
                <span key={day} className="px-3 py-1 bg-gray-50 text-[#1a2b4b] text-sm font-semibold rounded-lg">
                  {day}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not specified</p>
          )}
        </div>

        {/* Time Availability */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-[#1a2b4b] text-sm">Time Availability</h4>
          </div>
          <p className="text-sm text-gray-400">Regular working hours disabled</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-4 bg-white z-10 shrink-0">
        <Link 
          href={`/services/${service.id}/edit`}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-transparent bg-[#1a56db] text-white font-bold hover:bg-blue-700 transition"
        >
          <ExternalLink className="w-4 h-4" />
          Edit Details
        </Link>
        <button 
          onClick={onClose}
          className="flex items-center justify-center py-3 rounded-xl border border-gray-200 text-[#1a2b4b] font-bold hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
      
      </div>

    </div>
  );
}
