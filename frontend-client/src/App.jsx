// frontend-client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import RestaurantDetails from './pages/RestaurantDetails.jsx';
import MyBookings from './pages/MyBookings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Views */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        {/* Authentication Pipelines */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Guarded Core Paths */}
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}