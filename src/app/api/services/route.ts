import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    }
    if (status) {
      if (status.includes(',')) {
        where.status = { in: status.split(',') };
      } else {
        where.status = status;
      }
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        services,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const service = await prisma.service.create({
      data: {
        name: data.name || 'Untitled Service',
        code: data.code || null,
        tags: data.tags ? (typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags)) : '[]',
        duration: data.duration || null,
        price: parseFloat(data.price) || 0,
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        includeTax: data.includeTax !== undefined ? data.includeTax : false,
        taxPercentage: data.taxPercentage ? parseFloat(data.taxPercentage) : null,
        availableDays: data.availableDays ? (typeof data.availableDays === 'string' ? data.availableDays : JSON.stringify(data.availableDays)) : '[]',
        
        timeAvailabilityEnabled: data.timeAvailabilityEnabled !== undefined ? data.timeAvailabilityEnabled : false,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        
        slotAvailabilityEnabled: data.slotAvailabilityEnabled !== undefined ? data.slotAvailabilityEnabled : false,
        slots: data.slots ? (typeof data.slots === 'string' ? data.slots : JSON.stringify(data.slots)) : '[]',
        
        maxBookingEnabled: data.maxBookingEnabled !== undefined ? data.maxBookingEnabled : false,
        maxBookings: parseInt(data.maxBookings) || 10,
        
        reviewsEnabled: data.reviewsEnabled !== undefined ? data.reviewsEnabled : true,
        
        description: data.description || null,
        coverImage: data.coverImage || null,
        images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : '[]',
        status: data.status || 'Draft',
        visibility: data.visibility !== undefined ? data.visibility : true,
        relatedServiceIds: data.relatedServiceIds ? (typeof data.relatedServiceIds === 'string' ? data.relatedServiceIds : JSON.stringify(data.relatedServiceIds)) : '[]',

        // Pro Features (Advanced Options)
        advancePaymentEnabled: data.advancePaymentEnabled !== undefined ? data.advancePaymentEnabled : false,
        advanceAmount: data.advanceAmount ? parseFloat(data.advanceAmount) : null,
        
        addOnsEnabled: data.addOnsEnabled !== undefined ? data.addOnsEnabled : false,
        addOns: data.addOns ? (typeof data.addOns === 'string' ? data.addOns : JSON.stringify(data.addOns)) : '[]',
        
        timeBufferEnabled: data.timeBufferEnabled !== undefined ? data.timeBufferEnabled : false,
        timeBuffer: data.timeBuffer ? parseInt(data.timeBuffer) : null,
        
        multipleProvidersEnabled: data.multipleProvidersEnabled !== undefined ? data.multipleProvidersEnabled : false,
        providersCount: parseInt(data.providersCount) || 1,
        
        serviceLocationEnabled: data.serviceLocationEnabled !== undefined ? data.serviceLocationEnabled : false,
        allowedLocations: data.allowedLocations || null,
        
        cancellationPolicyEnabled: data.cancellationPolicyEnabled !== undefined ? data.cancellationPolicyEnabled : false,
        cancellationCharges: data.cancellationCharges ? parseFloat(data.cancellationCharges) : null,
        
        rescheduleEnabled: data.rescheduleEnabled !== undefined ? data.rescheduleEnabled : false,
        
        minimumBookingNoticeEnabled: data.minimumBookingNoticeEnabled !== undefined ? data.minimumBookingNoticeEnabled : false,
        minimumNoticeHours: parseInt(data.minimumNoticeHours) || 24,
        
        customInstructionsEnabled: data.customInstructionsEnabled !== undefined ? data.customInstructionsEnabled : false,
        customInstructions: data.customInstructions || null,
        
        subscriptionBookingEnabled: data.subscriptionBookingEnabled !== undefined ? data.subscriptionBookingEnabled : false,
        subscriptionCycles: data.subscriptionCycles || null,
        
        availabilityOverrideEnabled: data.availabilityOverrideEnabled !== undefined ? data.availabilityOverrideEnabled : false,
        availabilityOverrides: data.availabilityOverrides ? (typeof data.availabilityOverrides === 'string' ? data.availabilityOverrides : JSON.stringify(data.availabilityOverrides)) : '[]',
        
        autoAssignProviderEnabled: data.autoAssignProviderEnabled !== undefined ? data.autoAssignProviderEnabled : false,
        
        customerSupportEnabled: data.customerSupportEnabled !== undefined ? data.customerSupportEnabled : false,
        supportContact: data.supportContact || null,
        
        taxAndChargesEnabled: data.taxAndChargesEnabled !== undefined ? data.taxAndChargesEnabled : false,
        taxRules: data.taxRules || null,
        
        serviceRemindersEnabled: data.serviceRemindersEnabled !== undefined ? data.serviceRemindersEnabled : false,
        reminderTemplates: data.reminderTemplates || null,
      }
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
