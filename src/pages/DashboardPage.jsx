import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import { format, parseISO, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      eventsCreated: 0,
      bookingsMade: 0,
    },
    upcomingEvents: [],
    recentBookings: [],
    roomsStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Authentication')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const safeFormatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      // First try to parse as ISO string
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'MMM d, yyyy h:mm a');
      }
      
      // If ISO parsing fails, try to parse as Date object
      const dateObj = new Date(dateString);
      if (isValid(dateObj)) {
        return format(dateObj, 'MMM d, yyyy h:mm a');
      }
      
      return 'Invalid date';
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="mt-2 text-gray-600">Your event and booking statistics at a glance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Events Created Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Events Created</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{dashboardData.stats.eventsCreated}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Made Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Bookings Made</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{dashboardData.stats.bookingsMade}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms/Venues Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Rooms</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{dashboardData.roomsStats.length}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          {dashboardData.upcomingEvents.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {dashboardData.upcomingEvents.map((event) => {
                  const formattedDate = safeFormatDate(event.date);
                  
                  return (
                    <li key={event.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {event.title}
                            </p>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.role === 'creator' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {event.role === 'creator' ? 'Organizer' : 'Attendee'}
                            </span>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 text-center text-gray-500">
              No upcoming events
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          {dashboardData.recentBookings.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {dashboardData.recentBookings.map((booking) => {
                  const formattedEventDate = safeFormatDate(booking.date);
                  const formattedBookingDate = safeFormatDate(booking.booking_date);
                  
                  return (
                    <li key={booking.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {booking.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formattedBookingDate}
                          </p>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {booking.location}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <p>
                              {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Event date: {formattedEventDate}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 text-center text-gray-500">
              No recent bookings
            </div>
          )}
        </div>

        {/* Rooms/Venues Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rooms/Venues</h2>
          {dashboardData.roomsStats.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {dashboardData.roomsStats.map((room) => (
                  <li key={room.room_name}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {room.room_name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {room.upcoming_events} upcoming
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <p className="flex items-center text-sm text-gray-500">
                          Total events: {room.total_events}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 text-center text-gray-500">
              No rooms/venues found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;