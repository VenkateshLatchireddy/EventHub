import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get all events with filtering
// @route   GET /api/events
// @access  Public
// @desc    Get all events with filtering and sorting
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { search, category, location, date, sort, page = 1, limit = 9 } = req.query;
    
    let query = {};
    let sortOptions = {};

    // Search logic (keep your existing search)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter logic (keep your existing filters)

    // Add sorting
    switch(sort) {
      case 'date-asc':
        sortOptions.date = 1;
        break;
      case 'date-desc':
        sortOptions.date = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      case 'seats-asc':
        sortOptions.availableSeats = 1;
        break;
      case 'seats-desc':
        sortOptions.availableSeats = -1;
        break;
      default:
        sortOptions.createdAt = -1; // Default sort by newest first
        break;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get registration count for this event
    const registrations = await Registration.countDocuments({
      event: event._id,
      status: 'confirmed'
    });

    const eventWithStats = {
      ...event.toObject(),
      registeredCount: registrations
    };

    res.status(200).json({
      success: true,
      event: eventWithStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
};

// @desc    Create event (admin only - for seeding)
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating event'
    });
  }
};