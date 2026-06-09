const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    address: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    date: {
      type: String, // Store as YYYY-MM-DD string for easy querying
      required: true,
    },
    punchIn: {
      time: {
        type: Date,
        default: null,
      },
      selfie: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
      location: {
        type: locationSchema,
        default: null,
      },
    },
    punchOut: {
      time: {
        type: Date,
        default: null,
      },
      selfie: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
      location: {
        type: locationSchema,
        default: null,
      },
    },
    totalWorkingHours: {
      type: Number, // in hours
      default: 0,
    },
    workingStatus: {
      type: String,
      enum: ['completed', 'incomplete', 'absent', 'on-leave'],
      default: 'incomplete',
    },
    validationStatus: {
      type: String,
      enum: ['pending', 'valid', 'invalid'],
      default: 'pending',
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    validatedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: null,
    },
    overtimeRequested: {
      type: Boolean,
      default: false,
    },
    overtimeRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OvertimeRequest',
      default: null,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    isPunchedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to prevent duplicate attendance records for same user on same day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ userId: 1 });
attendanceSchema.index({ validationStatus: 1 });
attendanceSchema.index({ workingStatus: 1 });

// Calculate working hours and status before saving (Mongoose 7+ style)
attendanceSchema.pre('save', function () {
  if (this.punchIn.time && this.punchOut.time) {
    const diffMs = this.punchOut.time - this.punchIn.time;
    const diffHours = diffMs / (1000 * 60 * 60);
    this.totalWorkingHours = Math.round(diffHours * 100) / 100;

    // Standard shift is 8 hours
    this.workingStatus =
      this.totalWorkingHours >= 8 ? 'completed' : 'incomplete';

    // Calculate overtime hours
    if (this.totalWorkingHours > 8) {
      this.overtimeHours = Math.round((this.totalWorkingHours - 8) * 100) / 100;
    }
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;