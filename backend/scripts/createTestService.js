const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');

dotenv.config();

const createTestService = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const testService = new Service({
      title: 'Water Connection',
      description: 'Request a new water connection for your property',
      department: 'Water Department',
      availability: true
    });

    await testService.save();
    console.log('Test service created:', testService);

    const services = await Service.find();
    console.log('All services:', services);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestService();
