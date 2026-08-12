import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const servicesData = [
  {
    name: 'Home Cleaning',
    code: 'SRV-00048',
    description: 'Complete home cleaning service, including dusting, vacuuming, and kitchen cleaning.',
    price: 499.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '10:00 AM', endTime: '01:00 PM' },
      { startTime: '03:00 PM', endTime: '05:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 15,
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Cleaning', 'Home', 'Sanitize']),
    timeAvailabilityEnabled: true,
    startTime: '10:00 AM',
    endTime: '05:00 PM',
  },
  {
    name: 'Plumbing Service',
    code: 'SRV-00047',
    description: 'General plumbing and pipe repair, leak fixing, and tap replacements.',
    price: 399.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '09:00 AM', endTime: '01:00 PM' },
      { startTime: '04:00 PM', endTime: '07:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 10,
    coverImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Plumbing', 'Repair', 'Leak']),
    timeAvailabilityEnabled: true,
    startTime: '09:00 AM',
    endTime: '07:00 PM',
  },
  {
    name: 'Electrical Repair',
    code: 'SRV-00046',
    description: 'Electrical installation, wiring repair, socket installation, and diagnostics.',
    price: 449.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    slotAvailabilityEnabled: false,
    maxBookingEnabled: false,
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Electrical', 'Repair', 'Wiring']),
    timeAvailabilityEnabled: true,
    startTime: '09:00 AM',
    endTime: '06:00 PM',
  },
  {
    name: 'Appliance Repair',
    code: 'SRV-00045',
    description: 'Repair for washing machines, AC units, refrigerators, and other appliances.',
    price: 599.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '10:00 AM', endTime: '02:00 PM' },
      { startTime: '05:00 PM', endTime: '08:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 8,
    coverImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Appliance', 'AC', 'Fridge', 'Repair']),
    timeAvailabilityEnabled: true,
    startTime: '10:00 AM',
    endTime: '08:00 PM',
  },
  {
    name: 'Car Wash',
    code: 'SRV-00044',
    description: 'Exterior and interior deep car cleaning, vacuuming, and polish.',
    price: 299.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '08:00 AM', endTime: '12:00 PM' },
      { startTime: '02:00 PM', endTime: '06:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 20,
    coverImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Car', 'Wash', 'Clean']),
    timeAvailabilityEnabled: true,
    startTime: '08:00 AM',
    endTime: '06:00 PM',
  },
  {
    name: 'Salon & Spa',
    code: 'SRV-00043',
    description: 'Haircut, facial styling, massage, and complete grooming package.',
    price: 699.00,
    status: 'Inactive',
    visibility: true,
    availableDays: JSON.stringify(['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    slotAvailabilityEnabled: false,
    maxBookingEnabled: true,
    maxBookings: 12,
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Salon', 'Spa', 'Haircut', 'Grooming']),
    timeAvailabilityEnabled: true,
    startTime: '10:00 AM',
    endTime: '08:00 PM',
  },
  {
    name: 'Pest Control',
    code: 'SRV-00042',
    description: 'General pest control service, anti-termite, and mosquito fogging.',
    price: 799.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '09:00 AM', endTime: '01:00 PM' },
      { startTime: '03:00 PM', endTime: '06:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 15,
    coverImage: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Pest', 'Control', 'Sanitize']),
    timeAvailabilityEnabled: true,
    startTime: '09:00 AM',
    endTime: '06:00 PM',
  },
  {
    name: 'Painting Service',
    code: 'SRV-00041',
    description: 'Wall painting, color selection, and surface preparation for home/office.',
    price: 899.00,
    status: 'Inactive',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
    slotAvailabilityEnabled: false,
    maxBookingEnabled: false,
    coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Painting', 'Decor', 'Home']),
    timeAvailabilityEnabled: true,
    startTime: '08:30 AM',
    endTime: '05:30 PM',
  },
  {
    name: 'Carpentry Service',
    code: 'SRV-00040',
    description: 'Furniture repair, door installation, custom cabinet work, and wood restoration.',
    price: 349.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
    slotAvailabilityEnabled: true,
    slots: JSON.stringify([
      { startTime: '09:00 AM', endTime: '01:00 PM' },
      { startTime: '02:00 PM', endTime: '06:00 PM' }
    ]),
    maxBookingEnabled: true,
    maxBookings: 6,
    coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Carpentry', 'Furniture', 'Repair']),
    timeAvailabilityEnabled: true,
    startTime: '09:00 AM',
    endTime: '06:00 PM',
  },
  {
    name: 'Lawn & Garden Care',
    code: 'SRV-00039',
    description: 'Grass mowing, weed control, hedge trimming, and garden maintenance.',
    price: 249.00,
    status: 'Active',
    visibility: true,
    availableDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    slotAvailabilityEnabled: false,
    maxBookingEnabled: false,
    coverImage: 'https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=800&auto=format&fit=crop&q=60',
    tags: JSON.stringify(['Garden', 'Lawn', 'Outdoor']),
    timeAvailabilityEnabled: true,
    startTime: '08:00 AM',
    endTime: '05:00 PM',
  }
];

async function main() {
  console.log('Clearing old services...');
  await prisma.service.deleteMany({});
  
  console.log('Seeding new services...');
  for (const s of servicesData) {
    const created = await prisma.service.create({ data: s });
    console.log(`Created service: ${created.name} (${created.code})`);
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
