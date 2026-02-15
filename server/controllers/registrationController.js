import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event has available seats
    if (!event.hasAvailableSeats()) {
      return res.status(400).json({
        success: false,
        message: 'No available seats for this event'
      });
    }

    // Check if user has ANY existing registration (confirmed or cancelled)
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      // If it's cancelled, we can reactivate it
      if (existingRegistration.status === 'cancelled') {
        existingRegistration.status = 'confirmed';
        await existingRegistration.save();
        
        // Decrease available seats
        event.availableSeats -= 1;
        await event.save();

        await existingRegistration.populate({
          path: 'event',
          select: 'name date location image capacity availableSeats'
        });

        return res.status(200).json({
          success: true,
          message: 'Successfully re-registered for event',
          registration: existingRegistration
        });
      }
      
      // If it's confirmed, they're already registered
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Create new registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
      status: 'confirmed'
    });

    // Decrease available seats
    event.availableSeats -= 1;
    await event.save();

    // Populate event details
    await registration.populate({
      path: 'event',
      select: 'name date location image capacity availableSeats'
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error(error);
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering for event'
    });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:eventId
// @access  Private
export const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find registration
    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: 'confirmed'  // Only cancel if it's confirmed
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No active registration found'
      });
    }

    // Update registration status
    registration.status = 'cancelled';
    await registration.save();

    // Increase available seats
    const event = await Event.findById(eventId);
    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling registration'
    });
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/my-registrations
// @access  Private
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only get confirmed registrations (not cancelled)
    const registrations = await Registration.find({
      user: userId,
      status: 'confirmed'  // Only show confirmed registrations
    })
      .populate({
        path: 'event',
        select: 'name date location image capacity availableSeats description organizer category'
      })
      .sort({ createdAt: -1 });

    // Separate upcoming and past events
    const now = new Date();
    const upcoming = [];
    const past = [];

    registrations.forEach(reg => {
      if (reg.event.date > now) {
        upcoming.push(reg);
      } else {
        past.push(reg);
      }
    });

    res.status(200).json({
      success: true,
      upcoming,
      past,
      total: registrations.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
};