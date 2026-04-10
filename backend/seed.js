require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Shuttle = require('./models/Shuttle');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Shuttle.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin VIT Shuttle',
      email: 'admin@vit.ac.in',
      password: 'Admin@1234',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    console.log('👤 Admin created:', admin.email);

    // Create test student
    const student = await User.create({
      name: 'Alok Maan',
      email: 'alok.maan@vitstudent.ac.in',
      password: 'Student@1234',
      role: 'student',
      regNo: '22BCE1234',
      phone: '9812897289',
      department: 'Computer Science Engineering',
      year: 2,
      hostel: 'Men\'s Hostel Block A',
      isVerified: true,
      isActive: true
    });
    console.log('👨‍🎓 Student created:', student.email);

    // Create Shuttles
    const shuttles = [
      {
        busId: 'VIT-BUS-01',
        name: 'Route Alpha Bus',
        route: {
          name: 'Route Alpha',
          code: 'α',
          color: '#1d72c8',
          stops: [
            { name: 'Main Gate', lat: 12.9697, lng: 79.1553, order: 1 },
            { name: 'SJT Block',  lat: 12.9716, lng: 79.1589, order: 2 },
            { name: 'TT Complex', lat: 12.9730, lng: 79.1610, order: 3 }
          ]
        },
        driver: { name: 'Ravi Kumar', phone: '9876543210' },
        capacity: 40, currentOccupancy: 26, status: 'active',
        location: { lat: 12.9706, lng: 79.1570 },
        speed: 22, eta: 4
      },
      {
        busId: 'VIT-BUS-07',
        name: 'Route Bravo Bus',
        route: {
          name: 'Route Bravo',
          code: 'β',
          color: '#1a9a4e',
          stops: [
            { name: 'Men\'s Hostel', lat: 12.9680, lng: 79.1540, order: 1 },
            { name: 'SJT Block',    lat: 12.9716, lng: 79.1589, order: 2 },
            { name: 'Ladies Hostel', lat: 12.9745, lng: 79.1620, order: 3 }
          ]
        },
        driver: { name: 'Suresh S', phone: '9876543211' },
        capacity: 40, currentOccupancy: 32, status: 'active',
        location: { lat: 12.9700, lng: 79.1565 },
        speed: 18, eta: 7
      },
      {
        busId: 'VIT-BUS-12',
        name: 'Route Charlie Bus',
        route: {
          name: 'Route Charlie',
          code: 'γ',
          color: '#6d4fd6',
          stops: [
            { name: 'PRP Block', lat: 12.9725, lng: 79.1555, order: 1 },
            { name: 'Foodys',    lat: 12.9710, lng: 79.1575, order: 2 },
            { name: 'Annex',     lat: 12.9695, lng: 79.1600, order: 3 }
          ]
        },
        driver: { name: 'Muthu R', phone: '9876543212' },
        capacity: 35, currentOccupancy: 16, status: 'active',
        location: { lat: 12.9715, lng: 79.1572 },
        speed: 25, eta: 3
      },
      {
        busId: 'VIT-BUS-04',
        name: 'Route Delta Bus',
        route: {
          name: 'Route Delta',
          code: 'δ',
          color: '#d97706',
          stops: [
            { name: 'Outdoor Stadium', lat: 12.9685, lng: 79.1545, order: 1 },
            { name: 'Indoor Stadium',  lat: 12.9700, lng: 79.1560, order: 2 },
            { name: 'Admin Block',     lat: 12.9720, lng: 79.1595, order: 3 }
          ]
        },
        driver: { name: 'Anand P', phone: '9876543213' },
        capacity: 40, currentOccupancy: 12, status: 'active',
        location: { lat: 12.9692, lng: 79.1552 },
        speed: 15, eta: 5
      },
      {
        busId: 'VIT-BUS-09',
        name: 'Reserve Bus',
        route: { name: 'Route Echo', code: 'ε', color: '#dc2626', stops: [] },
        driver: { name: 'Karthik M', phone: '9876543214' },
        capacity: 45, currentOccupancy: 0, status: 'idle',
        location: { lat: 12.9720, lng: 79.1580 },
        speed: 0, eta: 0
      }
    ];

    await Shuttle.insertMany(shuttles);
    console.log(`🚌 ${shuttles.length} shuttles seeded`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin:   admin@vit.ac.in / Admin@1234');
    console.log('  Student: alok.maan@vitstudent.ac.in / Student@1234\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
