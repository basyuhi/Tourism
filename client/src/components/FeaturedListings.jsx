import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDestinations } from '../lib/api';
import OptimizedImage from './OptimizedImage';
// A beautiful fallback image in case a database image link is broken (like the Shillong one)
// const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

const FeaturedListings = () => {
    const [featured, setFeatured] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDestinations();
                // Format the data and take only the first 3 for the homepage
                const formatted = data.slice(0, 3).map(item => ({
                    id: item._id,
                    title: item.name,
                    location: `${item.name}, ${item.state}`,
                    image: item.heroImage,
                    tag: item.state,
                    rating: item.rating || 4.8,
                    reviews: item.reviews || 120
                }));
                setFeatured(formatted);
            } catch (err) {
                console.error("Failed to load featured listings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500 animate-pulse">Loading top destinations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
                    <p className="text-gray-500 mt-2">Hand-picked experiences in Assam & Meghalaya</p>
                </div>
                <Link to="/search" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                    View all &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.map((item) => (
                    <Link
                        to={`/listing/${item.id}`}
                        key={item.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 cursor-pointer group block"
                    >
                        {/* Image Container with Smart Fallback */}
                        <div className="relative h-56 overflow-hidden">
                            <OptimizedImage
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                transformation={[{ width: 800, height: 400, cropMode: 'maintain_ratio' }]}
                            />
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 px-3 py-1 rounded-full shadow-sm">
                                {item.tag}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 flex-shrink-0 ml-2">
                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {item.rating} <span className="text-gray-400 font-normal">({item.reviews})</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {item.location}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <button className="text-blue-600 text-sm font-semibold hover:underline">View Details</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeaturedListings;