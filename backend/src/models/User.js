const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['employee', 'manager', 'admin'],
        message: 'Role must be employee, manager, or admin',
      },
      default: 'employee',
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
userSchema.index({ role: 1 });
userSchema.index({ managerId: 1 });

// Hash password and generate employee ID before saving (Mongoose 7+ style)
userSchema.pre('save', async function () {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate employee ID for new users
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('User').countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for team members (for managers)
userSchema.virtual('teamMembers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'managerId',
});

const User = mongoose.model('User', userSchema);

module.exports = User;