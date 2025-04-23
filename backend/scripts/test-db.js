require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://******:******@'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  });
