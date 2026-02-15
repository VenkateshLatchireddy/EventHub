import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

const indiaEvents = [
  // TECHNOLOGY & INNOVATION
  {
    name: "Bengaluru Tech Summit 2026",
    organizer: "Karnataka Innovation & Technology Society",
    location: "Bangalore Palace, Bengaluru, Karnataka",
    date: new Date("2026-11-18T09:00:00"), // November 2026 - FUTURE
    description: "South Asia's largest technology event featuring 500+ exhibitors, 100+ sessions, and networking with global tech leaders.",
    capacity: 8000,
    category: "Conference",
    tags: ["technology", "startup", "innovation", "bangalore"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    availableSeats: 8000
  },
  {
    name: "Hyderabad AI & DeepTech Conclave",
    organizer: "Telangana AI Mission",
    location: "Hyderabad International Convention Centre",
    date: new Date("2026-08-22T09:30:00"), // August 2026 - FUTURE
    description: "India's premier AI conference featuring workshops on machine learning and deep tech.",
    capacity: 2000,
    category: "Conference",
    tags: ["AI", "machine learning", "deep tech", "hyderabad"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    availableSeats: 2000
  },
  {
    name: "Pune DevOps & Cloud Summit",
    organizer: "Pune Tech Community",
    location: "JW Marriott, Pune",
    date: new Date("2026-09-15T09:00:00"), // September 2026 - FUTURE
    description: "Hands-on workshops on Kubernetes, Docker, AWS, and Azure.",
    capacity: 500,
    category: "Workshop",
    tags: ["devops", "cloud", "kubernetes", "pune"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    availableSeats: 500
  },
  {
    name: "Chennai SaaS & Product Summit",
    organizer: "Product Hunt India",
    location: "ITC Grand Chola, Chennai",
    date: new Date("2026-10-05T10:00:00"), // October 2026 - FUTURE
    description: "Learn from successful SaaS founders about product development and growth.",
    capacity: 600,
    category: "Conference",
    tags: ["SaaS", "product", "startup", "chennai"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    availableSeats: 600
  },
  {
    name: "Delhi NCR Cybersecurity Summit",
    organizer: "Data Security Council of India",
    location: "The Leela Palace, New Delhi",
    date: new Date("2026-11-10T09:00:00"), // November 2026 - FUTURE
    description: "Learn about latest cyber threats and security strategies.",
    capacity: 800,
    category: "Conference",
    tags: ["cybersecurity", "security", "delhi"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    availableSeats: 800
  },

  // STARTUP & ENTREPRENEURSHIP
  {
    name: "Mumbai Startup Mahakumbh",
    organizer: "NASSCOM & Startup India",
    location: "Jio World Convention Centre, Mumbai",
    date: new Date("2026-07-28T09:00:00"), // July 2026 - FUTURE
    description: "India's largest startup gathering with 2000+ startups and 500+ investors.",
    capacity: 5000,
    category: "Conference",
    tags: ["startup", "funding", "investors", "mumbai"],
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2",
    availableSeats: 5000
  },
  {
    name: "Jaipur Angel Investor Meet",
    organizer: "Rajasthan Angel Investors Network",
    location: "Rambagh Palace, Jaipur",
    date: new Date("2026-08-12T10:30:00"), // August 2026 - FUTURE
    description: "Exclusive networking event for startups seeking early-stage funding.",
    capacity: 200,
    category: "Networking",
    tags: ["funding", "investors", "startup", "jaipur"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    availableSeats: 200
  },
  {
    name: "Indore Women Entrepreneurs Summit",
    organizer: "FICCI FLO",
    location: "Brilliant Convention Centre, Indore",
    date: new Date("2026-09-20T09:30:00"), // September 2026 - FUTURE
    description: "Empowering women entrepreneurs through mentorship and funding.",
    capacity: 500,
    category: "Conference",
    tags: ["women", "entrepreneurship", "business", "indore"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    availableSeats: 500
  },

  // CULTURE & FESTIVALS
  {
    name: "Mumbai Film Festival 2026",
    organizer: "Mumbai Academy of Moving Images",
    location: "Jio World Convention Centre, Mumbai",
    date: new Date("2026-06-20T10:00:00"), // June 2026 - FUTURE
    description: "Celebrate Indian cinema with screenings and masterclasses.",
    capacity: 2000,
    category: "Conference",
    tags: ["film", "bollywood", "entertainment", "mumbai"],
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
    availableSeats: 2000
  },
  {
    name: "Goa International Jazz Festival",
    organizer: "Goa Tourism",
    location: "Candolim Beach, Goa",
    date: new Date("2026-11-05T17:00:00"), // November 2026 - FUTURE
    description: "3-day jazz festival featuring international artists.",
    capacity: 3000,
    category: "Concert",
    tags: ["jazz", "music", "beach", "goa"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    availableSeats: 3000
  },
  {
    name: "Kochi-Muziris Biennale 2026",
    organizer: "Kochi Biennale Foundation",
    location: "Fort Kochi, Kerala",
    date: new Date("2026-12-12T10:00:00"), // December 2026 - FUTURE
    description: "India's largest contemporary art exhibition.",
    capacity: 15000,
    category: "Conference",
    tags: ["art", "culture", "kochi"],
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
    availableSeats: 15000
  },
  {
    name: "Lucknow Awadhi Food Festival",
    organizer: "UP Tourism",
    location: "Bara Imambara Lawns, Lucknow",
    date: new Date("2026-12-05T12:00:00"), // December 2026 - FUTURE
    description: "Savor authentic Awadhi cuisine from 100+ vendors.",
    capacity: 3000,
    category: "Meetup",
    tags: ["food", "culture", "lucknow"],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    availableSeats: 3000
  },

  // WORKSHOPS & LEARNING
  {
    name: "Ahmedabad Design Thinking Workshop",
    organizer: "National Institute of Design",
    location: "NID Campus, Ahmedabad",
    date: new Date("2026-09-08T09:00:00"), // September 2026 - FUTURE
    description: "Intensive workshop on design thinking and UX research.",
    capacity: 50,
    category: "Workshop",
    tags: ["design", "ux", "creative", "ahmedabad"],
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c",
    availableSeats: 50
  },
  {
    name: "Bengaluru Data Science Bootcamp",
    organizer: "Analytics India Magazine",
    location: "Indian Institute of Science",
    date: new Date("2026-10-10T09:00:00"), // October 2026 - FUTURE
    description: "Weekend bootcamp covering Python, SQL, and machine learning.",
    capacity: 100,
    category: "Workshop",
    tags: ["data science", "python", "bangalore"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    availableSeats: 100
  },
  {
    name: "Mumbai Digital Marketing Masterclass",
    organizer: "Digital Marketing Institute",
    location: "Andheri East, Mumbai",
    date: new Date("2026-11-22T10:00:00"), // November 2026 - FUTURE
    description: "Training on SEO, social media marketing, and Google Ads.",
    capacity: 75,
    category: "Workshop",
    tags: ["digital marketing", "seo", "mumbai"],
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a",
    availableSeats: 75
  },

  // SPORTS & FITNESS
  {
    name: "Mumbai Marathon 2027",
    organizer: "Mumbai Marathon Foundation",
    location: "CST to Bandra Reclamation, Mumbai",
    date: new Date("2027-01-18T05:30:00"), // January 2027 - FUTURE
    description: "India's largest marathon with 50,000+ participants.",
    capacity: 50000,
    category: "Sports",
    tags: ["marathon", "fitness", "mumbai"],
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635",
    availableSeats: 50000
  },
  {
    name: "Rishikesh International Yoga Festival 2026",
    organizer: "Uttarakhand Tourism",
    location: "Parmarth Niketan, Rishikesh",
    date: new Date("2026-10-01T06:00:00"), // October 2026 - FUTURE
    description: "7-day yoga and wellness retreat with masters.",
    capacity: 1000,
    category: "Workshop",
    tags: ["yoga", "wellness", "rishikesh"],
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    availableSeats: 1000
  },

  // ADD MORE EVENTS...
  {
    name: "Varanasi Spiritual Retreat",
    organizer: "UP Tourism",
    location: "Ganges Riverfront, Varanasi",
    date: new Date("2026-11-05T06:00:00"), // November 2026 - FUTURE
    description: "3-day spiritual journey with yoga and meditation.",
    capacity: 200,
    category: "Workshop",
    tags: ["spiritual", "yoga", "varanasi"],
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
    availableSeats: 200
  },
  {
    name: "Jaipur Literature Festival 2026",
    organizer: "Jaipur Virasat Foundation",
    location: "Hotel Clarks Amer, Jaipur",
    date: new Date("2026-09-25T09:00:00"), // September 2026 - FUTURE
    description: "World's largest free literature festival.",
    capacity: 2000,
    category: "Conference",
    tags: ["literature", "books", "jaipur"],
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    availableSeats: 2000
  },
  {
  name: "Future of AI in Healthcare Seminar",
  organizer: "Indian Medical Association & TechMed India",
  location: "Hyderabad International Convention Centre, Hyderabad",
  date: new Date("2026-08-15T10:00:00"),
  description: "Explore how artificial intelligence is revolutionizing healthcare. Industry experts discuss AI diagnostics, robotic surgery, and personalized medicine. CME credits available for medical professionals.",
  capacity: 300,
  category: "Seminar",
  tags: ["AI", "healthcare", "medical", "technology", "hyderabad"],
  image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  availableSeats: 300
},
{
  name: "Financial Planning & Wealth Management Seminar",
  organizer: "SEBI & Indian Association of Investment Professionals",
  location: "JW Marriott, Mumbai",
  date: new Date("2026-09-20T09:30:00"),
  description: "Comprehensive seminar on personal finance, tax planning, and wealth management. Learn from certified financial planners about retirement planning, mutual funds, and stock market investing.",
  capacity: 200,
  category: "Seminar",
  tags: ["finance", "investment", "wealth management", "tax planning", "mumbai"],
  image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  availableSeats: 200
}
];

const seedIndiaEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✅ Cleared existing events');

    // Insert new India events
    await Event.insertMany(indiaEvents);
    console.log(`✅ Successfully seeded ${indiaEvents.length} India-based events`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

seedIndiaEvents();