import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const users = [
  {
    email: 'admin@hironix.com',
    firstName: 'System',
    lastName: 'Admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    email: 'user@hironix.com',
    firstName: 'Test',
    lastName: 'Employee',
    password: 'user123',
    role: 'employee',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.trim().replace(/[\r\n\t]/g, '');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('[Seed] Cleared existing users');

    // Insert seeds
    await User.create(users);
    console.log('[Seed] Users seeded successfully!');
    
    console.log('\n--- Test Credentials ---');
    console.log('Admin: admin@hironix.com / admin123');
    console.log('User : user@hironix.com / user123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error.message);
    process.exit(1);
  }
};

seedDB();
