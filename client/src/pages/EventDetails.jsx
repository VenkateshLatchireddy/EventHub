import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import { Calendar, MapPin, Users, Tag, ArrowLeft, Share2, Heart, Clock, Award } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event && user) {
      checkRegistration();
    }
  }, [event, user]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      setEvent(response.data.event);
      setRegisteredCount(response.data.event.registeredCount || 0);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await axios.get('/registrations/my-registrations');
      const registered = response.data.upcoming.some(reg => reg.event._id === id);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await axios.post('/registrations', { eventId: id });
      toast.success('Registered successfully!');
      await fetchEvent();
      await checkRegistration();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    setRegistering(true);
    try {
      await axios.delete(`/registrations/${id}`);
      toast.success('Registration cancelled');
      await fetchEvent();
      setIsRegistered(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!event) return null;

  const isEventFull = event.availableSeats === 0;
  const isEventPast = new Date(event.date) < new Date();
  const percentageFilled = ((event.capacity - event.availableSeats) / event.capacity) * 100;
  const isAlmostFull = event.availableSeats < event.capacity * 0.2 && !isEventFull;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsLiked(!isLiked)} className="p-1.5">
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button onClick={handleShare} className="p-1.5">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - Compact */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Compact Image - 32px height */}
        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Title Overlay - Minimal */}
          <div className="absolute bottom-2 left-3 right-3 text-white">
            <h1 className="text-base font-bold line-clamp-1">{event.name}</h1>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <Award className="h-3 w-3" />
              {event.organizer}
            </p>
          </div>

          {/* Category Badge - Small */}
          <span className="absolute top-2 left-3 bg-white/90 backdrop-blur-sm text-primary-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {event.category}
          </span>

          {/* Availability Badge - Small */}
          <span className={`absolute top-2 right-3 px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg ${
            isEventFull ? 'bg-red-500/90 text-white' :
            isAlmostFull ? 'bg-orange-500/90 text-white animate-pulse' :
            'bg-green-500/90 text-white'
          }`}>
            {isEventFull ? 'Sold Out' : isAlmostFull ? `${event.availableSeats} left!` : `${event.availableSeats} seats`}
          </span>
        </div>

        {/* Quick Info Row - 3 column */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white p-2 rounded-lg text-center">
            <Calendar className="h-3.5 w-3.5 text-primary-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Date</p>
            <p className="text-xs font-semibold">{format(new Date(event.date), 'MMM d')}</p>
          </div>
          <div className="bg-white p-2 rounded-lg text-center">
            <Clock className="h-3.5 w-3.5 text-primary-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Time</p>
            <p className="text-xs font-semibold">{format(new Date(event.date), 'h:mm a')}</p>
          </div>
          <div className="bg-white p-2 rounded-lg text-center">
            <MapPin className="h-3.5 w-3.5 text-primary-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Location</p>
            <p className="text-xs font-semibold truncate">{event.location.split(',')[0]}</p>
          </div>
        </div>

        {/* Description - 2 lines max */}
        <div className="bg-white p-3 rounded-lg mb-3">
          <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
        </div>

        {/* Tags - Horizontal scroll if needed */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {event.tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Registration Card - Compact */}
        <div className="bg-white p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Registration</span>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {registeredCount}/{event.capacity}
            </span>
          </div>
          
          {/* Progress Bar - Thin */}
          <div className="w-full h-1 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                isEventFull ? 'bg-red-500' : percentageFilled > 80 ? 'bg-orange-500' : 'bg-primary-600'
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
          
          <p className="text-[10px] text-gray-500 mb-3">
            {event.availableSeats} seats left • {isEventFull ? 'Sold out' : 'Register now'}
          </p>

          {/* Register Button - Right at the bottom */}
          {!isEventPast ? (
            isRegistered ? (
              <button
                onClick={handleCancelRegistration}
                disabled={registering}
                className="w-full bg-red-50 text-red-600 py-2 text-xs font-medium rounded-lg hover:bg-red-100 transition"
              >
                {registering ? 'Processing...' : 'Cancel Registration'}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isEventFull || registering}
                className={`w-full py-2 text-xs font-medium rounded-lg transition ${
                  isEventFull
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {registering ? 'Processing...' : isEventFull ? 'Sold Out' : 'Register Now'}
              </button>
            )
          ) : (
            <p className="text-center text-xs text-gray-500 py-2">Event ended</p>
          )}

          {!isAuthenticated && !isRegistered && (
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Please <button onClick={() => navigate('/login')} className="text-primary-600 font-medium">login</button> to register
            </p>
          )}

          {/* Footer Guarantee */}
          <div className="flex justify-center gap-3 mt-2 text-[10px] text-gray-400">
            <span>✓ Free cancellation</span>
            <span>✓ Instant confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;