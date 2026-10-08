import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OptimizedImage from '../components/OptimizedImage';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const getPriceLabel = (level) => {
    const labels = { 1: 'Budget', 2: 'Mid-Range', 3: 'Upscale', 4: 'Luxury' };
    return labels[level] || 'Mid-Range';
};

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // inputValue = what the user is typing, filterLocation = what we actually query with
    const [inputValue, setInputValue] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    // Debounce: only update the query 300ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => setFilterLocation(inputValue.trim()), 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    // Fetch hotels; cancel the previous request whenever the query changes
    useEffect(() => {
        const controller = new AbortController();

        const fetchHotels = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const url = filterLocation
                    ? `${API}/api/hotels?location=${encodeURIComponent(filterLocation)}`
                    : `${API}/api/hotels`;

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setHotels(data.data || []);
            } catch (err) {
                if (err.name === 'AbortError') return; // a newer request replaced this one
                console.error('Failed to fetch hotels:', err);
                setError("Couldn't load hotels. Please try again.");
                setHotels([]);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        fetchHotels();
        return () => controller.abort();
    }, [filterLocation]);

    // Search button / Enter key: apply the query immediately, skipping the debounce
    const handleSubmit = (e) => {
        e.preventDefault();
        setFilterLocation(inputValue.trim());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero / Search Section */}
            <div className="bg-blue-600 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Perfect Stay</h1>
                    <p className="text-blue-100 mb-8">Discover top-rated hotels and properties across Assam & Meghalaya</p>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
                    >
                        <input
                            type="text"
                            placeholder="Search by city (e.g., Guwahati, Shillong)..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg transition"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {filterLocation ? `Hotels in ${filterLocation}` : 'All Available Properties'}
                        {!isLoading && !error && (
                            <span className="text-gray-500 text-lg font-normal ml-2">({hotels.length} found)</span>
                        )}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center text-blue-600 font-semibold text-xl animate-pulse">
                        Loading hotels...
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-12 rounded-2xl text-center border border-red-100">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-lg">
                            No hotels found for this location. Try searching for "Guwahati" or "Shillong".
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {hotels.map((hotel) => (
                                        <Link key={hotel._id} to={`/hotels/${hotel._id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                                            <div className="relative h-56 overflow-hidden">
                                                <OptimizedImage
                                                    src={hotel.photoUrl}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    width={800}
                                                    height={400}
                                                />
                                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                    <span className="text-yellow-500">★</span> {hotel.rating}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{hotel.name}</h3>
                                                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    {hotel.location}
                                                </p>

                                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {getPriceLabel(hotel.priceLevel)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{hotel.totalReviews} reviews</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hotels;