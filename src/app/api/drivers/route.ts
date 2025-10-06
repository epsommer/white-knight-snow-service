import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all drivers
export async function GET(request: NextRequest) {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fleet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ drivers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

// POST create new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, licenseNumber, phone, fleetId } = body;

    if (!userId || !licenseNumber || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.create({
      data: {
        userId,
        licenseNumber,
        phone,
        fleetId: fleetId || null,
        status: 'OFFLINE',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fleet: true,
      },
    });

    return NextResponse.json({ driver }, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}
