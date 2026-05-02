import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const DEFAULT_SEED_PASSWORD = 'Password@123';
const SALT_ROUNDS = 10;

const seedUsers = [
  { uid: 'admin-001', name: 'System Admin', role: 'ADMIN' },
  { uid: 'manager-001', name: 'An Nguyen', role: 'MANAGER' },
  { uid: 'manager-002', name: 'Binh Tran', role: 'MANAGER' },
  { uid: 'manager-003', name: 'Chi Le', role: 'MANAGER' },
  { uid: 'valet-001', name: 'Duc Vo', role: 'VALET' },
  { uid: 'valet-002', name: 'Hieu Pham', role: 'VALET' },
  { uid: 'valet-003', name: 'Khanh Hoang', role: 'VALET' },
  { uid: 'valet-004', name: 'Linh Bui', role: 'VALET' },
  { uid: 'customer-001', name: 'Minh Do', role: 'CUSTOMER' },
  { uid: 'customer-002', name: 'Nhi Truong', role: 'CUSTOMER' },
  { uid: 'customer-003', name: 'Phuc Dang', role: 'CUSTOMER' },
] as const;

const seedCompanyNames = [
  'AutoSpace Downtown',
  'AutoSpace Riverside',
  'AutoSpace Airport Hub',
] as const;

async function cleanupExistingSeedData() {
  const seedUserIds = seedUsers.map((item) => item.uid);
  const seedEmails = seedUsers.map((item) => `${item.uid}@autospace.dev`);
  const seedCompanies = await prisma.company.findMany({
    where: { displayName: { in: [...seedCompanyNames] } },
    select: { id: true },
  });
  const seedCompanyIds = seedCompanies.map((company) => company.id);
  const seedGarages = await prisma.garage.findMany({
    where: { companyId: { in: seedCompanyIds } },
    select: { id: true },
  });
  const seedGarageIds = seedGarages.map((garage) => garage.id);
  const seedSlots = await prisma.slot.findMany({
    where: { garageId: { in: seedGarageIds } },
    select: { id: true },
  });
  const seedSlotIds = seedSlots.map((slot) => slot.id);
  const seedBookings = await prisma.booking.findMany({
    where: {
      OR: [
        { slotId: { in: seedSlotIds } },
        { customerId: { in: seedUserIds } },
      ],
    },
    select: { id: true },
  });
  const seedBookingIds = seedBookings.map((booking) => booking.id);

  if (seedBookingIds.length > 0) {
    await prisma.bookingTimeline.deleteMany({
      where: { bookingId: { in: seedBookingIds } },
    });
    await prisma.valetAssignment.deleteMany({
      where: { bookingId: { in: seedBookingIds } },
    });
    await prisma.booking.deleteMany({ where: { id: { in: seedBookingIds } } });
  }

  if (seedGarageIds.length > 0) {
    await prisma.review.deleteMany({
      where: { garageId: { in: seedGarageIds } },
    });
    await prisma.slot.deleteMany({ where: { id: { in: seedSlotIds } } });
    await prisma.address.deleteMany({
      where: { garageId: { in: seedGarageIds } },
    });
    await prisma.verification.deleteMany({
      where: { garageId: { in: seedGarageIds } },
    });
    await prisma.garage.deleteMany({ where: { id: { in: seedGarageIds } } });
  }

  await prisma.manager.deleteMany({ where: { uid: { in: seedUserIds } } });
  await prisma.valet.deleteMany({ where: { uid: { in: seedUserIds } } });
  await prisma.admin.deleteMany({ where: { uid: { in: seedUserIds } } });
  await prisma.customer.deleteMany({ where: { uid: { in: seedUserIds } } });
  await prisma.company.deleteMany({ where: { id: { in: seedCompanyIds } } });
  await prisma.authProvider.deleteMany({ where: { uid: { in: seedUserIds } } });
  await prisma.credentials.deleteMany({
    where: {
      OR: [{ uid: { in: seedUserIds } }, { email: { in: seedEmails } }],
    },
  });
  await prisma.user.deleteMany({ where: { uid: { in: seedUserIds } } });
}

