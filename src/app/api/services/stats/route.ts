import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { status: 'Active' } }),
      prisma.service.count({ where: { status: { in: ['Inactive', 'Draft'] } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        active,
        inactive
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
