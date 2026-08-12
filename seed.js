const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dummyServices = [
  {
    name: 'Deep Home Cleaning',
    code: 'SRV-CLEAN-01',
    description: 'Comprehensive deep cleaning for your entire home, including hard-to-reach areas.',
    price: 150.00,
    salePrice: 120.00,
    duration: '4 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80']),
    tags: JSON.stringify(['Cleaning', 'Home']),
  },
  {
    name: 'AC Repair & Maintenance',
    code: 'SRV-AC-01',
    description: 'Expert AC repair and maintenance to keep your home cool and comfortable.',
    price: 80.00,
    duration: '2 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80']),
    tags: JSON.stringify(['Repair', 'AC']),
  },
  {
    name: 'Professional Photography',
    code: 'SRV-PHOTO-01',
    description: 'Capture your special moments with our professional photography service.',
    price: 300.00,
    duration: '3 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80']),
    tags: JSON.stringify(['Photography', 'Events']),
  },
  {
    name: 'Plumbing Repair',
    code: 'SRV-PLUMB-01',
    description: 'Fast and reliable plumbing repair services for leaks and blockages.',
    price: 90.00,
    duration: '1 hr',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1607472586893-edb57cb31322?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1607472586893-edb57cb31322?w=800&q=80']),
    tags: JSON.stringify(['Repair', 'Plumbing']),
  },
  {
    name: 'Personal Fitness Training',
    code: 'SRV-FIT-01',
    description: '1-on-1 personal fitness training sessions tailored to your goals.',
    price: 60.00,
    duration: '1 hr',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80']),
    tags: JSON.stringify(['Fitness', 'Health']),
  },
  {
    name: 'Interior Painting',
    code: 'SRV-PAINT-01',
    description: 'Transform your home with our professional interior painting services.',
    price: 500.00,
    duration: '8 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80']),
    tags: JSON.stringify(['Painting', 'Home']),
  },
  {
    name: 'Dog Grooming',
    code: 'SRV-PET-01',
    description: 'Full-service dog grooming including wash, haircut, and nail trimming.',
    price: 70.00,
    duration: '2 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80']),
    tags: JSON.stringify(['Pets', 'Grooming']),
  },
  {
    name: 'Carpet Cleaning',
    code: 'SRV-CARPET-01',
    description: 'Deep carpet cleaning to remove stubborn stains and odors.',
    price: 120.00,
    duration: '3 hrs',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1558556405-30717447e711?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1558556405-30717447e711?w=800&q=80']),
    tags: JSON.stringify(['Cleaning', 'Home']),
  },
  {
    name: 'Website Development',
    code: 'SRV-WEB-01',
    description: 'Custom website development for your business.',
    price: 1500.00,
    duration: '10 Days',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80']),
    tags: JSON.stringify(['Tech', 'Development']),
  },
  {
    name: 'Lawn Mowing & Care',
    code: 'SRV-LAWN-01',
    description: 'Keep your garden beautiful with our regular lawn mowing and care.',
    price: 45.00,
    duration: '1 hr',
    status: 'Active',
    visibility: true,
    coverImage: 'https://images.unsplash.com/photo-1592424001807-628d689b96eb?w=800&q=80',
    images: JSON.stringify(['https://images.unsplash.com/photo-1592424001807-628d689b96eb?w=800&q=80']),
    tags: JSON.stringify(['Garden', 'Home']),
  }
];

async function main() {
  for (const srv of dummyServices) {
    await prisma.service.create({
      data: srv
    });
  }
  console.log("Successfully seeded 10 services!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
