import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OptimizedImage from '../components/OptimizedImage';
import { useAuth } from '../context/AuthContext';
import { toggleHotelWishlist, fetchHotelWishlist } from '../lib/api';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [hotel, setHotel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await fetch(`${API}/api/hotels/${id}`);
                const data = await res.json();
                if (data.success) setHotel(data.data);
                else setError("Hotel not found.");
            } catch (err) {
                console.log(err);
                setError("Could not load hotel details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    useEffect(() => {
        if (user && id) {
            fetchHotelWishlist().then(hotels => {
                setIsInWishlist(hotels.some(h => h._id === id));
            }).catch(() => console.log("Not logged in or error"));
        }
    }, [id, user]);

    const handleWishlistToggle = async () => {
        if (!user) {
            alert("Please log in to save hotels!");
            navigate('/auth');
            return;
        }
        try {
            await toggleHotelWishlist(id);
            setIsInWishlist(!isInWishlist);
        } catch (err) {
            console.error("Wishlist toggle failed", err);
        }
    };

    const getPriceLabel = (level) => {
        const labels = { 1: 'Budget', 2: 'Mid-Range', 3: 'Upscale', 4: 'Luxury' };
        return labels[level] || 'Mid-Range';
    };

    if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-blue-600 font-semibold text-xl animate-pulse">Loading...</div></div>;
    if (error || !hotel) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h1><Link to="/hotels" className="text-blue-600 font-semibold hover:underline">← Back to Hotels</Link></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/hotels" className="text-blue-600 font-semibold hover:underline mb-4 inline-block">← Back to all hotels</Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                <p className="text-gray-500 flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {hotel.address}
                </p>

                <div className="rounded-2xl overflow-hidden mb-8 h-[400px] shadow-md">
                    <OptimizedImage src={hotel.photoUrl} alt={hotel.name} className="w-full h-full object-cover" width={1200} height={600} />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold flex items-center gap-1"><span>★</span> {hotel.rating}</div>
                                <span className="text-gray-500">{hotel.totalReviews} guest reviews</span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{getPriceLabel(hotel.priceLevel)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">About this property</h3>
                            <p className="text-gray-600 leading-relaxed">Experience a comfortable and memorable stay at {hotel.name}. Located in the heart of {hotel.location}, this property offers excellent amenities and a prime location for exploring the region.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Free Wi-Fi', 'Air Conditioning', '24/7 Room Service', 'Free Parking', 'Restaurant', 'Laundry Service'].map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-700">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex justify-between items-end mb-6">
                                <div><span className="text-2xl font-bold text-gray-900">Contact for Price</span><span className="text-gray-500 block text-sm">Varies by season</span></div>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md mb-4">Check Availability</button>

                            <button
                                onClick={handleWishlistToggle}
                                className={`w-full py-3 rounded-xl transition font-bold border flex items-center justify-center gap-2 ${isInWishlist ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                {isInWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;