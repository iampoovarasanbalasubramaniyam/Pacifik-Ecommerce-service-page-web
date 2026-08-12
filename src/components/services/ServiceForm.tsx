'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trash2, Upload, Plus, Sparkles, AlertCircle, X, Clock, HelpCircle, Info,
  Settings, Check, LayoutGrid, CalendarCheck, ShieldAlert, CreditCard,
  MessageSquare, Sliders, CalendarDays, Timer, RefreshCw, Mail, Users, MapPin, 
  DollarSign, Percent, ArrowLeft, Crown, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import ServicePreview from '@/components/services/ServicePreview';

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onDelete?: () => void;
}

// Reliable React-controlled toggle (avoids Tailwind peer/pseudo-element issues)
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

export default function ServiceForm({ initialData, onSubmit, onDelete }: ServiceFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');
  const [showProUpsellModal, setShowProUpsellModal] = useState(false);
  const [usedProFeatures, setUsedProFeatures] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [salePrice, setSalePrice] = useState(initialData?.salePrice || '');
  const [includeTax, setIncludeTax] = useState(initialData?.includeTax || false);
  const [taxPercentage, setTaxPercentage] = useState(initialData?.taxPercentage || '');
  const [duration, setDuration] = useState(initialData?.duration || '1 hr');
  const [status, setStatus] = useState(initialData?.status || 'Draft');
  const [visibility, setVisibility] = useState(initialData?.visibility ?? true);
  const [reviewsEnabled, setReviewsEnabled] = useState(initialData?.reviewsEnabled ?? true);
  const [maxBookingEnabled, setMaxBookingEnabled] = useState(initialData?.maxBookingEnabled ?? false);
  const [maxBookings, setMaxBookings] = useState(initialData?.maxBookings || 10);

  // Available days selection
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [availableDays, setAvailableDays] = useState<string[]>(() => {
    try {
      if (initialData?.availableDays) {
        return typeof initialData.availableDays === 'string' 
          ? JSON.parse(initialData.availableDays) 
          : initialData.availableDays;
      }
    } catch (e) {}
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  });

  const toggleDay = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Time availability
  const [timeAvailabilityEnabled, setTimeAvailabilityEnabled] = useState(initialData?.timeAvailabilityEnabled ?? false);
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(initialData?.endTime || '06:00 PM');

  // Slot based availability
  const [slotAvailabilityEnabled, setSlotAvailabilityEnabled] = useState(initialData?.slotAvailabilityEnabled ?? false);
  const [slots, setSlots] = useState<{ startTime: string; endTime: string }[]>(() => {
    try {
      if (initialData?.slots) {
        return typeof initialData.slots === 'string' 
          ? JSON.parse(initialData.slots) 
          : initialData.slots;
      }
    } catch (e) {}
    return [{ startTime: '09:00 AM', endTime: '01:00 PM' }];
  });

  const addSlot = () => {
    setSlots(prev => [...prev, { startTime: '02:00 PM', endTime: '06:00 PM' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateSlot = (index: number, key: 'startTime' | 'endTime', value: string) => {
    setSlots(prev => prev.map((slot, idx) => idx === index ? { ...slot, [key]: value } : slot));
  };

  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(() => {
    try {
      if (initialData?.tags) {
        return typeof initialData.tags === 'string' 
          ? JSON.parse(initialData.tags) 
          : initialData.tags;
      }
    } catch (e) {}
    return [];
  });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Cover Image
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [images, setImages] = useState<string[]>(() => {
    try {
      if (initialData?.images) {
        return typeof initialData.images === 'string' 
          ? JSON.parse(initialData.images) 
          : initialData.images;
      }
    } catch (e) {}
    return [];
  });

  // Related Services Mock
  const [showPreview, setShowPreview] = useState(false);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [relatedServiceIds, setRelatedServiceIds] = useState<string[]>(() => {
    try {
      if (initialData?.relatedServiceIds) {
        return typeof initialData.relatedServiceIds === 'string' 
          ? JSON.parse(initialData.relatedServiceIds) 
          : initialData.relatedServiceIds;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    fetch('/api/services?limit=100')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setAllServices(json.data.services.filter((s: any) => s.id !== initialData?.id));
        }
      });
  }, [initialData?.id]);

  const addRelatedService = (id: string) => {
    if (!relatedServiceIds.includes(id)) {
      setRelatedServiceIds(prev => [...prev, id]);
    }
  };

  const removeRelatedService = (id: string) => {
    setRelatedServiceIds(prev => prev.filter(item => item !== id));
  };

  // Advanced Pro Toggles
  const [advancePaymentEnabled, setAdvancePaymentEnabled] = useState(initialData?.advancePaymentEnabled ?? false);
  const [advanceAmount, setAdvanceAmount] = useState(initialData?.advanceAmount || '');
  const [addOnsEnabled, setAddOnsEnabled] = useState(initialData?.addOnsEnabled ?? false);
  const [addOns, setAddOns] = useState<any[]>(() => {
    try {
      if (initialData?.addOns) {
        return typeof initialData.addOns === 'string' 
          ? JSON.parse(initialData.addOns) 
          : initialData.addOns;
      }
    } catch (e) {}
    return [];
  });

  const [timeBufferEnabled, setTimeBufferEnabled] = useState(initialData?.timeBufferEnabled ?? false);
  const [timeBuffer, setTimeBuffer] = useState(initialData?.timeBuffer || '15');
  const [multipleProvidersEnabled, setMultipleProvidersEnabled] = useState(initialData?.multipleProvidersEnabled ?? false);
  const [providersCount, setProvidersCount] = useState(initialData?.providersCount || 1);
  const [serviceLocationEnabled, setServiceLocationEnabled] = useState(initialData?.serviceLocationEnabled ?? false);
  const [locationInput, setLocationInput] = useState('');
  const [allowedLocations, setAllowedLocations] = useState<string[]>(() => {
    try {
      if (initialData?.allowedLocations) {
        return typeof initialData.allowedLocations === 'string'
          ? JSON.parse(initialData.allowedLocations)
          : initialData.allowedLocations;
      }
    } catch (e) {}
    return [];
  });

  const addLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && locationInput.trim()) {
      e.preventDefault();
      const loc = locationInput.trim().replace(/,$/, '');
      if (loc && !allowedLocations.includes(loc)) {
        setAllowedLocations(prev => [...prev, loc]);
      }
      setLocationInput('');
    }
  };

  const removeLocation = (loc: string) => {
    setAllowedLocations(prev => prev.filter(l => l !== loc));
  };
  const [cancellationPolicyEnabled, setCancellationPolicyEnabled] = useState(initialData?.cancellationPolicyEnabled ?? false);
  const [cancellationCharges, setCancellationCharges] = useState(initialData?.cancellationCharges || '');
  const [rescheduleEnabled, setRescheduleEnabled] = useState(initialData?.rescheduleEnabled ?? false);
  const [minimumBookingNoticeEnabled, setMinimumBookingNoticeEnabled] = useState(initialData?.minimumBookingNoticeEnabled ?? false);
  const [minimumNoticeHours, setMinimumNoticeHours] = useState(initialData?.minimumNoticeHours || 24);
  const [customInstructionsEnabled, setCustomInstructionsEnabled] = useState(initialData?.customInstructionsEnabled ?? false);
  const [customInstructions, setCustomInstructions] = useState(initialData?.customInstructions || '');
  const [subscriptionBookingEnabled, setSubscriptionBookingEnabled] = useState(initialData?.subscriptionBookingEnabled ?? false);
  const [availabilityOverrideEnabled, setAvailabilityOverrideEnabled] = useState(initialData?.availabilityOverrideEnabled ?? false);
  const [availabilityOverrides, setAvailabilityOverrides] = useState<any[]>(() => {
    try {
      if (initialData?.availabilityOverrides) {
        return typeof initialData.availabilityOverrides === 'string' 
          ? JSON.parse(initialData.availabilityOverrides) 
          : initialData.availabilityOverrides;
      }
    } catch (e) {}
    return [];
  });
  const [autoAssignProviderEnabled, setAutoAssignProviderEnabled] = useState(initialData?.autoAssignProviderEnabled ?? false);
  const [customerSupportEnabled, setCustomerSupportEnabled] = useState(initialData?.customerSupportEnabled ?? false);
  const [supportContact, setSupportContact] = useState(initialData?.supportContact || '');
  const [taxAndChargesEnabled, setTaxAndChargesEnabled] = useState(initialData?.taxAndChargesEnabled ?? false);
  const [taxRules, setTaxRules] = useState(initialData?.taxRules || '');
  const [serviceRemindersEnabled, setServiceRemindersEnabled] = useState(initialData?.serviceRemindersEnabled ?? false);

  // Add-ons items
  const [addOnInput, setAddOnInput] = useState({ name: '', price: '' });

  // Reschedule details
  const [rescheduleMaxCount, setRescheduleMaxCount] = useState(initialData?.rescheduleMaxCount || '2');
  const [rescheduleHoursBefore, setRescheduleHoursBefore] = useState(initialData?.rescheduleHoursBefore || '24');

  // Subscription details
  const [subscriptionDays, setSubscriptionDays] = useState(initialData?.subscriptionDays || '');

  // Advanced Notifications
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState(initialData?.emailNotificationEnabled ?? false);
  const [smsNotificationEnabled, setSmsNotificationEnabled] = useState(initialData?.smsNotificationEnabled ?? false);
  const [reminderNotificationEnabled, setReminderNotificationEnabled] = useState(initialData?.reminderNotificationEnabled ?? false);
  const [reminderHoursBefore, setReminderHoursBefore] = useState(initialData?.reminderHoursBefore || '24');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Service name is required');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tags.length === 0) {
      setError('At least one service tag is required');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (advancePaymentEnabled && !price) {
      setError('Service price is required when advance payment is enabled');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (advancePaymentEnabled && (!advanceAmount || Number(advanceAmount) <= 0)) {
      setError('Advance Payment is enabled. Please enter a valid deposit amount.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (addOnsEnabled && addOns.length === 0) {
      setError('Add-ons is enabled. Please add at least one item.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (timeBufferEnabled && (!timeBuffer || Number(timeBuffer) <= 0)) {
      setError('Service Time Buffer is enabled. Please enter buffer time.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (multipleProvidersEnabled && (!providersCount || Number(providersCount) <= 0)) {
      setError('Multiple Providers is enabled. Please enter staff count.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (serviceLocationEnabled && allowedLocations.length === 0) {
      setError('Service Location is enabled. Please add at least one location.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cancellationPolicyEnabled && (!cancellationCharges || Number(cancellationCharges) < 0)) {
      setError('Cancellation Policy is enabled. Please enter cancellation charges.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (rescheduleEnabled && (!rescheduleMaxCount || !rescheduleHoursBefore || Number(rescheduleMaxCount) <= 0 || Number(rescheduleHoursBefore) <= 0)) {
      setError('Reschedule Rules enabled. Please fill all fields properly.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (minimumBookingNoticeEnabled && (!minimumNoticeHours || Number(minimumNoticeHours) <= 0)) {
      setError('Minimum Notice is enabled. Please enter valid hours.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (subscriptionBookingEnabled && (!subscriptionDays || subscriptionDays.trim() === '')) {
      setError('Subscription Booking is enabled. Please enter repeating days.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (availabilityOverrideEnabled && availabilityOverrides.length === 0) {
      setError('Availability Override is enabled. Please add at least one override.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (customerSupportEnabled && (!supportContact || supportContact.trim() === '')) {
      setError('Customer Support is enabled. Please provide contact details.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (taxAndChargesEnabled && (!taxRules || taxRules.trim() === '')) {
      setError('Tax & Charges is enabled. Please enter tax rules.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Pro Features usage validation
    const usedFeatures: Record<string, number> = {};
    if (advancePaymentEnabled) usedFeatures['Advance Payment'] = 149;
    if (timeBufferEnabled) usedFeatures['Time Buffer'] = 49;
    if (multipleProvidersEnabled) usedFeatures['Multiple Providers'] = 199;
    if (serviceLocationEnabled) usedFeatures['Service Locations'] = 99;
    if (cancellationPolicyEnabled) usedFeatures['Cancellation Policy'] = 49;
    if (rescheduleEnabled) usedFeatures['Reschedule Rules'] = 49;
    if (minimumBookingNoticeEnabled) usedFeatures['Minimum Notice'] = 49;
    if (customInstructionsEnabled) usedFeatures['Custom Instructions'] = 49;
    if (subscriptionBookingEnabled) usedFeatures['Subscription Booking'] = 299;
    if (availabilityOverrideEnabled) usedFeatures['Availability Overrides'] = 99;
    if (autoAssignProviderEnabled) usedFeatures['Auto Assign Provider'] = 149;

    // Check if any of these are not covered by subscribedFeatures (assuming we had a user plan, for now just show if any used)
    // For this mockup, any pro feature triggers the payment requirement
    if (Object.keys(usedFeatures).length > 0) {
      setUsedProFeatures(usedFeatures);
      setShowProUpsellModal(true);
      return;
    }

    const payload = {
      name,
      code: code || null,
      description,
      price: parseFloat(price) || 0,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      includeTax,
      taxPercentage: taxPercentage ? parseFloat(taxPercentage) : null,
      duration,
      status,
      visibility,
      reviewsEnabled,
      maxBookingEnabled,
      maxBookings: parseInt(maxBookings as any) || 10,
      availableDays,
      timeAvailabilityEnabled,
      startTime,
      endTime,
      slotAvailabilityEnabled,
      slots,
      tags,
      coverImage: coverImage || null,
      images,
      relatedServiceIds,
      
      // Pro/Advanced features
      advancePaymentEnabled,
      advanceAmount: advanceAmount ? parseFloat(advanceAmount) : null,
      addOnsEnabled,
      addOns,
      timeBufferEnabled,
      timeBuffer: timeBufferEnabled ? parseInt(timeBuffer as any) : null,
      multipleProvidersEnabled,
      providersCount: multipleProvidersEnabled ? parseInt(providersCount as any) : 1,
      serviceLocationEnabled,
      allowedLocations: serviceLocationEnabled ? JSON.stringify(allowedLocations) : null,
      cancellationPolicyEnabled,
      cancellationCharges: cancellationPolicyEnabled ? parseFloat(cancellationCharges) : null,
      rescheduleEnabled,
      minimumBookingNoticeEnabled,
      minimumNoticeHours: minimumBookingNoticeEnabled ? parseInt(minimumNoticeHours as any) : 24,
      customInstructionsEnabled,
      customInstructions: customInstructionsEnabled ? customInstructions : null,
      subscriptionBookingEnabled,
      subscriptionDays: subscriptionBookingEnabled ? subscriptionDays : null,
      availabilityOverrideEnabled,
      availabilityOverrides,
      autoAssignProviderEnabled,
      customerSupportEnabled,
      supportContact: customerSupportEnabled ? supportContact : null,
      taxAndChargesEnabled,
      taxRules: taxAndChargesEnabled ? taxRules : null,
      serviceRemindersEnabled,
      rescheduleMaxCount: rescheduleEnabled ? parseInt(rescheduleMaxCount as any) : null,
      rescheduleHoursBefore: rescheduleEnabled ? parseInt(rescheduleHoursBefore as any) : null,
      // Notifications
      emailNotificationEnabled,
      smsNotificationEnabled,
      reminderNotificationEnabled,
      reminderHoursBefore: reminderNotificationEnabled ? parseInt(reminderHoursBefore as any) : null,
    };

    try {
      await onSubmit(payload);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCoverImage = (url: string, idx: number) => {
    const prevCover = coverImage;
    setCoverImage(url);
    if (prevCover) {
      setImages(prev => prev.map((img, i) => i === idx ? prevCover : img));
    } else {
      setImages(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          if (!coverImage) {
            setCoverImage(data.url);
          } else {
            setImages(prev => [...prev, data.url]);
          }
        } else {
          setError(data.error || 'Failed to upload image');
        }
      } catch (err: any) {
        setError(err.message || 'Error uploading image');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pt-0 px-4 pb-4 lg:pt-0 lg:px-6 lg:pb-6 text-gray-700">
      
      {/* Top Header with Back Button */}
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">{initialData ? 'Edit Service' : 'Add New Service'}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 sm:whitespace-nowrap hidden sm:block">Key info to describe and display your service.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete}
              className="p-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition shrink-0"
              title="Delete Service"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Link 
            href="/services/pro"
            className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 min-w-[36px] sm:min-w-0"
          >
            <Crown className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-amber-950 text-amber-950 shrink-0" />
            <span className="hidden sm:inline-block">Service Pro</span>
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 shrink-0 whitespace-nowrap ml-auto sm:ml-0 flex items-center justify-center gap-1.5 min-w-[36px] sm:min-w-0"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:hidden shrink-0" strokeWidth={3} />
                <span className="hidden sm:inline-block">Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* LEFT COLUMN: Sidebar info (Images, Visibility, Related, Preview) */}
      <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0 order-2 lg:order-1">
        
        {/* Service Images */}
        <div className="bg-white rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1">
            Service Images
            <span title="Upload up to 5 images for the service">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            </span>
          </h3>
          
          {/* Main Cover Image */}
          <div className="w-full aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center relative cursor-pointer group hover:bg-gray-100/50 hover:border-blue-400 transition-all duration-200">
            {coverImage ? (
              <>
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-4">
                <Upload className="w-8 h-8 text-gray-400 mb-2 stroke-[1.5]" />
                <span className="text-xs font-semibold text-gray-700">Upload Cover Image</span>
                <span className="text-[10px] text-gray-400 mt-1">JPG, PNG or WEBP. Max 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Thumbnail list */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {images.map((url, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSetCoverImage(url, idx)}
                className="aspect-square bg-gray-50 border border-gray-100 rounded-lg overflow-hidden relative group cursor-pointer hover:border-blue-400 transition-all duration-255"
                title="Click to set as cover image"
              >
                <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[8px] font-bold text-white gap-1 select-none">
                  <ImageIcon className="w-3.5 h-3.5 text-white" />
                  <span>Set Cover</span>
                </div>

                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-0.5 right-0.5 z-10 p-0.5 bg-black/60 rounded text-white hover:bg-black transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            
            {images.length < 4 && (
              <label className="aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <Plus className="w-5 h-5 text-gray-400" />
                <span className="text-[8px] font-semibold text-gray-500 mt-1">Add More</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Visibility</h3>
          <p className="text-xs text-gray-500 mb-4 leading-normal">Configure if this service is visible to customers in search results and catalogs.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">{visibility ? 'Visible' : 'Hidden'}</span>
            <Toggle checked={visibility} onChange={setVisibility} />
          </div>
        </div>

        {/* Preview Button */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Preview</h3>
          <p className="text-xs text-gray-500 mb-4 leading-normal">Preview how this service will appear to customers in the catalog before publishing.</p>
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
          >
            Preview Service
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Related Services</h3>
            <div className="relative group">
              <button 
                type="button" 
                className="p-1 hover:bg-gray-100 rounded text-blue-600 transition"
                onClick={() => {
                  const targetId = prompt('Select service ID to add: \n' + allServices.map(s => `${s.id}: ${s.name}`).join('\n'));
                  if (targetId) addRelatedService(targetId);
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mb-4 leading-normal">Cross-sell other matching services during customer booking.</p>
          
          <div className="space-y-3">
            {relatedServiceIds.map(id => {
              const matching = allServices.find(s => s.id === id);
              if (!matching) return null;
              return (
                <div key={id} className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{matching.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">₹ {matching.price}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeRelatedService(id)}
                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {relatedServiceIds.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No related services linked.</p>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Tabs, General form, Advanced form */}
      <div className="flex-1 bg-white rounded-3xl p-6 flex flex-col gap-6 order-1 lg:order-2 w-full">

        {/* Tabs switcher */}
        <div className="sticky top-0 z-30 bg-white pt-4 pb-4 -mx-6 px-6 -mt-6 border-b border-gray-100 rounded-t-3xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex p-1 bg-gray-100/80 rounded-xl">
            <button 
              type="button"
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Settings className="w-4 h-4" />
              General Options
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Crown className={`w-4 h-4 ${activeTab === 'advanced' ? 'text-amber-500 fill-amber-400' : 'text-gray-400 hover:text-amber-500'}`} />
              Advanced Pro
            </button>
          </div>
        </div>

        {/* Error alerting */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}

        {/* GENERAL TAB CONTENT */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            
            {/* Service Name & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Service Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Home Cleaning Service"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Service Code (Optional)</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., HCS-001"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Service Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Service Tag *</label>
              <div className="mt-1 mb-2.5 flex items-start gap-2 bg-blue-50/70 border border-blue-100 rounded-xl p-2.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-blue-700 leading-normal">
                  Note: Tags help group and list services in home page sections, category pages, search indexes, etc.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-xl focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Enter tag and press Enter"
                  className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Duration (Optional)</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
              >
                <option value="30 mins">30 mins</option>
                <option value="1 hr">1 hr</option>
                <option value="2 hrs">2 hrs</option>
                <option value="3 hrs">3 hrs</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>

            {/* Price Details */}
            <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Price Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Currency</label>
                  <div className="flex items-center h-[34px] px-3 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 select-none">
                    INR (₹)
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Price</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 899.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    required={advancePaymentEnabled}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Sale Price</label>
                  <input 
                    type="number" 
                    value={salePrice} 
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g., 999.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input 
                      type="checkbox" 
                      checked={includeTax} 
                      onChange={(e) => setIncludeTax(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="text-xs font-bold text-gray-700">Add Tax</span>
                  </label>
                </div>
              </div>

              {includeTax && (
                <div className="pt-2 animate-fade-in">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Tax Percentage (%)</label>
                  <div className="relative max-w-[150px]">
                    <input 
                      type="number" 
                      value={taxPercentage} 
                      onChange={(e) => setTaxPercentage(e.target.value)}
                      placeholder="e.g., 18"
                      className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
                      <Percent className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Available Days *</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => {
                  const selected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        selected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Based Availability */}
            <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Time Based Availability (Optional)</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Set the overall operating schedule for when this service is offered.</p>
                </div>
                <Toggle checked={timeAvailabilityEnabled} onChange={setTimeAvailabilityEnabled} />
              </div>

              {timeAvailabilityEnabled && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-2">Start Time</label>
                    <input 
                      type="text" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="e.g., 09:00 AM"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-2">End Time</label>
                    <input 
                      type="text" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="e.g., 06:00 PM"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Slot Based Availability */}
            <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Slot Based Availability (Optional)</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Configure explicit bookings blocks for precise time slot management.</p>
                </div>
                <Toggle checked={slotAvailabilityEnabled} onChange={setSlotAvailabilityEnabled} />
              </div>

              {slotAvailabilityEnabled && (
                <div className="space-y-3 animate-fade-in">
                  {slots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          value={slot.startTime} 
                          onChange={(e) => updateSlot(idx, 'startTime', e.target.value)}
                          placeholder="Start Time"
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                        <input 
                          type="text" 
                          value={slot.endTime} 
                          onChange={(e) => updateSlot(idx, 'endTime', e.target.value)}
                          placeholder="End Time"
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                      {slots.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeSlot(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded border border-gray-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSlot}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Slot
                  </button>
                </div>
              )}
            </div>

            {/* Max Bookings per Day & Ratings & Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Max Bookings */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Max Booking per Day (Optional)</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Cap total slots booked daily.</p>
                  </div>
                  <Toggle checked={maxBookingEnabled} onChange={setMaxBookingEnabled} />
                </div>

                {maxBookingEnabled && (
                  <div className="flex items-center gap-3 max-w-[150px] bg-gray-50 border border-gray-200 rounded-xl p-1 animate-fade-in">
                    <button 
                      type="button" 
                      onClick={() => setMaxBookings((prev: any) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold text-sm text-gray-500 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-sm font-bold text-gray-800">{maxBookings}</span>
                    <button 
                      type="button" 
                      onClick={() => setMaxBookings((prev: any) => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold text-sm text-gray-500 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Service Details Description */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Service Details (Optional)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                placeholder="Write about the service, benefits, process, and other important details..."
                className="w-full min-h-[120px] px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal leading-relaxed"
              />
              <div className="text-right text-[10px] text-gray-400 font-semibold mt-1">
                {description.length}/1000
              </div>
            </div>

          </div>
        )}

        {/* ADVANCED TAB CONTENT */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">Advanced Service Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Advance Payment */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <CreditCard className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Advance Payment
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Collect partial payment upfront.</p>
                    </div>
                  </div>
                  <Toggle checked={advancePaymentEnabled} onChange={setAdvancePaymentEnabled} />
                </div>

                {advancePaymentEnabled && (
                  <div className="animate-fade-in relative max-w-[150px]">
                    <input 
                      type="number" 
                      value={advanceAmount} 
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      placeholder="Advance Amount"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Add-ons */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Add-ons
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Offer extra items or combos at additional cost.</p>
                    </div>
                  </div>
                  <Toggle checked={addOnsEnabled} onChange={setAddOnsEnabled} />
                </div>

                {addOnsEnabled && (
                  <div className="animate-fade-in space-y-3">
                    {/* Existing add-on rows */}
                    {addOns.length > 0 && (
                      <div className="space-y-2">
                        {addOns.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="flex-1 text-xs font-semibold text-gray-800">{item.name}</span>
                            <span className="text-xs font-bold text-blue-700">₹{item.price}</span>
                            <button type="button" onClick={() => setAddOns((prev: any[]) => prev.filter((_: any, i: number) => i !== idx))} className="text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Add new row */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={addOnInput.name}
                        onChange={e => setAddOnInput(p => ({ ...p, name: e.target.value }))}
                        placeholder="Item name (e.g. Deep Clean)"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                      <input
                        type="number"
                        value={addOnInput.price}
                        onChange={e => setAddOnInput(p => ({ ...p, price: e.target.value }))}
                        placeholder="₹ Price"
                        className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (addOnInput.name.trim() && addOnInput.price) {
                            setAddOns((prev: any[]) => [...prev, { name: addOnInput.name.trim(), price: parseFloat(addOnInput.price) }]);
                            setAddOnInput({ name: '', price: '' });
                          }
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">Enter item name and price, then click + to add.</p>
                  </div>
                )}
              </div>

              {/* Service Time Buffer */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Timer className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Service Time Buffer
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Set prep/cleanup buffer intervals.</p>
                    </div>
                  </div>
                  <Toggle checked={timeBufferEnabled} onChange={setTimeBufferEnabled} />
                </div>

                {timeBufferEnabled && (
                  <div className="animate-fade-in relative max-w-[150px]">
                    <input 
                      type="number" 
                      value={timeBuffer} 
                      onChange={(e) => setTimeBuffer(e.target.value)}
                      placeholder="Minutes"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Multiple Service Providers */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Users className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Multiple Service Providers
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Assign multiple staff to service.</p>
                    </div>
                  </div>
                  <Toggle checked={multipleProvidersEnabled} onChange={setMultipleProvidersEnabled} />
                </div>

                {multipleProvidersEnabled && (
                  <div className="animate-fade-in relative max-w-[150px]">
                    <input 
                      type="number" 
                      value={providersCount} 
                      onChange={(e) => setProvidersCount(e.target.value)}
                      placeholder="Staff count"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Service Location */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Service Location
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Add cities or areas where this service is available.</p>
                    </div>
                  </div>
                  <Toggle checked={serviceLocationEnabled} onChange={setServiceLocationEnabled} />
                </div>

                {serviceLocationEnabled && (
                  <div className="animate-fade-in space-y-3">
                    {/* Location chips */}
                    {allowedLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {allowedLocations.map(loc => (
                          <span
                            key={loc}
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            <MapPin className="w-3 h-3" />
                            {loc}
                            <button
                              type="button"
                              onClick={() => removeLocation(loc)}
                              className="ml-0.5 hover:text-blue-900 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Input */}
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={locationInput}
                        onChange={e => setLocationInput(e.target.value)}
                        onKeyDown={addLocation}
                        placeholder="Type a city name and press Enter (e.g. Chennai)"
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">Press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-[9px] font-mono">Enter</kbd> or <kbd className="bg-gray-100 px-1 py-0.5 rounded text-[9px] font-mono">,</kbd> after each location name.</p>
                  </div>
                )}
              </div>



              {/* Reschedule Option */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <RefreshCw className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Reschedule Option
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Let customers reschedule their booking.</p>
                    </div>
                  </div>
                  <Toggle checked={rescheduleEnabled} onChange={setRescheduleEnabled} />
                </div>

                {rescheduleEnabled && (
                  <div className="animate-fade-in grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1">Max Reschedules Allowed</label>
                      <input
                        type="number"
                        value={rescheduleMaxCount}
                        onChange={e => setRescheduleMaxCount(e.target.value)}
                        min="1" max="10"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1">Cutoff Before Booking (hrs)</label>
                      <input
                        type="number"
                        value={rescheduleHoursBefore}
                        onChange={e => setRescheduleHoursBefore(e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Minimum Booking Notice */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Min Booking Notice
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Set advance booking cutoff time.</p>
                    </div>
                  </div>
                  <Toggle checked={minimumBookingNoticeEnabled} onChange={setMinimumBookingNoticeEnabled} />
                </div>
              </div>

              {/* Subscription Based Service */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <CalendarCheck className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Subscription Booking
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Enable recurring / subscription-based booking.</p>
                    </div>
                  </div>
                  <Toggle checked={subscriptionBookingEnabled} onChange={setSubscriptionBookingEnabled} />
                </div>

                {subscriptionBookingEnabled && (
                  <div className="animate-fade-in mt-3">
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Active Period (Days)</label>
                    <input
                      type="number"
                      value={subscriptionDays}
                      onChange={e => setSubscriptionDays(e.target.value)}
                      placeholder="e.g. 30"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Customer Support Contact */}
              <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        Customer Support
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Provide customer contact details.</p>
                    </div>
                  </div>
                  <Toggle checked={customerSupportEnabled} onChange={setCustomerSupportEnabled} />
                </div>

                {customerSupportEnabled && (
                  <div className="animate-fade-in relative max-w-[150px]">
                    <input 
                      type="text" 
                      value={supportContact} 
                      onChange={(e) => setSupportContact(e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* ── Advanced Notifications ── */}
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Advanced Notifications
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Email Booking Confirmation */}
                <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          Email Confirmation
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Send booking confirmation email to customer.</p>
                      </div>
                    </div>
                    <Toggle checked={emailNotificationEnabled} onChange={setEmailNotificationEnabled} />
                  </div>
                  {emailNotificationEnabled && (
                    <div className="animate-fade-in bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        📧 An automatic booking confirmation email will be sent to the customer's registered email address after every successful booking.
                      </p>
                    </div>
                  )}
                </div>

                {/* SMS Notification */}
                <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <MessageSquare className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          SMS Notification
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Send booking SMS to customer's phone.</p>
                      </div>
                    </div>
                    <Toggle checked={smsNotificationEnabled} onChange={setSmsNotificationEnabled} />
                  </div>
                  {smsNotificationEnabled && (
                    <div className="animate-fade-in bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        📱 Customer will receive an SMS with booking details and a confirmation code on their registered mobile number.
                      </p>
                    </div>
                  )}
                </div>

                {/* Booking Reminder */}
                <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          Booking Reminder
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pro</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Remind customer before the appointment.</p>
                      </div>
                    </div>
                    <Toggle checked={reminderNotificationEnabled} onChange={setReminderNotificationEnabled} />
                  </div>
                  {reminderNotificationEnabled && (
                    <div className="animate-fade-in space-y-2">
                      <label className="block text-[10px] font-bold text-gray-600">Remind customer how many hours before?</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={reminderHoursBefore}
                          onChange={e => setReminderHoursBefore(e.target.value)}
                          min="1"
                          className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                        <span className="text-xs text-gray-500 font-medium">hours before booking</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Reminder will be sent via email and SMS (if enabled).</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Pro Upsell Modal */}
      {showProUpsellModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowProUpsellModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-32 bg-gradient-to-br from-[#5B32EA] to-[#3a1a9a] relative overflow-hidden flex items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>

              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center shadow-lg transform -rotate-6">
                <Crown className="w-8 h-8 text-amber-300" />
              </div>
              <button
                type="button"
                onClick={() => setShowProUpsellModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-[#1a2b4b] mb-2">
                Pro Features Detected!
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                You've utilized advanced Pro options on this service. To publish it, you
                need to unlock these features.
              </p>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6 text-left max-h-48 overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Selected Features</h4>
                <div className="flex flex-col gap-2">
                  {Object.entries(usedProFeatures).map(([key, price]) => {
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-[#1a2b4b] font-medium flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5B32EA]"></div>
                          {key}
                        </span>
                        <span className="text-[#004EEB] font-bold">₹{price}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[#1a2b4b] font-bold">Total Cost</span>
                  <span className="text-xl font-extrabold text-[#5B32EA]">
                    ₹{Object.values(usedProFeatures).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/services/pro"
                  className="w-full py-3 bg-amber-400 text-[#1a2b4b] font-bold rounded-xl hover:bg-amber-500 transition shadow-sm flex items-center justify-center gap-2"
                >
                  Go with Pro options
                </Link>
                <button
                  type="button"
                  onClick={() => setShowProUpsellModal(false)}
                  className="w-full py-3 bg-white text-[#1a2b4b] font-semibold rounded-xl hover:bg-gray-50 transition border border-gray-200"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>{/* end flex wrapper */}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4 sm:p-6">
          <div className="w-full max-w-[400px] max-h-[85vh] flex flex-col bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <ServicePreview 
              service={{
                id: initialData?.id || '',
                name,
                code: '',
                description,
                category: '',
                tags,
                status,
                price: parseFloat(price) || 0,
                salePrice: salePrice ? parseFloat(salePrice) : null,
                stockStatus: 'Available',
                coverImage,
                availableDays,
                startTime,
                endTime,
                slots,
                timeAvailabilityEnabled,
                slotAvailabilityEnabled
              }} 
              onClose={() => setShowPreview(false)} 
            />
          </div>
        </div>
      )}
    </form>
  );
}
