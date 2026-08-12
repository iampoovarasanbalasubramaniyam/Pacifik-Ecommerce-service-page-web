import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { message: 'Service not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const data = await request.json();
    
    // Update service
    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        code: data.code !== undefined ? data.code : undefined,
        tags: data.tags !== undefined ? (typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags)) : undefined,
        duration: data.duration !== undefined ? data.duration : undefined,
        price: data.price !== undefined ? (parseFloat(data.price) || 0) : undefined,
        salePrice: data.salePrice !== undefined ? (data.salePrice ? parseFloat(data.salePrice) : null) : undefined,
        includeTax: data.includeTax !== undefined ? data.includeTax : undefined,
        taxPercentage: data.taxPercentage !== undefined ? (data.taxPercentage ? parseFloat(data.taxPercentage) : null) : undefined,
        availableDays: data.availableDays !== undefined ? (typeof data.availableDays === 'string' ? data.availableDays : JSON.stringify(data.availableDays)) : undefined,
        
        timeAvailabilityEnabled: data.timeAvailabilityEnabled !== undefined ? data.timeAvailabilityEnabled : undefined,
        startTime: data.startTime !== undefined ? data.startTime : undefined,
        endTime: data.endTime !== undefined ? data.endTime : undefined,
        
        slotAvailabilityEnabled: data.slotAvailabilityEnabled !== undefined ? data.slotAvailabilityEnabled : undefined,
        slots: data.slots !== undefined ? (typeof data.slots === 'string' ? data.slots : JSON.stringify(data.slots)) : undefined,
        
        maxBookingEnabled: data.maxBookingEnabled !== undefined ? data.maxBookingEnabled : undefined,
        maxBookings: data.maxBookings !== undefined ? (parseInt(data.maxBookings) || 10) : undefined,
        
        reviewsEnabled: data.reviewsEnabled !== undefined ? data.reviewsEnabled : undefined,
        
        description: data.description !== undefined ? data.description : undefined,
        coverImage: data.coverImage !== undefined ? data.coverImage : undefined,
        images: data.images !== undefined ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        visibility: data.visibility !== undefined ? data.visibility : undefined,
        relatedServiceIds: data.relatedServiceIds !== undefined ? (typeof data.relatedServiceIds === 'string' ? data.relatedServiceIds : JSON.stringify(data.relatedServiceIds)) : undefined,

        // Pro Features (Advanced Options)
        advancePaymentEnabled: data.advancePaymentEnabled !== undefined ? data.advancePaymentEnabled : undefined,
        advanceAmount: data.advanceAmount !== undefined ? (data.advanceAmount ? parseFloat(data.advanceAmount) : null) : undefined,
        
        addOnsEnabled: data.addOnsEnabled !== undefined ? data.addOnsEnabled : undefined,
        addOns: data.addOns !== undefined ? (typeof data.addOns === 'string' ? data.addOns : JSON.stringify(data.addOns)) : undefined,
        
        timeBufferEnabled: data.timeBufferEnabled !== undefined ? data.timeBufferEnabled : undefined,
        timeBuffer: data.timeBuffer !== undefined ? (data.timeBuffer ? parseInt(data.timeBuffer) : null) : undefined,
        
        multipleProvidersEnabled: data.multipleProvidersEnabled !== undefined ? data.multipleProvidersEnabled : undefined,
        providersCount: data.providersCount !== undefined ? (parseInt(data.providersCount) || 1) : undefined,
        
        serviceLocationEnabled: data.serviceLocationEnabled !== undefined ? data.serviceLocationEnabled : undefined,
        allowedLocations: data.allowedLocations !== undefined ? data.allowedLocations : undefined,
        
        cancellationPolicyEnabled: data.cancellationPolicyEnabled !== undefined ? data.cancellationPolicyEnabled : undefined,
        cancellationCharges: data.cancellationCharges !== undefined ? (data.cancellationCharges ? parseFloat(data.cancellationCharges) : null) : undefined,
        
        rescheduleEnabled: data.rescheduleEnabled !== undefined ? data.rescheduleEnabled : undefined,
        
        minimumBookingNoticeEnabled: data.minimumBookingNoticeEnabled !== undefined ? data.minimumBookingNoticeEnabled : undefined,
        minimumNoticeHours: data.minimumNoticeHours !== undefined ? (parseInt(data.minimumNoticeHours) || 24) : undefined,
        
        customInstructionsEnabled: data.customInstructionsEnabled !== undefined ? data.customInstructionsEnabled : undefined,
        customInstructions: data.customInstructions !== undefined ? data.customInstructions : undefined,
        
        subscriptionBookingEnabled: data.subscriptionBookingEnabled !== undefined ? data.subscriptionBookingEnabled : undefined,
        subscriptionCycles: data.subscriptionCycles !== undefined ? data.subscriptionCycles : undefined,
        
        availabilityOverrideEnabled: data.availabilityOverrideEnabled !== undefined ? data.availabilityOverrideEnabled : undefined,
        availabilityOverrides: data.availabilityOverrides !== undefined ? (typeof data.availabilityOverrides === 'string' ? data.availabilityOverrides : JSON.stringify(data.availabilityOverrides)) : undefined,
        
        autoAssignProviderEnabled: data.autoAssignProviderEnabled !== undefined ? data.autoAssignProviderEnabled : undefined,
        
        customerSupportEnabled: data.customerSupportEnabled !== undefined ? data.customerSupportEnabled : undefined,
        supportContact: data.supportContact !== undefined ? data.supportContact : undefined,
        
        taxAndChargesEnabled: data.taxAndChargesEnabled !== undefined ? data.taxAndChargesEnabled : undefined,
        taxRules: data.taxRules !== undefined ? data.taxRules : undefined,
        
        serviceRemindersEnabled: data.serviceRemindersEnabled !== undefined ? data.serviceRemindersEnabled : undefined,
        reminderTemplates: data.reminderTemplates !== undefined ? data.reminderTemplates : undefined,
      }
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.service.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
