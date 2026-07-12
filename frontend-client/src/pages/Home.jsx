import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');

  // Fetch restaurants whenever filters change
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5080/api/v1/restaurants', {
          params: { city: searchCity, cuisine: searchCuisine },
          withCredentials: true
        });
        if (response.data.status === 'success') {
          setRestaurants(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call slightly to avoid hitting the server on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchRestaurants();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCity, searchCuisine]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Search Section */}
      <div className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find & Book the Best Tables in Town
          </h1>
          <p className="text-lg text-slate-500">
            Discover real-time table availability and hidden culinary gems around you.
          </p>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto mt-8 p-2 bg-slate-100 rounded-2xl">
            <input
              type="text"
              placeholder="Search by City (e.g., New York)..."
              className="w-full bg-white rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-brand focus:outline-hidden"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Cuisine (e.g., Italian)..."
              className="w-full bg-white rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-brand focus:outline-hidden"
              value={searchCuisine}
              onChange={(e) => setSearchCuisine(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Restaurant Grid Display */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Available Restaurants</h2>

        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-2xl border border-slate-100">
            No restaurants found matching your current search parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant._id} 
                className="flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-xs transition-all hover:shadow-md hover:-translate-y-1"
              >
                {/* Visual Placeholder card image */}
                <div className="bg-slate-200 h-48 flex items-center justify-center text-slate-400 font-medium">
                  📸 {restaurant.cuisineType.join(' • ')}
                </div>

                <div className="flex flex-1 flex-col p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{restaurant.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                      ⭐ {restaurant.averageRating || 'New'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 flex-1">
                    📍 {restaurant.address.street}, {restaurant.address.city}
                  </p>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      🕒 Hours: {restaurant.operatingHours.open} - {restaurant.operatingHours.close}
                    </span>
                    <Link
                      to={`/restaurant/${restaurant._id}`}
                      className="rounded-xl bg-brand/10 px-4 py-2 text-xs font-bold text-brand hover:bg-brand hover:text-white transition-all"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}