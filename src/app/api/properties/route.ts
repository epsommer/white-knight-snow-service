import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all properties
export async function GET(request: NextRequest) {
  try {
    const properties = await prisma.property.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, latitude, longitude, userId, snowDepth, priority } = body;

    if (!address || !latitude || !longitude || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        snowDepth: snowDepth ? parseFloat(snowDepth) : 0,
        priority: priority || 5,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
