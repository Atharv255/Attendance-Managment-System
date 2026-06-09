const mongoose = require('mongoose');

const overtimeRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: [true, 'Attendance ID is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    requestedHours: {
      type: Number,
      required: [true, 'Requested overtime hours are required'],
      min: [0.5, 'Minimum overtime is 30 minutes'],
      max: [6, 'Maximum overtime is 6 hours'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for overtime is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewRemarks: {
      type: String,
      trim: true,
      default: null,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
overtimeRequestSchema.index({ userId: 1 });
overtimeRequestSchema.index({ status: 1 });
overtimeRequestSchema.index({ managerId: 1 });
overtimeRequestSchema.index({ date: 1 });

const OvertimeRequest = mongoose.model('OvertimeRequest', overtimeRequestSchema);

module.exports = OvertimeRequest;