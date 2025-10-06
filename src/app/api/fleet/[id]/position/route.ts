import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST update fleet position (for GPS tracking)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { latitude, longitude, driverId } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update driver position if driverId is provided
    if (driverId) {
      await prisma.driver.update({
        where: { id: driverId },
        data: {
          currentLat: parseFloat(latitude),
          currentLng: parseFloat(longitude),
          status: 'ON_ROUTE',
        },
      });

      // Emit socket event for real-time update
      // TODO: Import and use socket emitter
      // emitDriverPosition({
      //   driverId,
      //   latitude: parseFloat(latitude),
      //   longitude: parseFloat(longitude),
      //   status: 'ON_ROUTE',
      // });
    }

    return NextResponse.json(
      { message: 'Position updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json(
      { error: 'Failed to update position' },
      { status: 500 }
    );
  }
}
