import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Role } from './models/User';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const seed = async () => {
  await connectDB();

  const roles = Object.values(Role);
  
  for (const role of roles) {
    const email = `${role.toLowerCase()}@lms.com`;
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({
        name: `${role} User`,
        email,
        passwordHash,
        role,
      });
      console.log(`Created user for role: ${role} (${email} / password123)`);
    } else {
      console.log(`User for role ${role} already exists.`);
    }
  }

  console.log('Seed completed successfully.');
  process.exit(0);
};

seed();
