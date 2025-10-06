import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET weather data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // Get latest weather data
    const weatherData = await prisma.weatherData.findFirst({
      orderBy: {
        recordedAt: 'desc',
      },
    });

    return NextResponse.json({ weather: weatherData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// POST create weather data entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      latitude,
      longitude,
      temperature,
      snowfall,
      windSpeed,
      visibility,
      forecast,
      radarImage,
    } = body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      temperature === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const weather = await prisma.weatherData.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        temperature: parseFloat(temperature),
        snowfall: snowfall ? parseFloat(snowfall) : 0,
        windSpeed: windSpeed ? parseFloat(windSpeed) : 0,
        visibility: visibility ? parseFloat(visibility) : 10,
        forecast: forecast || {},
        radarImage: radarImage || null,
        recordedAt: new Date(),
      },
    });

    return NextResponse.json({ weather }, { status: 201 });
  } catch (error) {
    console.error('Error creating weather data:', error);
    return NextResponse.json(
      { error: 'Failed to create weather data' },
      { status: 500 }
    );
  }
}
