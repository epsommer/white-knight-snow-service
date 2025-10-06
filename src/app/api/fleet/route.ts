import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all fleet vehicles
export async function GET(request: NextRequest) {
  try {
    const fleet = await prisma.fleet.findMany({
      include: {
        drivers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        routes: true,
      },
      orderBy: {
        vehicleNumber: 'asc',
      },
    });

    return NextResponse.json({ fleet }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fleet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fleet' },
      { status: 500 }
    );
  }
}

// POST create new fleet vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, vehicleType, capacity, gpsDeviceId } = body;

    if (!vehicleNumber || !vehicleType || !capacity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.fleet.create({
      data: {
        vehicleNumber,
        vehicleType,
        capacity: parseInt(capacity),
        gpsDeviceId,
        status: 'AVAILABLE',
        fuelLevel: 100,
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error('Error creating fleet vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create fleet vehicle' },
      { status: 500 }
    );
  }
}
