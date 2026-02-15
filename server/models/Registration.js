import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'attended'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Ensure a user can only register once for an event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Prevent registration if event is full (this will be handled in controller)

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;