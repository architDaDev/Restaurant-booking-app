import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // We'll create a lightweight backend customer dashboard route, or reuse our query filters
        const response = await axios.get('http://localhost:5080/api/v1/bookings/my-reservations', {
          withCredentials: true
        });
        if (response.data.status === 'success') {
          // Filter out bookings where the current user is the customer
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching personal booking manifest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900">My Reservations</h1>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
            {bookings.length} Total Bookings
          </span>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading your timeline...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
            <p className="text-lg font-medium text-slate-700">No active table reservations found.</p>
            <p className="text-sm text-slate-400">Head back to the home page to secure your next meal!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="rounded-2xl bg-white p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1">
                  {/* Since booking populates restaurant details or ID */}
                 <h3 className="text-lg font-bold text-slate-900">
  {booking.restaurantId?.name || 'Restaurant Visit'}
</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>📅 {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    <span>🕒 Seating Window: <span className="font-semibold text-slate-700">{booking.timeSlot}</span></span>
                    <span>👥 Guests: <span className="font-semibold text-slate-700">{booking.guestCount}</span></span>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold capitalize border ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    ● {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}