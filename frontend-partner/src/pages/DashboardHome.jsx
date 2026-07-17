import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardHome() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncomingBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5080/api/v1/bookings/dashboard', {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          setBookings(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load guest reservation lists.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingBookings();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Live Booking Manifest</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor upcoming guest reservations across your active time slots.</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Retrieving secure schedule records...</p>
      ) : bookings.length === 0 ? (
        <div className="p-8 border border-slate-700 bg-slate-800 rounded-2xl text-center text-slate-400">
          No bookings have been scheduled for your restaurant yet.
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time Slot</th>
                <th className="p-4 text-center">Guest Count</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 font-bold text-white">{booking.customerId?.name || 'Walk-in Guest'}</td>
                  <td className="p-4">{booking.customerId?.phoneNumber || 'N/A'}</td>
                  <td className="p-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="p-4 font-mono text-brand font-semibold">{booking.timeSlot}</td>
                  <td className="p-4 text-center">{booking.guestCount}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-500/25 capitalize">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}