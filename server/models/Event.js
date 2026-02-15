import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'Conference',
      'Workshop',
      'Seminar',
      'Meetup',
      'Concert',
      'Sports',
      'Networking',
      'Festival',      // <-- ADD THIS
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  availableSeats: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to set availableSeats equal to capacity initially
eventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
  next();
});

// Method to check if event has available seats
eventSchema.methods.hasAvailableSeats = function() {
  return this.availableSeats > 0;
};

const Event = mongoose.model('Event', eventSchema);
export default Event;