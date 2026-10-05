import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDestinationById } from '../lib/api';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDestinationById(id);
                // Map backend fields to frontend
                setListing({
                    id: data._id,
                    title: data.name,
                    location: `${data.name}, ${data.state}`,
                    price: data.price || 1500,
                    rating: data.rating || 4.8,
                    reviews: data.reviews || 120,
                    image: data.heroImage,
                    description: data.description,
                    pros: data.pros || [],
                    cons: data.cons || [],
                    dos: data.dos || [],
                    donts: data.donts || [],
                    bestTimeToVisit: data.bestTimeToVisit
                });
            } catch (err) {
                console.error("Failed to load listing:", err);
                setError("Could not load this destination.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-blue-600 font-semibold text-xl animate-pulse">Loading destination details...</div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h1>
                    <Link to="/" className="text-blue-600 font-semibold hover:underline">← Go back home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{listing.title}</h1>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden mb-8 h-[400px] shadow-md">
                    <img
                        src={listing.image}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"; }}
                        className="w-full h-full object-cover"
                        alt={listing.title}
                    />                
                    </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{listing.location}</h2>
                                <p className="text-gray-500 flex items-center gap-1 mt-1">
                                    <span className="text-yellow-400">★</span> {listing.rating} ({listing.reviews} reviews)
                                </p>
                            </div>
                            <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Share</button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About this destination</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{listing.description}</p>
                            <p className="text-gray-600 mt-4 font-semibold">Best time to visit: <span className="text-blue-600">{listing.bestTimeToVisit}</span></p>
                        </div>

                        {/* Pros & Cons Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">👍 Pros</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {listing.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">👎 Cons</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {listing.cons.map((con, i) => <li key={i}>{con}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Dos & Donts Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">✅ Do's</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {listing.dos.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">❌ Don'ts</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {listing.donts.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">₹{listing.price}</span>
                                    <span className="text-gray-500"> / person (est.)</span>
                                </div>
                                <div className="text-yellow-400 text-sm font-bold">★ {listing.rating}</div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="border border-gray-300 rounded-xl p-3">
                                    <label className="text-xs font-bold text-gray-800 uppercase">Date</label>
                                    <input type="date" className="w-full mt-1 focus:outline-none text-gray-700 bg-transparent" />
                                </div>
                                <div className="border border-gray-300 rounded-xl p-3">
                                    <label className="text-xs font-bold text-gray-800 uppercase">Guests</label>
                                    <select className="w-full mt-1 focus:outline-none text-gray-700 bg-transparent">
                                        <option>1 Guest</option>
                                        <option>2 Guests</option>
                                        <option>3+ Guests</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md mb-4">
                                Plan My Trip
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition">
                                Contact Local Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;