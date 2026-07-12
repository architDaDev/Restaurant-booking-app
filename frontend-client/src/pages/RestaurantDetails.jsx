import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/UseAuth.js';

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State Variables
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant profile details
        const resProfile = await axios.get(`http://localhost:5080/api/v1/restaurants/${id}`);
        setRestaurant(resProfile.data.data);

        // Fetch related customer reviews
        const resReviews = await axios.get(`http://localhost:5080/api/v1/reviews/restaurant/${id}`);
        setReviews(resReviews.data.data);
      } catch (err) {
        console.error('Failed to load restaurant profile assets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage({ type: '', text: '' });

    // Gatekeeper: Redirect guests to login if they try to reserve a table without a session
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5080/api/v1/bookings',
        { restaurantId: id, bookingDate, timeSlot, guestCount },
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setBookingMessage({
          type: 'success',
          text: '🎉 Table reserved successfully! Enjoy your meal.'
        });
      }
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.response?.data?.message || 'Seating allocation failed. Fully booked.'
      });
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading fine dining assets...</div>;
  if (!restaurant) return <div className="p-12 text-center text-red-500">Restaurant profile not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Profile Header, Menu, and Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Restaurant Cover Info Card */}
          <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{restaurant.name}</h1>
                <p className="text-slate-500 mt-1">📍 {restaurant.address.street}, {restaurant.address.city}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {restaurant.cuisineType.map((type, idx) => (
                    <span key={idx} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <span className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700 border border-amber-200">
                ⭐ {restaurant.averageRating || 'New'}
              </span>
            </div>
          </div>

          {/* Digital Menu Display Grid */}
          <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">Digital Menu Card</h2>
            {restaurant.menu.length === 0 ? (
              <p className="text-sm text-slate-400">No dishes uploaded yet by management.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menu.map((dish) => (
                  <div key={dish._id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between font-bold text-slate-900">
                        <h4>{dish.name}</h4>
                        <span className="text-brand">${dish.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{dish.description}</p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dish.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Diner Review Stack */}
          <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">Guest Feedback</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-400">No guest reviews recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 border border-slate-50 rounded-xl bg-slate-50/30 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-800">{review.customerId?.name || 'Anonymous Diner'}</span>
                      <span className="text-amber-500 font-bold">★ {review.rating}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Dynamic Booking Dispatch Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-white p-6 border border-slate-100 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Book a Table</h3>
            <p className="text-xs text-slate-400">Operational Hours: {restaurant.operatingHours.open} - {restaurant.operatingHours.close}</p>

            {bookingMessage.text && (
              <div className={`rounded-xl p-3 text-xs font-medium ${bookingMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {bookingMessage.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Reservation Date</label>
                <input 
                  type="date" 
                  required
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Seating Window</label>
                <select 
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="12:00">12:00 PM (Lunch)</option>
                  <option value="13:00">1:00 PM (Lunch)</option>
                  <option value="18:00">6:00 PM (Dinner)</option>
                  <option value="19:00">7:00 PM (Dinner)</option>
                  <option value="20:00">8:00 PM (Dinner)</option>
                  <option value="21:00">9:00 PM (Dinner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Passenger/Guest Count</label>
                <input 
                  type="number" 
                  required 
                  min="1" 
                  max="20"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition-all hover:bg-brand-dark shadow-xs cursor-pointer"
              >
                {user ? 'Confirm Secure Reservation' : 'Login to Complete Booking'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}