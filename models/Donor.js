const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Converts to lowercase before saving
    trim: true
  }
  
  
});


// Hash password before saving
donorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash if the password is modified

  try {
    const salt = await bcrypt.genSalt(10);  // Create a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
  } catch (error) {
    next(error);  // If any error occurs, pass it to the next handler
  }
});

module.exports = mongoose.model('Donor', donorSchema);
