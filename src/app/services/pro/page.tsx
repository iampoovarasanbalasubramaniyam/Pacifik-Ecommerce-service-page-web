'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crown, ArrowLeft, CreditCard, Sparkles, Timer, Users, MapPin, 
  ShieldAlert, RefreshCw, Clock, Mail, Coins, MessageSquare, CalendarDays,
  X, Check, HelpCircle, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceProPage() {
  const [toggles, setToggles] = useState({
    advancePayment: false,
    addOns: false,
    timeBuffer: false,
    multipleProviders: false,
    serviceLocation: false,
    reschedule: false,
    minimumBookingNotice: false,
    customInstructions: false,
    subscriptionBooking: false,
    availabilityOverride: false,
    customerSupportContact: false,
    serviceReminders: false,
  });

  const [previewFeature, setPreviewFeature] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('serviceProFeaturesSettings');
    if (saved) {
      try {
        setToggles(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleToggle = (key: keyof typeof toggles) => {
    const newToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(newToggles);
    localStorage.setItem('serviceProFeaturesSettings', JSON.stringify(newToggles));
  };

  const proFeatures = [
    {
      id: 'advancePayment',
      title: 'Advance Payment',
      description: 'Ask customers to pay a small amount upfront to confirm their booking.',
      icon: CreditCard,
      bgColor: 'bg-[#F3F0FF]',
      iconBg: 'bg-[#5B32EA]',
      buttonColor: 'bg-[#D6CCF7] text-[#3A1DB5] hover:bg-[#C4B8F5]',
      buttonActiveColor: 'bg-[#5B32EA] text-white hover:bg-[#4A28C8]',
      previewData: {
        works: 'Ask customers to pay a small amount upfront to confirm their booking.',
        benefits: ['Reduces last-minute booking drop-offs', 'Secures baseline revenue for reservations', 'Validates buyer seriousness upfront'],
        industries: ['High-end Spas', 'Plumbing & Repairs', 'Event catering', 'Photography sessions']
      }
    },
    {
      id: 'addOns',
      title: 'Extra Options',
      description: 'Let customers pick optional add-ons while booking.',
      icon: Sparkles,
      bgColor: 'bg-[#FFF4EC]',
      iconBg: 'bg-[#F28B36]',
      buttonColor: 'bg-[#FDDBB8] text-[#B85F10] hover:bg-[#FBCDA0]',
      buttonActiveColor: 'bg-[#F28B36] text-white hover:bg-[#D9741F]',
      previewData: {
        works: 'Offer optional extra services or materials that customers can purchase during the booking flow.',
        benefits: ['Increases Average Order Value (AOV)', 'Provides a checklist of optional extras', 'Saves separate transaction efforts'],
        industries: ['Car Detailing', 'Deep Home Cleaning', 'Massage therapies', 'Pest Control']
      }
    },
    {
      id: 'timeBuffer',
      title: 'Gap Time Between Jobs',
      description: 'Add a short break between bookings for prep or travel.',
      icon: Timer,
      bgColor: 'bg-[#F0F5FF]',
      iconBg: 'bg-[#2B81FB]',
      buttonColor: 'bg-[#C0D9FE] text-[#1050B8] hover:bg-[#A8C9FD]',
      buttonActiveColor: 'bg-[#2B81FB] text-white hover:bg-[#1565E8]',
      previewData: {
        works: 'Automatically locks a brief window (e.g. 15 mins) before/after a booking so staff can rest, clean tools, or travel to the next site.',
        benefits: ['Prevents back-to-back booking fatigue', 'Ensures staff arrives prepared and on time', 'Allows proper tool sanitation'],
        industries: ['On-site Home Cleaning', 'Physiotherapy sessions', 'Pet Grooming', 'Appliance Installations']
      }
    },
    {
      id: 'multipleProviders',
      title: 'Add More Staff',
      description: 'Assign two or more staff members to one booking.',
      icon: Users,
      bgColor: 'bg-[#EBFAED]',
      iconBg: 'bg-[#1FB165]',
      buttonColor: 'bg-[#B6EDBE] text-[#0D7A40] hover:bg-[#9EE5A8]',
      buttonActiveColor: 'bg-[#1FB165] text-white hover:bg-[#178A50]',
      previewData: {
        works: 'Assign more than one staff member to a single booking (e.g. a team of two cleaners for a large house cleaning service).',
        benefits: ['Handles large-scale operations smoothly', 'Better scheduling flexibility', 'Optimizes staff utilization'],
        industries: ['Home Renovation', 'Event Planning & Setup', 'Moving services', 'Corporate training']
      }
    },
    {
      id: 'serviceLocation',
      title: 'Choose Location',
      description: 'Let customers pick where the service happens — your place or theirs.',
      icon: MapPin,
      bgColor: 'bg-[#FFF0F4]',
      iconBg: 'bg-[#EE4E7A]',
      buttonColor: 'bg-[#FBC2D3] text-[#B5234F] hover:bg-[#F9AABF]',
      buttonActiveColor: 'bg-[#EE4E7A] text-white hover:bg-[#D33A66]',
      previewData: {
        works: 'Enables customers to choose between "Store Visit" or "Home Service" and inputs their address for dispatch.',
        benefits: ['Simplifies dispatch logistics', 'Expands service outreach', 'Customizes pricing based on travel distance'],
        industries: ['Acupuncture & Therapy', 'Home Repairs', 'Appliance Servicing', 'Personal training']
      }
    },
    {
      id: 'reschedule',
      title: 'Change Booking Date',
      description: 'Let customers move their booking to a different date or time.',
      icon: RefreshCw,
      bgColor: 'bg-[#F3E8FF]',
      iconBg: 'bg-[#A855F7]',
      buttonColor: 'bg-[#DFB8FC] text-[#7514C4] hover:bg-[#D0A0FA]',
      buttonActiveColor: 'bg-[#A855F7] text-white hover:bg-[#9130E8]',
      previewData: {
        works: 'Provides a self-serve rescheduling link in the customer portal or email, allowing slot changes without staff interaction.',
        benefits: ['Drastically cuts down customer support load', 'Improves customer booking convenience', 'Maintains reservation retention'],
        industries: ['Dental clinics', 'Driving lessons', 'Massage & Wellness', 'Yoga Classes']
      }
    },
    {
      id: 'minimumBookingNotice',
      title: 'Book in Advance',
      description: 'Set how early customers must book — e.g. at least 12 hours before.',
      icon: Clock,
      bgColor: 'bg-[#F0FDF4]',
      iconBg: 'bg-[#16A34A]',
      buttonColor: 'bg-[#BBF7D0] text-[#15803D] hover:bg-[#A7F3D0]',
      buttonActiveColor: 'bg-[#16A34A] text-white hover:bg-[#15803D]',
      previewData: {
        works: 'Enforces a lead time window (e.g. "Must book 12 hours in advance") so technicians have enough warning to prepare.',
        benefits: ['Avoids last-minute scheduling chaos', 'Gives time to purchase supplies', 'Improves service preparation quality'],
        industries: ['Catering services', 'Custom Cake baking', 'Deep Cleaning', 'Legal consultations']
      }
    },
    {
      id: 'customInstructions',
      title: 'Customer Notes',
      description: 'Let customers leave a message or special request when booking.',
      icon: HelpCircle,
      bgColor: 'bg-[#FFF5F5]',
      iconBg: 'bg-[#EF4444]',
      buttonColor: 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FCA5A5]',
      buttonActiveColor: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
      previewData: {
        works: 'Adds an optional text field during booking (e.g. "Gate code 4049, please watch out for the dog").',
        benefits: ['Gathers critical instructions upfront', 'Reduces arrival confusion', 'Ensures customer special requests are met'],
        industries: ['Pest Control', 'Plumbing', 'Electrical repair', 'Child care']
      }
    },
    {
      id: 'subscriptionBooking',
      title: 'Repeat Bookings',
      description: 'Let customers set up automatic weekly or monthly bookings.',
      icon: CalendarDays,
      bgColor: 'bg-[#F3F0FF]',
      iconBg: 'bg-[#5B32EA]',
      buttonColor: 'bg-[#D6CCF7] text-[#3A1DB5] hover:bg-[#C4B8F5]',
      buttonActiveColor: 'bg-[#5B32EA] text-white hover:bg-[#4A28C8]',
      previewData: {
        works: 'Customers subscribe once and have slots pre-booked on a recurring timeline (e.g. "Weekly Maid Service" or "Monthly Lawn Mowing").',
        benefits: ['Guarantees monthly recurring revenue (MRR)', 'Builds long-term customer loyalty', 'Locks in schedules in advance'],
        industries: ['Maid services', 'Lawn Maintenance', 'Grooming memberships', 'Pool Cleaning']
      }
    },
    {
      id: 'availabilityOverride',
      title: 'Set Your Hours',
      description: 'Change your available hours or block off holidays and days off.',
      icon: RefreshCw,
      bgColor: 'bg-[#FFF4EC]',
      iconBg: 'bg-[#F28B36]',
      buttonColor: 'bg-[#FDDBB8] text-[#B85F10] hover:bg-[#FBCDA0]',
      buttonActiveColor: 'bg-[#F28B36] text-white hover:bg-[#D9741F]',
      previewData: {
        works: 'Block slots or adjust working hours specifically for select dates (like holidays or seasonal peak times).',
        benefits: ['Simple calendar control', 'Enables easy holiday scheduling', 'Avoids customer overbooking mistakes'],
        industries: ['Therapy offices', 'Tutoring services', 'Medical clinics', 'Fitness studios']
      }
    },
    {
      id: 'customerSupportContact',
      title: 'Contact Info',
      description: 'Show your phone number or email so customers can reach you.',
      icon: Mail,
      bgColor: 'bg-[#EBFAED]',
      iconBg: 'bg-[#1FB165]',
      buttonColor: 'bg-[#B6EDBE] text-[#0D7A40] hover:bg-[#9EE5A8]',
      buttonActiveColor: 'bg-[#1FB165] text-white hover:bg-[#178A50]',
      previewData: {
        works: 'Pin specific hotlines or support emails onto the booking form or confirmation screens for rapid escalation.',
        benefits: ['Boosts user confidence', 'Provides clear escalation paths', 'Reduces chargebacks or disputes'],
        industries: ['High-value home installs', 'Elderly care bookings', 'Guided tour booking', 'Movers']
      }
    },
    {
      id: 'serviceReminders',
      title: 'Auto Reminders',
      description: 'Send customers a reminder before their appointment.',
      icon: CalendarDays,
      bgColor: 'bg-[#F3E8FF]',
      iconBg: 'bg-[#A855F7]',
      buttonColor: 'bg-[#DFB8FC] text-[#7514C4] hover:bg-[#D0A0FA]',
      buttonActiveColor: 'bg-[#A855F7] text-white hover:bg-[#9130E8]',
      previewData: {
        works: 'Pushes out automated slot alerts (e.g. 2 hours before the appointment) to reduce client forgetfulness.',
        benefits: ['Minimizes lock-out or waste-of-trip staff costs', 'Dramatically reduces late reschedules', 'Polishes customer service touchpoints'],
        industries: ['Appliance Repair', 'Medical appointments', 'Photography', 'Moving & hauling']
      }
    }
  ];

  const selectedPreview = previewFeature ? proFeatures.find(f => f.id === previewFeature) : null;

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 text-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-gray-50 border border-gray-150 rounded-xl hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5 text-gray-800" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
              Service Pro Features
            </h1>
          </div>
        </div>

        {/* Hero banner */}
        <div className="bg-[#5B32EA] rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-lg">
          <div className="flex-1 relative z-10 max-w-xl text-center sm:text-left text-white">
            <h3 className="text-[28px] font-bold mb-2 tracking-tight text-white">Supercharge Your Services</h3>
            <p className="text-[15px] text-white/90 mb-6 leading-relaxed font-medium">
              Unlock the full potential of your booking engine with custom slots, advance deposits, staff buffer times, and recurring subscriptions.
            </p>
            <button className="inline-block bg-white text-[#5B32EA] px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Enable All Features
            </button>
          </div>
          {/* Decorative background gradients */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute left-10 -bottom-32 w-80 h-80 bg-[#3a1a9e] blur-3xl rounded-full pointer-events-none"></div>
        </div>

        {/* Features grid - 16 Pro options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {proFeatures.map((feature) => {
            const isEnabled = toggles[feature.id as keyof typeof toggles];
            return (
              <div 
                key={feature.id} 
                className={`p-5 sm:p-6 rounded-3xl relative transition-transform hover:-translate-y-1 flex flex-col min-h-[230px] shadow-sm ${feature.bgColor}`}
              >
                <div className={`w-11 h-11 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-4 shrink-0`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 mb-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5 leading-snug">{feature.title}</h3>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{feature.description}</p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
                  <button 
                    onClick={() => setPreviewFeature(feature.id)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Know more
                  </button>
                  <button 
                    onClick={() => handleToggle(feature.id as keyof typeof toggles)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm ${
                      isEnabled 
                      ? feature.buttonActiveColor
                      : feature.buttonColor
                    }`}
                  >
                    {isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFeature && selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className={`p-6 sm:p-8 ${selectedPreview.bgColor} flex items-start justify-between relative`}>
              <div className="flex items-center gap-5 relative z-10">
                 <div className={`w-14 h-14 rounded-2xl ${selectedPreview.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                    <selectedPreview.icon className="w-7 h-7 text-white" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedPreview.title}</h2>
                   <p className="text-xs font-medium text-gray-600/80 leading-normal pr-4">{selectedPreview.description}</p>
                 </div>
              </div>
              <button 
                onClick={() => setPreviewFeature(null)} 
                className="p-2 bg-white/40 hover:bg-white rounded-full text-gray-700 transition relative z-10 shrink-0"
              >
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6 bg-white">
               <div>
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> How it works
                 </h4>
                 <p className="text-gray-800 font-medium leading-relaxed text-sm">{selectedPreview.previewData?.works}</p>
               </div>
               
               <div className="h-px w-full bg-gray-100"></div>
               
               <div>
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Key Benefits
                 </h4>
                 <ul className="space-y-2">
                   {selectedPreview.previewData?.benefits.map((b, i) => (
                     <li key={i} className="flex items-start gap-2.5 text-gray-800 font-medium text-sm">
                       <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center mt-0.5 shrink-0">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                       </div>
                       {b}
                     </li>
                   ))}
                 </ul>
               </div>
               
               <div className="h-px w-full bg-gray-100"></div>
               
               <div>
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Suitable Industries
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   {selectedPreview.previewData?.industries.map((ind, i) => (
                     <span key={i} className="px-3.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600">
                       {ind}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
            
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-[2rem]">
              <button 
                onClick={() => setPreviewFeature(null)} 
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-200 transition"
              >
                Close Preview
              </button>
              <button 
                onClick={() => {
                  handleToggle(selectedPreview.id as keyof typeof toggles);
                  setPreviewFeature(null);
                }} 
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition all shadow-sm ${
                  toggles[selectedPreview.id as keyof typeof toggles]
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : selectedPreview.buttonActiveColor
                }`}
              >
                {toggles[selectedPreview.id as keyof typeof toggles] ? 'Disable Feature' : 'Enable Feature Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
