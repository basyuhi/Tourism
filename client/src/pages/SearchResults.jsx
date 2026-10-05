import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDestinations } from '../lib/api';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('location') || '';

    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchDestinations();

                // MAP backend fields to frontend expected fields
                const formattedData = data.map(item => ({
                    id: item._id,
                    title: item.name,
                    location: `${item.name}, ${item.state}`,
                    price: item.price || 1500, // Fallback if price isn't in DB yet
                    rating: item.rating || 4.8, // Fallback
                    reviews: item.reviews || 120, // Fallback
                    image: item.heroImage,
                    tag: item.state || "Destination",
                    slug: item.slug
                }));

                setListings(formattedData);
            } catch (err) {
                console.warn("Backend fetch failed:", err);
                setError("Could not connect to the server.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredResults = useMemo(() => {
        if (query.toLowerCase() === 'everywhere' || query === '') {
            return listings;
        }
        return listings.filter(item =>
            (item.location && item.location.toLowerCase().includes(query.toLowerCase())) ||
            (item.title && item.title.toLowerCase().includes(query.toLowerCase())) ||
            (item.tag && item.tag.toLowerCase().includes(query.toLowerCase()))
        );
    }, [listings, query]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-blue-600 font-semibold text-xl animate-pulse">Loading amazing destinations...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
                <p className="text-gray-600 mb-8">
                    Showing results for <span className="font-semibold text-blue-600">{query || 'Assam & Meghalaya'}</span>
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">State</label>
                                    <div className="flex flex-col gap-2">
                                        {['Assam', 'Meghalaya'].map(state => (
                                            <label key={state} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                <input type="checkbox" className="accent-blue-600" /> {state}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                            <span className="text-gray-600 font-medium">{filteredResults.length} destinations found</span>
                        </div>

                        {filteredResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResults.map((item) => (
                                    <Link to={`/listing/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 cursor-pointer group block">
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 px-2 py-1 rounded-full shadow-sm">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm mb-3">{item.location}</p>
                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                <span className="text-sm text-gray-600">Best time: {item.bestTimeToVisit || "Year-round"}</span>
                                                <span className="text-yellow-400 text-sm font-semibold">★ {item.rating}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
                                <p className="text-gray-500 text-lg">No destinations found for "{query}".</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;