async function main() {
  await cleanupExistingSeedData();

  const users = await Promise.all(
    seedUsers.map((seedUser) =>
      prisma.user.create({ data: { uid: seedUser.uid, name: seedUser.name } }),
    ),
  );
  const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, SALT_ROUNDS);

  await prisma.credentials.createMany({
    data: users.map((user) => ({
      uid: user.uid,
      email: `${user.uid}@autospace.dev`,
      passwordHash: hashedPassword,
    })),
  });

  await prisma.authProvider.createMany({
    data: users.map((user) => ({ uid: user.uid, type: 'CREDENTIALS' })),
  });

  await prisma.admin.create({ data: { uid: 'admin-001' } });

  const companies = await prisma.company.createManyAndReturn({
    data: [
      {
        displayName: 'AutoSpace Downtown',
        description: 'Premium indoor parking in district 1',
      },
      {
        displayName: 'AutoSpace Riverside',
        description: 'Spacious parking lots near the riverfront',
      },
      {
        displayName: 'AutoSpace Airport Hub',
        description: 'Long-stay and valet-ready parking near airport',
      },
    ],
  });

  await prisma.manager.createMany({
    data: [
      {
        uid: 'manager-001',
        companyId: companies[0].id,
        displayName: 'An Nguyen',
      },
      {
        uid: 'manager-002',
        companyId: companies[1].id,
        displayName: 'Binh Tran',
      },
      { uid: 'manager-003', companyId: companies[2].id, displayName: 'Chi Le' },
    ],
  });

  await prisma.valet.createMany({
    data: [
      {
        uid: 'valet-001',
        companyId: companies[0].id,
        displayName: 'Duc Vo',
        licenceId: 'A1-001',
      },
      {
        uid: 'valet-002',
        companyId: companies[0].id,
        displayName: 'Hieu Pham',
        licenceId: 'A1-002',
      },
      {
        uid: 'valet-003',
        companyId: companies[1].id,
        displayName: 'Khanh Hoang',
        licenceId: 'B2-003',
      },
      {
        uid: 'valet-004',
        companyId: companies[2].id,
        displayName: 'Linh Bui',
        licenceId: 'C3-004',
      },
    ],
  });

  await prisma.customer.createMany({
    data: [
      { uid: 'customer-001', displayName: 'Minh Do' },
      { uid: 'customer-002', displayName: 'Nhi Truong' },
      { uid: 'customer-003', displayName: 'Phuc Dang' },
    ],
  });

  const garages = await prisma.garage.createManyAndReturn({
    data: [
      {
        displayName: 'Downtown A',
        description: 'Underground parking',
        images: [],
        companyId: companies[0].id,
      },
      {
        displayName: 'Downtown B',
        description: 'Mixed car and bike parking',
        images: [],
        companyId: companies[0].id,
      },
      {
        displayName: 'Riverside North',
        description: 'Open-air large lot',
        images: [],
        companyId: companies[1].id,
      },
      {
        displayName: 'Riverside South',
        description: 'Covered lot with EV support',
        images: [],
        companyId: companies[1].id,
      },
      {
        displayName: 'Airport Terminal 1',
        description: 'Short-term parking',
        images: [],
        companyId: companies[2].id,
      },
      {
        displayName: 'Airport Long Stay',
        description: 'Long-stay parking with shuttle',
        images: [],
        companyId: companies[2].id,
      },
    ],
  });

  await prisma.address.createMany({
    data: garages.map((garage, index) => ({
      garageId: garage.id,
      address: `${100 + index} Sample Street, Ho Chi Minh City`,
      lat: 10.75 + index * 0.005,
      lng: 106.67 + index * 0.005,
    })),
  });

  await prisma.verification.createMany({
    data: garages.map((garage, index) => ({
      garageId: garage.id,
      adminId: 'admin-001',
      verified: index % 2 === 0,
    })),
  });

  const slots = await prisma.slot.createManyAndReturn({
    data: garages.flatMap((garage, garageIndex) => [
      {
        garageId: garage.id,
        displayName: `CAR-${garageIndex + 1}-01`,
        pricePerHour: 2.5 + garageIndex,
        type: 'CAR',
        width: 250,
        length: 500,
        height: 220,
      },
      {
        garageId: garage.id,
        displayName: `BIKE-${garageIndex + 1}-01`,
        pricePerHour: 1.2 + garageIndex * 0.3,
        type: 'BIKE',
        width: 100,
        length: 220,
        height: 160,
      },
    ]),
  });

  const now = new Date();
  const bookingAStart = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const bookingAEnd = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const bookingBStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const bookingBEnd = new Date(now.getTime() + 28 * 60 * 60 * 1000);

  const bookingA = await prisma.booking.create({
    data: {
      slotId: slots[0].id,
      customerId: 'customer-001',
      startTime: bookingAStart,
      endTime: bookingAEnd,
      pricePerHour: slots[0].pricePerHour,
      totalPrice: (slots[0].pricePerHour ?? 0) * 3,
      vehicleNumber: '51H-12345',
      phoneNumber: '0900000001',
      passcode: '1111',
      status: 'VALET_ASSIGNED_FOR_CHECK_IN',
    },
  });

  const bookingB = await prisma.booking.create({
    data: {
      slotId: slots[4].id,
      customerId: 'customer-002',
      startTime: bookingBStart,
      endTime: bookingBEnd,
      pricePerHour: slots[4].pricePerHour,
      totalPrice: (slots[4].pricePerHour ?? 0) * 4,
      vehicleNumber: '59A-67890',
      phoneNumber: '0900000002',
      passcode: '2222',
      status: 'BOOKED',
    },
  });

  await prisma.valetAssignment.create({
    data: {
      bookingId: bookingA.id,
      pickupLat: 10.775,
      pickupLng: 106.7,
      returnLat: 10.776,
      returnLng: 106.701,
      pickupValetId: 'valet-001',
      returnValetId: 'valet-002',
    },
  });

  await prisma.bookingTimeline.createMany({
    data: [
      { bookingId: bookingA.id, status: 'BOOKED', managerId: 'manager-001' },
      {
        bookingId: bookingA.id,
        status: 'VALET_ASSIGNED_FOR_CHECK_IN',
        valetId: 'valet-001',
      },
      { bookingId: bookingB.id, status: 'BOOKED', managerId: 'manager-003' },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        customerId: 'customer-001',
        garageId: garages[0].id,
        rating: 5,
        comment: 'Clean garage, quick check-in.',
      },
      {
        customerId: 'customer-002',
        garageId: garages[2].id,
        rating: 4,
        comment: 'Good location and fair price.',
      },
      {
        customerId: 'customer-003',
        garageId: garages[5].id,
        rating: 5,
        comment: 'Great for long stay near airport.',
      },
    ],
  });

  console.log(
    `Seeded ${companies.length} companies, ${garages.length} garages, ${slots.length} slots.`,
  );
  console.log(`Seed account password (all users): ${DEFAULT_SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
