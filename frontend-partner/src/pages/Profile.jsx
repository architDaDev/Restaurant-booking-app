import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Onboarding Form State (Only used if no restaurant exists yet)
  const [name, setName] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [totalTables, setTotalTables] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    const restaurantId = localStorage.getItem('partner_restaurant_id');
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5080/api/v1/restaurants/${restaurantId}`, {
        withCredentials: true,
      });
      if (response.data.status === 'success' && response.data.data) {
        setRestaurant(response.data.data);
        localStorage.setItem('partner_restaurant_id', response.data.data._id);
      }
    } catch (err) {
      console.log('No restaurant associated with this owner account yet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const payload = {
      name,
      cuisineType: cuisineType.split(',').map((c) => c.trim()),
      address: { street, city, zipCode },
      capacity: {
        totalTables: parseInt(totalTables, 10),
        maxGuests: parseInt(maxGuests, 10)
      },
      operatingHours: { open: openTime, close: closeTime },
    };

    try {
      const response = await axios.post('http://localhost:5080/api/v1/restaurants', payload, {
        withCredentials: true,
      });
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: '🏪 Restaurant profile established!' });
        setRestaurant(response.data.data);
        localStorage.setItem('partner_restaurant_id', response.data.data._id);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Onboarding failed.' });
    }
  };

  if (loading) return <div className="text-slate-400 p-6">Loading Business Data...</div>;

  // Calculate review metrics safely if they exist
  const reviewList = restaurant?.reviews || [];
  const averageRating = reviewList.length > 0
    ? (reviewList.reduce((acc, rev) => acc + rev.rating, 0) / reviewList.length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black">Business Command Center</h1>
        <p className="text-slate-400 text-sm mt-1">Review operations status, physical capacity limits, and customer sentiment.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-950 text-green-400 border border-green-900/40' : 'bg-red-950 text-red-400 border border-red-900/40'}`}>
          {message.text}
        </div>
      )}

      {restaurant ? (
        /* Operational View Dashboard (Form is completely gone) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Business Details Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-700/60 pb-4">
                <span className="text-[10px] font-black bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md uppercase tracking-wider text-brand">
                  Active Venue
                </span>
                <h2 className="text-2xl font-black text-white mt-3">{restaurant.name}</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Cuisine Style</p>
                  <p className="text-slate-200 mt-0.5">{restaurant.cuisineType.join(', ')}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Address Location</p>
                  <p className="text-slate-200 mt-0.5">
                    {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Floor Plan Capacity</p>
                  <p className="text-slate-200 mt-0.5">
                    {restaurant.capacity?.totalTables} Tables ({restaurant.capacity?.maxGuests} Guest Limit)
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Operating Windows</p>
                  <p className="text-slate-200 mt-0.5">{restaurant.operatingHours.open} - {restaurant.operatingHours.close}</p>
                </div>
              </div>
            </div>

            {/* Basic Metric Performance Block */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30">
                <span className="text-2xl font-black text-white">{averageRating}</span>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Avg Stars</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30">
                <span className="text-2xl font-black text-brand">{reviewList.length}</span>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Guest Review Feedback Thread */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>💬</span> Guest Feedback Pipeline
            </h3>
            
            {reviewList.length === 0 ? (
              <div className="p-8 border border-slate-700 bg-slate-800 rounded-2xl text-center text-slate-400 text-sm">
                No customer reviews have been published for this storefront yet.
              </div>
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
                {reviewList.map((review) => (
                  <div key={review._id} className="p-5 border border-slate-700 bg-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white text-sm">
                          {review.customerId?.name || 'Verified Diner'}
                        </span>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent Visit'}
                        </p>
                      </div>
                      <div className="flex gap-0.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/50">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-amber-400 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Fallback: Standard Onboarding Form (Only renders if first-time user profile is raw/empty) */
        <form onSubmit={handleCreateRestaurant} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Setup Your Restaurant Profile</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Restaurant Name</label>
            <input 
              type="text" required placeholder="e.g., Bella Italia"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Cuisines (Comma Separated)</label>
            <input 
              type="text" required placeholder="Italian, Pizza, Pasta"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={cuisineType} onChange={(e) => setCuisineType(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase">Street Address</label>
              <input 
                type="text" required placeholder="123 Main St"
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={street} onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">City</label>
              <input 
                type="text" required placeholder="New York"
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={city} onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Zip Code</label>
              <input 
                type="text" required placeholder="10001"
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={zipCode} onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Total Tables</label>
              <input 
                type="number" required min="1" placeholder="15"
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={totalTables} onChange={(e) => setTotalTables(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Max Guest Capacity</label>
              <input 
                type="number" required min="1" placeholder="60"
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Opening Time</label>
              <input 
                type="time" required
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={openTime} onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Closing Time</label>
              <input 
                type="time" required
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
                value={closeTime} onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-all cursor-pointer">
            Launch Restaurant Profile
          </button>
        </form>
      )}
    </div>
  );
}