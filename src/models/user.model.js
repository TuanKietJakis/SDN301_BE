// Load required dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const {paginate} = require("./plugins");
const {coreHelper} = require("../helpers");

// Define user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: false,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // User role can be 'user' or 'admin'
    default: 'user' // Default role is 'user'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, transform: (_, ret) => {
      delete ret._id;
    }
  }
});


// Hash user password before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      user.password = coreHelper.hashString(user.password);
    } catch (error) {
      next(error);  // Pass any errors to the next middleware
    }
  }
  next(); // Continue to the next middleware
});

// Add paginate plugin
userSchema.plugin(paginate);

// Initiate User model
const User = mongoose.model("User", userSchema);

module.exports = User;
