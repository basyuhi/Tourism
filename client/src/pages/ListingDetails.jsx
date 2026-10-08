import { useState, useEffect } from 'react';
import { useParams, Link , useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDestinationById, submitInquiry } from '../lib/api';
import OptimizedImage from '../components/OptimizedImage';
import { toggleWishlist, fetchWishlist } from '../lib/api';
import { useAuth } from '../context/AuthContext';
// Realistic mock reviews for the TripAdvisor vibe
const mockReviews = [
    {
        id: 1,
        user: "Rahul M.",
        avatar: "R",
        date: "October 2026",
        rating: 5,
        title: "Absolutely breathtaking experience!",
        comment: "The jeep safari was perfectly organized. We saw 3 rhinos and a tiger! The guide was incredibly knowledgeable about the local flora and fauna. Highly recommend booking the early morning slot.",
        helpful: 12
    },
    {
        id: 2,
        user: "Sarah Jenkins",
        avatar: "S",
        date: "September 2026",
        rating: 4,
        title: "Great wildlife, but a bit crowded",
        comment: "The park is amazing and well-maintained. The only downside was that there were a lot of jeeps in the same zone, making it a bit crowded during peak hours. Still, a must-visit!",
        helpful: 8
    },
    {
        id: 3,
        user: "Amit P.",
        avatar: "A",
        date: "August 2026",
        rating: 5,
        title: "Best trip of the year",
        comment: "Everything from the permit booking to the actual safari was seamless. The local guide we got through this platform was fantastic and spoke great English.",
        helpful: 5
    }
];

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate=useNavigate();
    // Contact Form States
    const [showContactForm, setShowContactForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', message: '', date: '', guests: '1'
    });
    const { user } = useAuth();
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist().then(wishlist => {
                setIsInWishlist(wishlist.some(item => item._id === id));
            }).catch(() => console.log("Not logged in or error"));
        }
    }, [id, user]);

    const handleWishlistToggle = async () => {
        if (!user) {
            alert("Please log in to save destinations!");
            navigate('/auth');
            return;
        }
        try {
            await toggleWishlist(id);
            setIsInWishlist(!isInWishlist);
        } catch (err) {
            console.error("Wishlist toggle failed", err);
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDestinationById(id);
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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitInquiry = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitInquiry({
                listingId: listing.id,
                destinationId: listing.id,
                destinationName: listing.title,
                ...formData
            });
            setSubmitSuccess(true);
            setTimeout(() => {
                setShowContactForm(false);
                setSubmitSuccess(false);
                setFormData({ name: '', email: '', message: '', date: '', guests: '1' });
            }, 3000);
        } catch (err) {
            console.error("Inquiry failed:", err);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to render stars
    const renderStars = (rating) => {
        return (
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

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
        <div className="min-h-screen bg-gray-50 relative">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{listing.title}</h1>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden mb-8 h-100 shadow-md">
                    <OptimizedImage
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        transformation={[{ width: 1200, height: 600, cropMode: 'maintain_ratio' }]}
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

                        {/* ================= NEW: REVIEW SECTION ================= */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Traveler Reviews</h3>

                            {/* Review Summary Bar */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                    <div className="text-center md:text-left">
                                        <div className="text-5xl font-bold text-gray-900">{listing.rating}</div>
                                        <div className="flex justify-center md:justify-start my-2">{renderStars(Math.round(listing.rating))}</div>
                                        <div className="text-gray-500 text-sm">{listing.reviews} reviews</div>
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center gap-3 text-sm">
                                                <span className="w-8 text-gray-600">{star} star</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full"
                                                        style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '10%' }}
                                                    ></div>
                                                </div>
                                                <span className="w-8 text-gray-500 text-right">{star === 5 ? '70%' : star === 4 ? '20%' : '10%'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-6">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                                {review.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{review.user}</h4>
                                                        <p className="text-xs text-gray-500">{review.date}</p>
                                                    </div>
                                                    {renderStars(review.rating)}
                                                </div>
                                                <h5 className="font-semibold text-gray-800 mt-3 mb-2">{review.title}</h5>
                                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                                <button className="mt-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                                                    Helpful ({review.helpful})
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-6 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
                                Read all {listing.reviews} reviews
                            </button>
                        </div>
                        {/* ================= END REVIEW SECTION ================= */}

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

                            <button
                                onClick={() => setShowContactForm(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md mb-4"
                            >
                                Contact Local Guide
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className={`ml-3 px-4 py-2 rounded-lg border transition flex items-center gap-2 ${isInWishlist ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {isInWishlist ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Modal Overlay (Unchanged from before) */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setShowContactForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                        {submitSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">The local guide will get back to you shortly.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Contact Guide</h3>
                                <p className="text-gray-500 text-sm mb-6">Ask questions about {listing.title}</p>
                                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                            <select name="guests" value={formData.guests} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                                <option value="1">1 Guest</option>
                                                <option value="2">2 Guests</option>
                                                <option value="3">3 Guests</option>
                                                <option value="4+">4+ Guests</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea required name="message" rows="3" value={formData.message} onChange={handleInputChange} placeholder="Hi, I'm interested in booking this..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition shadow-md">
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingDetails;