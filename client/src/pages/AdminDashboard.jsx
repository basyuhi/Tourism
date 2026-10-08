import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const EMPTY_DEST_FORM = {
    name: '', state: '', slug: '', description: '', heroImage: '',
    bestTimeToVisit: '', pros: '', cons: '', dos: '', donts: ''
};

const EMPTY_HOTEL_FORM = {
    name: '', location: '', address: '', rating: '4.5', priceLevel: '2', photoUrl: ''
};

const toArray = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

const STATUS_STYLES = {
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
    const { user, loading: authLoading = false } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // UI Toggles
    const [activeTab, setActiveTab] = useState('destinations');

    // Form States
    const [destForm, setDestForm] = useState(EMPTY_DEST_FORM);
    const [hotelForm, setHotelForm] = useState(EMPTY_HOTEL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate('/auth'); return; }
        if (user.role !== 'admin') { navigate('/'); return; }

        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('tourismToken');
                const res = await fetch(`${API}/api/inquiries/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load inquiries.');
                const data = await res.json();
                setInquiries(data.data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Something went wrong.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [user, authLoading, navigate]);

    const handleDestChange = (e) => setDestForm({ ...destForm, [e.target.name]: e.target.value });
    const handleHotelChange = (e) => setHotelForm({ ...hotelForm, [e.target.name]: e.target.value });

    const handleAddDestination = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('tourismToken');
            const payload = {
                ...destForm,
                slug: destForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
                pros: toArray(destForm.pros),
                cons: toArray(destForm.cons),
                dos: toArray(destForm.dos),
                donts: toArray(destForm.donts),
            };

            const res = await fetch(`${API}/api/destinations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Destination added successfully!');
                setDestForm(EMPTY_DEST_FORM);
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to add destination.');
            }
        } catch (err) {
            console.log(err);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('tourismToken');
            const res = await fetch(`${API}/api/hotels`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(hotelForm)
            });

            if (res.ok) {
                alert('Hotel/Property added successfully!');
                setHotelForm(EMPTY_HOTEL_FORM);
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to add hotel.');
            }
        } catch (err) {
            console.log(err);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-blue-600 font-semibold">Loading Dashboard...</div>;
    }

    const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const thClass = 'px-6 py-4 text-xs font-semibold text-gray-500 uppercase';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage inquiries and add new properties.</p>
                    </div>
                </div>

                {error && (
                    <p className="mb-6 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-100">{error}</p>
                )}

                {/* TABS */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('destinations')}
                        className={`pb-3 px-2 font-semibold transition ${activeTab === 'destinations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🗺️ Add Destination
                    </button>
                    <button
                        onClick={() => setActiveTab('hotels')}
                        className={`pb-3 px-2 font-semibold transition ${activeTab === 'hotels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🏨 Add Hotel / Property
                    </button>
                </div>

                {/* ADD DESTINATION FORM */}
                {activeTab === 'destinations' && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Destination</h2>
                        <form onSubmit={handleAddDestination} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={labelClass}>Name</label><input required name="name" value={destForm.name} onChange={handleDestChange} className={inputClass} /></div>
                            <div><label className={labelClass}>State</label><input required name="state" value={destForm.state} onChange={handleDestChange} className={inputClass} /></div>
                            <div><label className={labelClass}>Slug (e.g., kaziranga)</label><input required name="slug" value={destForm.slug} onChange={handleDestChange} className={inputClass} /></div>
                            <div><label className={labelClass}>Hero Image URL</label><input required name="heroImage" value={destForm.heroImage} onChange={handleDestChange} className={inputClass} /></div>
                            <div className="md:col-span-2"><label className={labelClass}>Description</label><textarea required name="description" rows="3" value={destForm.description} onChange={handleDestChange} className={inputClass}></textarea></div>
                            <div><label className={labelClass}>Best Time to Visit</label><input name="bestTimeToVisit" value={destForm.bestTimeToVisit} onChange={handleDestChange} className={inputClass} /></div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className={labelClass}>Pros (comma separated)</label><textarea name="pros" rows="2" value={destForm.pros} onChange={handleDestChange} className={inputClass} placeholder="Great weather, Nice food"></textarea></div>
                                <div><label className={labelClass}>Cons (comma separated)</label><textarea name="cons" rows="2" value={destForm.cons} onChange={handleDestChange} className={inputClass} placeholder="Crowded, Expensive"></textarea></div>
                                <div><label className={labelClass}>Do's (comma separated)</label><textarea name="dos" rows="2" value={destForm.dos} onChange={handleDestChange} className={inputClass}></textarea></div>
                                <div><label className={labelClass}>Don'ts (comma separated)</label><textarea name="donts" rows="2" value={destForm.donts} onChange={handleDestChange} className={inputClass}></textarea></div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 transition">
                                {isSubmitting ? 'Adding...' : 'Save Destination'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ADD HOTEL FORM */}
                {activeTab === 'hotels' && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Hotel / Property</h2>
                        <form onSubmit={handleAddHotel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={labelClass}>Hotel Name</label><input required name="name" value={hotelForm.name} onChange={handleHotelChange} className={inputClass} placeholder="e.g., Vivanta Guwahati" /></div>
                            <div><label className={labelClass}>Location (City, State)</label><input required name="location" value={hotelForm.location} onChange={handleHotelChange} className={inputClass} placeholder="e.g., Guwahati, Assam" /></div>
                            <div className="md:col-span-2"><label className={labelClass}>Full Address</label><input required name="address" value={hotelForm.address} onChange={handleHotelChange} className={inputClass} placeholder="e.g., Paltan Bazaar, Guwahati" /></div>
                            <div><label className={labelClass}>Rating (1.0 - 5.0)</label><input required type="number" step="0.1" min="1" max="5" name="rating" value={hotelForm.rating} onChange={handleHotelChange} className={inputClass} /></div>
                            <div>
                                <label className={labelClass}>Price Level</label>
                                <select name="priceLevel" value={hotelForm.priceLevel} onChange={handleHotelChange} className={inputClass}>
                                    <option value="1">1 - Budget</option>
                                    <option value="2">2 - Mid-Range</option>
                                    <option value="3">3 - Upscale</option>
                                    <option value="4">4 - Luxury</option>
                                </select>
                            </div>
                            <div className="md:col-span-2"><label className={labelClass}>Hero Image URL (ImageKit or Unsplash)</label><input required name="photoUrl" value={hotelForm.photoUrl} onChange={handleHotelChange} className={inputClass} placeholder="https://..." /></div>

                            <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-400 transition">
                                {isSubmitting ? 'Adding...' : 'Save Hotel / Property'}
                            </button>
                        </form>
                    </div>
                )}

                {/* INQUIRIES TABLE */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Inquiries ({inquiries.length})</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className={thClass}>Traveler</th>
                                    <th className={thClass}>Destination</th>
                                    <th className={thClass}>Message</th>
                                    <th className={thClass}>Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inquiries.map((inq) => (
                                    <tr key={inq._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{inq.userName}</div>
                                            <div className="text-xs text-gray-500">{inq.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{inq.destinationName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{inq.userMessage}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${STATUS_STYLES[inq.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;