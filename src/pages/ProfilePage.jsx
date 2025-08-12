import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ProfilePage = ({ user, setUser, token }) => {
  const API_BASE_URL = 'https://event-db-server.onrender.com';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('events'); // Default to events tab
  const [userEvents, setUserEvents] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (!response.data || !response.data.user) {
        throw new Error('Server returned invalid profile data structure');
      }

      setUser(response.data.user);
      setUserEvents(response.data.events || []);
      setUserBookings(response.data.bookings || []);

      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError(error);
      setMessage({
        text: error.response?.data?.error || 'Failed to load profile data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [token, setUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setUser(response.data);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage({
        text: error.response?.data?.error || 'Failed to update profile',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error Loading Profile</h2>
          <p>{message.text}</p>
          <button
            onClick={fetchProfileData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {/* User Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-gray-600 mb-2">{user?.email || 'No email provided'}</p>
          </div>
        </div>
      </div>

      {/* Events & Bookings Section with Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'events' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('events')}
          >
            My Events ({userEvents.length})
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({userBookings.length})
          </button>
        </div>

        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {userEvents.length > 0 ? (
              userEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.date), 'MMMM d, yyyy h:mm a')}
                  </p>
                  <div className="mt-2">
                    <Link 
                      to={`/events/${event.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't created any events yet.</p>
                <Link 
                  to="/events/create"
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Your First Event
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {userBookings.length > 0 ? (
              userBookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.title}</h3>
                      <p className="text-gray-600">{booking.location}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.date), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Booked on: {format(new Date(booking.booking_date), 'MMMM d, yyyy')}
                    </p>
                    <Link 
                      to={`/events/${booking.event_id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any bookings yet.</p>
                <Link 
                  to="/events"
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Browse Events
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Update Form (Always visible below tabs) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Profile Information</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
