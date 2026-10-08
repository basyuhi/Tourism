// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchMyInquiries } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/auth');
            return;
        }

        const loadData = async () => {
            try {
                const data = await fetchMyInquiries();
                setInquiries(data || []);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-blue-600 font-semibold text-xl animate-pulse">Loading your trips...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
                        <p className="text-gray-500 mt-1">Track your messages to local guides</p>
                    </div>
                    <Link to="/search" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                        + New Inquiry
                    </Link>
                </div>

                {inquiries.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-4">🗺️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No inquiries yet</h3>
                        <p className="text-gray-500 mb-6">You haven't contacted any local guides yet.</p>
                        <Link to="/search" className="text-blue-600 font-semibold hover:underline">
                            Explore Destinations &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Guests</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sent On</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {inquiries.map((inq) => (
                                        <tr key={inq._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{inq.destinationName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">{inq.preferredDate || 'Flexible'}</div>
                                                <div className="text-xs text-gray-500">{inq.numberOfGuests} Guest(s)</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{inq.userMessage}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inq.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        inq.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;