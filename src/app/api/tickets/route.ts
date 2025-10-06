import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all service tickets
export async function GET(request: NextRequest) {
  try {
    const tickets = await prisma.serviceTicket.findMany({
      include: {
        property: true,
        driver: {
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
        route: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST create new service ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, driverId, routeId, priority, scheduledAt } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const ticket = await prisma.serviceTicket.create({
      data: {
        propertyId,
        driverId: driverId || null,
        routeId: routeId || null,
        priority: priority || 5,
        status: 'PENDING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        property: true,
        driver: {
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
        route: true,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
