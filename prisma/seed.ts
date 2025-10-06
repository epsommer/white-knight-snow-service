import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@whiteknight.com' },
    update: {},
    create: {
      email: 'admin@whiteknight.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create client users
  const clientPassword = await bcrypt.hash('client123', 10);
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const client = await prisma.user.upsert({
      where: { email: `client${i}@example.com` },
      update: {},
      create: {
        email: `client${i}@example.com`,
        name: `Client ${i}`,
        password: clientPassword,
        role: 'CLIENT',
      },
    });
    clients.push(client);
    console.log(`Created client user: ${client.email}`);
  }

  // Create driver users
  const driverPassword = await bcrypt.hash('driver123', 10);
  const drivers = [];
  for (let i = 1; i <= 3; i++) {
    const driverUser = await prisma.user.upsert({
      where: { email: `driver${i}@whiteknight.com` },
      update: {},
      create: {
        email: `driver${i}@whiteknight.com`,
        name: `Driver ${i}`,
        password: driverPassword,
        role: 'DRIVER',
      },
    });
    console.log(`Created driver user: ${driverUser.email}`);

    // Create driver profile
    const driver = await prisma.driver.upsert({
      where: { userId: driverUser.id },
      update: {},
      create: {
        userId: driverUser.id,
        licenseNumber: `DL-${10000 + i}`,
        phone: `555-010-${1000 + i}`,
        status: 'OFFLINE',
      },
    });
    drivers.push(driver);
    console.log(`Created driver profile for: ${driverUser.name}`);
  }

  // Create fleet vehicles
  const vehicleTypes = ['PLOW_TRUCK', 'SALT_SPREADER', 'PICKUP'];
  const fleet = [];
  for (let i = 0; i < 3; i++) {
    const vehicle = await prisma.fleet.upsert({
      where: { vehicleNumber: `WK-${100 + i}` },
      update: {},
      create: {
        vehicleNumber: `WK-${100 + i}`,
        vehicleType: vehicleTypes[i] as any,
        capacity: 1000 + i * 500,
        fuelLevel: 100,
        status: 'AVAILABLE',
        gpsDeviceId: `GPS-${100 + i}`,
      },
    });
    fleet.push(vehicle);
    console.log(`Created fleet vehicle: ${vehicle.vehicleNumber}`);

    // Assign driver to vehicle
    if (drivers[i]) {
      await prisma.driver.update({
        where: { id: drivers[i].id },
        data: { fleetId: vehicle.id },
      });
      console.log(`Assigned driver to vehicle ${vehicle.vehicleNumber}`);
    }
  }

  // Create properties (clustered around NYC)
  const baseLatitude = 40.7128;
  const baseLongitude = -74.006;
  const properties = [];

  const addresses = [
    '123 Main St, New York, NY 10001',
    '456 Oak Ave, New York, NY 10002',
    '789 Pine Rd, New York, NY 10003',
    '321 Elm St, New York, NY 10004',
    '654 Maple Dr, New York, NY 10005',
    '987 Cedar Ln, New York, NY 10006',
    '147 Birch Way, New York, NY 10007',
    '258 Spruce Ct, New York, NY 10008',
    '369 Willow Ave, New York, NY 10009',
    '741 Ash Blvd, New York, NY 10010',
    '852 Poplar St, New York, NY 10011',
    '963 Hickory Rd, New York, NY 10012',
    '159 Walnut Dr, New York, NY 10013',
    '357 Chestnut Ln, New York, NY 10014',
    '486 Sycamore Way, New York, NY 10015',
    '753 Magnolia Ct, New York, NY 10016',
    '951 Dogwood Ave, New York, NY 10017',
    '842 Redwood St, New York, NY 10018',
    '264 Sequoia Rd, New York, NY 10019',
    '573 Cypress Dr, New York, NY 10020',
  ];

  const statuses = ['PENDING', 'PENDING', 'PENDING', 'IN_PROGRESS', 'CLEARED'];

  for (let i = 0; i < addresses.length; i++) {
    const clientIndex = i % clients.length;
    const lat = baseLatitude + (Math.random() - 0.5) * 0.05;
    const lng = baseLongitude + (Math.random() - 0.5) * 0.05;
    const snowDepth = Math.random() * 10;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const property = await prisma.property.create({
      data: {
        address: addresses[i],
        latitude: lat,
        longitude: lng,
        userId: clients[clientIndex].id,
        snowDepth,
        status: status as any,
        priority: Math.floor(Math.random() * 10) + 1,
      },
    });
    properties.push(property);
    console.log(`Created property: ${property.address}`);
  }

  // Create sample weather data
  const weather = await prisma.weatherData.create({
    data: {
      latitude: baseLatitude,
      longitude: baseLongitude,
      temperature: 25,
      snowfall: 6.5,
      windSpeed: 15,
      visibility: 0.5,
      forecast: {
        hourly: [
          { time: '2024-01-15T00:00:00Z', temp: 25, snowfall: 2 },
          { time: '2024-01-15T03:00:00Z', temp: 23, snowfall: 3 },
          { time: '2024-01-15T06:00:00Z', temp: 20, snowfall: 1.5 },
        ],
      },
      recordedAt: new Date(),
    },
  });
  console.log('Created weather data');

  // Create sample service tickets
  for (let i = 0; i < 10; i++) {
    const ticket = await prisma.serviceTicket.create({
      data: {
        propertyId: properties[i].id,
        driverId: i < 3 ? drivers[i].id : null,
        status: properties[i].status === 'PENDING' ? 'PENDING' : properties[i].status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'COMPLETED',
        priority: properties[i].priority,
        scheduledAt: new Date(Date.now() + Math.random() * 86400000),
      },
    });
    console.log(`Created service ticket for property: ${properties[i].address}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
