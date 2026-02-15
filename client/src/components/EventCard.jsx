import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const {
    _id,
    name,
    organizer,
    location,
    date,
    description,
    category,
    capacity,
    availableSeats,
    image
  } = event;

  const isAlmostFull = availableSeats < capacity * 0.2;
  const isSoldOut = availableSeats === 0;

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {category}
          </span>
        </div>

        {/* Availability badge */}
        <div className="absolute top-4 right-4">
          {isSoldOut ? (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Sold Out
            </span>
          ) : isAlmostFull ? (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse-slow">
              Only {availableSeats} left!
            </span>
          ) : (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {availableSeats} seats
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(new Date(date), 'PPP')}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Organized by {organizer}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Capacity</span>
            <p className="font-semibold text-gray-900">{capacity} people</p>
          </div>
          
          <Link
            to={`/event/${_id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;