import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchWishlist, toggleWishlist, fetchHotelWishlist, toggleHotelWishlist } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import OptimizedImage from '../components/OptimizedImage';

const Wishlist = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/auth'); return; }

        const loadData = async () => {
            try {
                const [destData, hotelData] = await Promise.all([
                    fetchWishlist().catch(() => []),
                    fetchHotelWishlist().catch(() => [])
                ]);
                setDestinations(destData || []);
                setHotels(hotelData || []);
            } catch (error) {
                console.error("Failed to load wishlist:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user, navigate]);

    const handleRemoveDestination = async (id) => {
        await toggleWishlist(id);
        setDestinations(destinations.filter(item => item._id !== id));
    };

    const handleRemoveHotel = async (id) => {
        await toggleHotelWishlist(id);
        setHotels(hotels.filter(item => item._id !== id));
    };

    if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-blue-600 font-semibold text-xl animate-pulse">Loading your wishlist...</div></div>;

    const renderCard = (item, type) => (
        <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
            <Link to={`/${type === 'hotel' ? 'hotels' : 'listing'}/${item._id}`} className="block relative h-56 overflow-hidden">
                <OptimizedImage src={type === 'hotel' ? item.photoUrl : item.heroImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" width={800} height={400} />
            </Link>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{type === 'hotel' ? item.location : item.state}</p>
                <div className="flex gap-3">
                    <Link to={`/${type === 'hotel' ? 'hotels' : 'listing'}/${item._id}`} className="flex-1 bg-gray-100 text-gray-800 text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm">View Details</Link>
                    <button onClick={() => type === 'hotel' ? handleRemoveHotel(item._id) : handleRemoveDestination(item._id)} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium">Remove</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist ❤️</h1>
                <p className="text-gray-500 mb-8">Destinations and hotels you've saved for later</p>

                {destinations.length === 0 && hotels.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-4">💔</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <Link to="/search" className="text-blue-600 font-semibold hover:underline">Browse Destinations &rarr;</Link>
                    </div>
                ) : (
                    <>
                        {destinations.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Destinations ({destinations.length})</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {destinations.map(item => renderCard(item, 'destination'))}
                                </div>
                            </div>
                        )}
                        {hotels.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Hotels ({hotels.length})</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {hotels.map(item => renderCard(item, 'hotel'))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;