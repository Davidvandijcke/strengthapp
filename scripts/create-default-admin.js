const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import your User model
const User = require('../models/User');

// Connect to your MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/strength_app';

async function createDefaultAdmin() {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Define default admin credentials
    const defaultAdmin = {
      username: 'david',
      email: 'david@example.com',
      password: 'davidioooooo', // You MUST change this after first login
    };
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: defaultAdmin.email });
    
    if (existingUser) {
      console.log('Default admin user already exists');
      await mongoose.disconnect();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);
    
    // Create user
    const user = new User({
      username: defaultAdmin.username,
      email: defaultAdmin.email,
      password: hashedPassword,
    });
    
    await user.save();
    console.log('Default admin user created successfully');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    console.log('\n---------- IMPORTANT ----------');
    console.log('Default admin account created with:');
    console.log(`Email: ${defaultAdmin.email}`);
    console.log(`Password: ${defaultAdmin.password}`);
    console.log('Please change this password immediately after first login!');
    console.log('-------------------------------\n');
    
  } catch (error) {
    console.error('Error creating default admin:', error);
    process.exit(1);
  }
}

createDefaultAdmin();