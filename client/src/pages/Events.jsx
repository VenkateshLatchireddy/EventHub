import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, MapPin, Calendar, Tag, SlidersHorizontal, Grid3X3, List, Sparkles, TrendingUp } from 'lucide-react';
import axios from '../config/axios';
import EventCard from '../components/EventCard';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const categories = [
    { id: 'all', name: 'All Events', icon: '🎉', color: 'from-blue-500 to-indigo-500' },
    { id: 'Conference', name: 'Conferences', icon: '🎤', color: 'from-purple-500 to-pink-500' },
    { id: 'Workshop', name: 'Workshops', icon: '💻', color: 'from-green-500 to-teal-500' },
    { id: 'Seminar', name: 'Seminars', icon: '📚', color: 'from-yellow-500 to-orange-500' },
    { id: 'Meetup', name: 'Meetups', icon: '🤝', color: 'from-red-500 to-pink-500' },
    { id: 'Concert', name: 'Concerts', icon: '🎵', color: 'from-indigo-500 to-purple-500' },
    { id: 'Sports', name: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-500' },
    { id: 'Networking', name: 'Networking', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { id: 'Other', name: 'Others', icon: '✨', color: 'from-gray-500 to-slate-500' }
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date-asc', label: 'Date: Earliest First' },
    { value: 'date-desc', label: 'Date: Latest First' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'seats-asc', label: 'Seats: Low to High' },
    { value: 'seats-desc', label: 'Seats: High to Low' }
  ];

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);
      if (sortBy !== 'relevance') params.append('sort', sortBy);
      params.append('page', page);
      params.append('limit', viewMode === 'grid' ? 9 : 6);

      const response = await axios.get(`/events?${params.toString()}`);
      
      // Client-side sorting as backup
      let sortedEvents = [...response.data.events];
      
      switch(sortBy) {
        case 'date-asc':
          sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'date-desc':
          sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'name-asc':
          sortedEvents.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          sortedEvents.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'seats-asc':
          sortedEvents.sort((a, b) => a.availableSeats - b.availableSeats);
          break;
        case 'seats-desc':
          sortedEvents.sort((a, b) => b.availableSeats - a.availableSeats);
          break;
        default:
          break;
      }
      
      setEvents(sortedEvents);
      setPagination({
        page: response.data.page,
        totalPages: response.data.pages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, viewMode]);

  const debouncedFetch = useCallback(
    debounce(() => {
      fetchEvents(1);
    }, 500),
    [fetchEvents]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.date) params.set('date', filters.date);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params);

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [filters, sortBy, debouncedFetch, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: '',
      date: ''
    });
    setSortBy('relevance');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section with Parallax Effect */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Live counter badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border border-white/20"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium">{pagination.total} Live Events</span>
              <span className="w-px h-4 bg-white/20"></span>
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">25 Cities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                Great Experience
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Join millions of event enthusiasts. Find and book the best events happening around you.
            </motion.p>

            {/* Trending topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-sm text-white/60 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Trending:
              </span>
              {['Tech Summit', 'Music Fest', 'Startup Meet', 'Workshop'].map((tag, i) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm border border-white/10 transition"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 100L60 91.7C120 83.3 240 66.7 360 62.5C480 58.3 600 66.7 720 75C840 83.3 960 91.7 1080 91.7C1200 91.7 1320 83.3 1380 79.2L1440 75V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Search Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <Search className="absolute left-5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by event name, category, or tags..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 pr-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                    showFilters ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </motion.button>
                
                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Category Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {categories.slice(0, 6).map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange('category', cat.id)}
              className={`group relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.category === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              {filters.category === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 bg-gradient-to-r ${cat.color}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Advanced Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5 text-indigo-600" />
                    Advanced Filters
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition"
                  >
                    <X className="h-4 w-4" />
                    Clear all
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Category Multi-select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location with suggestions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="City or venue"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      list="locations"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <datalist id="locations">
                      {locations.map(loc => <option key={loc} value={loc} />)}
                    </datalist>
                  </div>

                  {/* Date with quick selects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Date
                    </label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (₹0 - ₹1000)
                    </label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>₹0</span>
                        <span>₹{priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active filters */}
                {(filters.category !== 'all' || filters.location || filters.date) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Active filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.category !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          {categories.find(c => c.id === filters.category)?.icon} {filters.category}
                          <button onClick={() => handleFilterChange('category', 'all')}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.location && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          <MapPin className="h-3 w-3" /> {filters.location}
                          <button onClick={() => handleFilterChange('location', '')}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.date && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          <Calendar className="h-3 w-3" /> {new Date(filters.date).toLocaleDateString()}
                          <button onClick={() => handleFilterChange('date', '')}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header with Working Sort Dropdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {pagination.total} Events Found
            </h2>
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          </div>
          
          {/* Working Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 pr-10 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-300"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Events Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr' 
                : 'grid-cols-1 gap-4'
            }`}
            >
              {[...Array(viewMode === 'grid' ? 6 : 3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg h-72 animate-pulse">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : events.length > 0 ? (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid-cols-1 gap-4'
              }`}
            >
            {events.map((event) => (
              <motion.div 
                key={event._id} 
                variants={itemVariants}
                className={viewMode === 'grid' ? 'h-full' : ''}
                style={{ 
                  display: 'flex',
                  height: viewMode === 'grid' ? '100%' : 'auto'
                }}
              >
                <EventCard event={event} viewMode={viewMode} />
              </motion.div>
            ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                <Search className="relative h-20 w-20 text-gray-400 mx-auto mb-4" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any events matching your criteria. Try adjusting your filters or explore different categories.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center mt-12"
          >
            <nav className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchEvents(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </motion.button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchEvents(pageNum)}
                      className={`relative w-10 h-10 rounded-xl font-medium transition ${
                        pagination.page === pageNum
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pagination.page === pageNum && (
                        <motion.div
                          layoutId="activePage"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{pageNum}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchEvents(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button for mobile filters */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default Events;