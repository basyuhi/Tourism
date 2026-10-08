import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ListingDetails from './pages/ListingDetails';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import Hotels from './pages/Hotels'; // <-- ADD THIS IMPORT
import HotelDetails from './pages/HotelDetails'; // <-- ADD THIS
import Experiences from './pages/Experiences'; // <-- ADD THIS

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/hotels" element={<Hotels />} /> 
      <Route path="/hotels/:id" element={<HotelDetails />} /> 
      <Route path="/experiences" element={<Experiences />} /> 
    </Routes>
  );
}

export default App;