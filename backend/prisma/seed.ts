import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic sample data...');

  // Initialize App Settings
  const settings = [
    { key: 'service_charge_percentage', value: '10', description: 'The percentage of service charge applied to extra services.' },
    { key: 'hotel_name', value: 'Itahari Namuna Hotel', description: 'The name of the hotel.' }
  ];

  for (const setting of settings) {
    await prisma.appSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Clear existing data (in reverse dependency order to avoid foreign key constraints)
  console.log('Cleaning up existing data...');
  await prisma.bookingExtraService.deleteMany();
  await prisma.serviceOrderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingWorkflowLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.housekeepingLog.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.extraService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.facility.deleteMany();

  console.log('Creating Admin User...');
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@hotelpms.com',
      password: hashedAdminPassword,
      name: 'Super Admin',
      role: 'superadmin',
      isActive: true,
    }
  });

  console.log('Creating Service Categories & Facilities...');
  const fbCategory = await prisma.serviceCategory.create({
    data: { name: 'Food & Beverage', slug: 'food-beverage', description: 'In-room dining and mini-bar services' }
  });

  const transportCategory = await prisma.serviceCategory.create({
    data: { name: 'Transportation', slug: 'transportation', description: 'Airport shuttle and local transport' }
  });

  const wellnessCategory = await prisma.serviceCategory.create({
    data: { name: 'Wellness & Spa', slug: 'wellness', description: 'Massages and wellness therapies' }
  });

  await prisma.facility.create({
    data: { name: 'Oasis Pool', slug: 'oasis-pool', description: 'Temperature controlled outdoor swimming pool.', category: 'pool', openingHours: '06:00 - 22:00' }
  });

  await prisma.facility.create({
    data: { name: 'Namuna Grand Restaurant', slug: 'restaurant', description: 'Fine dining restaurant serving multi-cuisine dishes.', category: 'restaurant', openingHours: '07:00 - 23:00' }
  });

  console.log('Creating Extra Services...');
  await prisma.extraService.createMany({
    data: [
      { name: 'Airport Shuttle', description: 'One-way transfer to/from the airport', price: 25.00, categoryId: transportCategory.id, active: true },
      { name: 'Breakfast in Bed', description: 'Continental breakfast delivered to your room', price: 15.00, categoryId: fbCategory.id, active: true },
      { name: 'Swedish Massage (60 min)', description: 'Relaxing full-body massage', price: 80.00, categoryId: wellnessCategory.id, discountAllowed: true, discountPercentage: 10, active: true },
      { name: 'Extra Bed', description: 'Rollaway bed for an additional guest', price: 30.00, categoryId: fbCategory.id, active: true },
      { name: 'Laundry Service (Per Bag)', description: 'Wash and fold laundry service', price: 20.00, categoryId: fbCategory.id, active: true }
    ]
  });

  console.log('Creating Room Types and Rooms...');
  const deluxeType = await prisma.roomType.create({
    data: {
      name: 'Deluxe Suite',
      description: 'Spacious suite with city views and premium amenities.',
      image: '/images/deluxe.jpg',
    }
  });

  const standardType = await prisma.roomType.create({
    data: {
      name: 'Standard Room',
      description: 'Comfortable room perfect for short stays.',
      image: '/images/standard.jpg',
    }
  });

  const room101 = await prisma.room.create({
    data: { roomNumber: '101', slug: 'standard-room-101', name: 'Standard 101', roomTypeId: standardType.id, capacity: 2, basePrice: 50.00, floor: 1, bedType: 'double', status: 'available', isFeatured: true }
  });
  
  const room102 = await prisma.room.create({
    data: { roomNumber: '102', slug: 'standard-room-102', name: 'Standard 102', roomTypeId: standardType.id, capacity: 2, basePrice: 50.00, floor: 1, bedType: 'double', status: 'occupied' }
  });

  const room103 = await prisma.room.create({
    data: { roomNumber: '103', slug: 'standard-room-103', name: 'Standard 103', roomTypeId: standardType.id, capacity: 2, basePrice: 55.00, floor: 1, bedType: 'twin', status: 'available' }
  });

  const room201 = await prisma.room.create({
    data: { roomNumber: '201', slug: 'deluxe-suite-201', name: 'Deluxe 201', roomTypeId: deluxeType.id, capacity: 4, basePrice: 120.00, floor: 2, bedType: 'king', status: 'available', isFeatured: true }
  });

  const room202 = await prisma.room.create({
    data: { roomNumber: '202', slug: 'deluxe-suite-202', name: 'Deluxe 202', roomTypeId: deluxeType.id, capacity: 4, basePrice: 130.00, floor: 2, bedType: 'king', status: 'cleaning' }
  });

  const room203 = await prisma.room.create({
    data: { roomNumber: '203', slug: 'deluxe-suite-203', name: 'Deluxe 203', roomTypeId: deluxeType.id, capacity: 3, basePrice: 115.00, floor: 2, bedType: 'queen', status: 'available' }
  });

  console.log('Creating Housekeeping Staff...');
  await prisma.housekeepingStaff.createMany({
    data: [
      { staffId: 'HK-001', name: 'Ram Prasad', role: 'Housekeeper', phone: '9800000001', status: 'on_duty' },
      { staffId: 'HK-002', name: 'Sita Kumari', role: 'Housekeeper', phone: '9800000002', status: 'on_duty' },
      { staffId: 'HK-003', name: 'Hari Bahadur', role: 'Supervisor', phone: '9800000003', status: 'on_duty' },
      { staffId: 'HK-004', name: 'Gita Devi', role: 'Housekeeper', phone: '9800000004', status: 'off_duty' },
    ]
  });

  console.log('Creating Guests & Bookings...');
  const hashedGuestPassword = await bcrypt.hash('password123', 10);

  const guest1 = await prisma.guest.create({
    data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1234567890', city: 'New York', country: 'USA', isVerified: true, password: hashedGuestPassword }
  });
  
  const guest2 = await prisma.guest.create({
    data: { firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', phone: '+0987654321', city: 'London', country: 'UK', isVerified: true, password: hashedGuestPassword }
  });

  const guest3 = await prisma.guest.create({
    data: { firstName: 'Rajesh', lastName: 'Tharu', email: 'rajesh.tharu@example.com', phone: '+9779812345678', city: 'Itahari', country: 'Nepal', isVerified: true, password: hashedGuestPassword }
  });

  const today = new Date();
  const checkout = new Date();
  checkout.setDate(today.getDate() + 3);

  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BKG-1001',
      guestId: guest1.id,
      roomId: room102.id,
      checkIn: today,
      checkOut: checkout,
      totalAmount: 150.00,
      status: 'checked_in',
      source: 'direct'
    }
  });

  await prisma.payment.create({
    data: { bookingId: booking1.id, amount: 150.00, method: 'cash', status: 'completed' }
  });

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const checkout2 = new Date();
  checkout2.setDate(tomorrow.getDate() + 2);

  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BKG-1002',
      guestId: guest2.id,
      roomId: room201.id,
      checkIn: tomorrow,
      checkOut: checkout2,
      totalAmount: 240.00,
      status: 'confirmed',
      source: 'ota'
    }
  });

  // Past booking for reviews
  const pastCheckIn = new Date();
  pastCheckIn.setDate(today.getDate() - 10);
  const pastCheckOut = new Date();
  pastCheckOut.setDate(today.getDate() - 7);

  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: 'BKG-1003',
      guestId: guest3.id,
      roomId: room203.id,
      checkIn: pastCheckIn,
      checkOut: pastCheckOut,
      totalAmount: 345.00,
      status: 'checked_out',
      source: 'direct'
    }
  });

  await prisma.payment.create({
    data: { bookingId: booking3.id, amount: 345.00, method: 'esewa', status: 'completed' }
  });

  // Seed a review
  await prisma.review.create({
    data: {
      guestId: guest3.id,
      bookingId: booking3.id,
      roomTypeId: deluxeType.id,
      rating: 5,
      comment: 'Excellent stay! The room was spacious and clean. Staff was very friendly and helpful.',
      status: 'approved',
      isVerified: true,
    }
  });

  await prisma.review.create({
    data: {
      guestId: guest1.id,
      roomTypeId: standardType.id,
      rating: 4,
      comment: 'Good value for money. Clean rooms and great location. Will definitely come back!',
      status: 'approved',
      isVerified: true,
    }
  });

  console.log('✅ Database seeded with realistic sample data successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
