import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Appetizer');
  const [message, setMessage] = useState('');

  const fetchMenu = async () => {
    const restaurantId = localStorage.getItem('partner_restaurant_id');
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5080/api/v1/restaurants/${restaurantId}`);
      if (response.data.status === 'success') {
        setMenu(response.data.data.menu);
      }
    } catch (err) {
      console.error('Failed to fetch menu.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddDish = async (e) => {
    e.preventDefault();
    setMessage('');
    const restaurantId = localStorage.getItem('partner_restaurant_id');

    if (!restaurantId) {
      setMessage('⚠️ Please set up your Restaurant Profile first!');
      return;
    }

    try {
      const payload = { name, price: parseFloat(price), description, category };
      const response = await axios.post(`http://localhost:5080/api/v1/restaurants/${restaurantId}/menu`, payload, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setMessage('✅ Dish added successfully!');
        setName('');
        setPrice('');
        setDescription('');
        fetchMenu(); // Refresh menu array
      }
    } catch (err) {
      setMessage('❌ Failed to add dish to menu.');
    }
  };

  if (loading) return <div className="text-slate-400">Loading Menu details...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Input Form */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-3xl font-black">Menu Editor</h1>
          <p className="text-slate-400 text-sm mt-1">Manage dishes visible to your diners.</p>
        </div>

        {message && (
          <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-300">
            {message}
          </div>
        )}

        <form onSubmit={handleAddDish} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Dish Name</label>
            <input 
              type="text" required className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Price</label>
            <input 
              type="number" step="0.01" required className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Category</label>
            <select 
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Description</label>
            <textarea 
              rows="3" required className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-all cursor-pointer">
            Add Dish to Menu
          </button>
        </form>
      </div>

      {/* Right: Existing Menu Preview */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-bold">Active Digital Menu</h2>
        {menu.length === 0 ? (
          <div className="p-8 border border-slate-700 bg-slate-800 rounded-2xl text-center text-slate-400">
            No dishes on the menu yet. Use the editor to add your first dish!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((dish) => (
              <div key={dish._id} className="p-5 border border-slate-700 bg-slate-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-lg">{dish.name}</h4>
                    <span className="text-brand font-bold">${dish.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{dish.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                  <span className="text-[10px] font-black bg-slate-900 px-2.5 py-1 rounded-md uppercase tracking-wider text-slate-400">
                    {dish.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}