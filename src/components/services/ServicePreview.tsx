import { X, ExternalLink, Clock, Calendar, Edit2, ShieldAlert, Image as ImageIcon, CheckCircle2, MinusCircle } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

interface ServicePreviewProps {
  service: any;
  onClose: () => void;
  className?: string;
}

export default function ServicePreview({ service, onClose, className }: ServicePreviewProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const getTags = () => {
    try {
      const tags = typeof service.tags === 'string' ? JSON.parse(service.tags) : service.tags;
      if (Array.isArray(tags) && tags.length > 0) {
        return tags;
      }
    } catch (e) {}
    return [];
  };

  const tags = getTags();

  return (
    <div className={`w-full h-full flex flex-col bg-white overflow-hidden text-[#1a2b4b] ${className || ''}`}>
      
      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 min-h-0 bg-white relative">
        {/* Cover Image Header */}
        <div className="relative w-full h-[250px] bg-gray-100 flex items-center justify-center">
          {service.coverImage ? (
             <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 opacity-50 mb-2" />
            </div>
          )}
          
          {/* Action Overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
             <div className="px-2.5 py-1.5 bg-black/50 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span className="text-[10px] font-semibold text-white">Customer View</span>
             </div>
             <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm text-white hover:bg-black/70 transition">
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="p-5">
          {/* Title & Code */}
          <h2 className="font-bold text-[20px] leading-snug">{service.name || 'Untitled Service'}</h2>
          {service.code && (
            <p className="text-[11px] font-medium text-gray-400 mt-1">Code: {service.code}</p>
          )}

          <div className="h-4"></div>

          {/* Price and Duration Card */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-[14px] p-3.5">
            <div className="flex-1">
               <span className="text-[10px] font-medium text-gray-400">Price</span>
               <div className="flex items-end gap-2 mt-1">
                  <span className="text-[22px] font-bold leading-none">{formatCurrency(service.price).split('.')[0]}</span>
                  {service.salePrice && (
                    <span className="text-[14px] text-gray-400 line-through mb-0.5">{formatCurrency(service.salePrice).split('.')[0]}</span>
                  )}
               </div>
            </div>
            <div className="w-[1px] h-10 bg-slate-200 mx-4 self-center"></div>
            <div className="flex-1">
               <span className="text-[10px] font-medium text-gray-400">Duration</span>
               <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-[15px] font-bold">{service.duration || 'Flexible'}</span>
               </div>
            </div>
          </div>

          <div className="h-5"></div>

          {/* Tags */}
          {tags.length > 0 && (
             <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map((tag: string, idx: number) => (
                   <span key={idx} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full text-[10px] font-bold">
                      {tag}
                   </span>
                ))}
             </div>
          )}

          {/* About section */}
          <h3 className="font-bold text-[14px] mb-2">About this service</h3>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-5 whitespace-pre-wrap">
             {service.description || 'No description provided.'}
          </p>

          {/* Visibility Pill */}
          <div className="inline-flex mb-2">
             <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                service.visibility !== false ? 'bg-emerald-50' : 'bg-gray-100'
             }`}>
                {service.visibility !== false ? (
                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                   <MinusCircle className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={`text-[10px] font-bold ${
                   service.visibility !== false ? 'text-emerald-700' : 'text-gray-500'
                }`}>
                   {service.visibility !== false ? 'Visible to customers' : 'Hidden from customers'}
                </span>
             </div>
          </div>

        </div>
      </div>
      
      {/* Footer Book Now */}
      <div className="p-5 border-t border-slate-100 bg-white shrink-0">
        <button disabled className="w-full bg-blue-600 text-white rounded-[14px] py-4 flex items-center justify-center gap-2 font-bold text-[15px] transition opacity-90 cursor-default">
          <Calendar className="w-4 h-4" />
          Book Now
        </button>
      </div>
    </div>
  );
}
