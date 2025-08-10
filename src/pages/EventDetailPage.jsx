import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch event');

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: id,
          seats: parseInt(seats)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to book event');

      navigate('/my-bookings');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading event details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!event) return <div className="p-4">Event not found</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to events
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Date & Time</h3>
              <p>{new Date(event.date).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Available Seats</h3>
              <p>{event.available_seats}</p>
            </div>
          </div>

          {event.available_seats > 0 && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-3">Book This Event</h2>
              {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seats</label>
                  <input
                    type="number"
                    min="1"
                    max={event.available_seats}
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="mt-1 block w-20 px-3 py-2 border rounded-md"
                  />
                </div>
                <button
                  onClick={handleBookEvent}
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;