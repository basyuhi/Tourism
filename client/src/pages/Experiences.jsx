import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Experiences = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <div className="text-6xl mb-4">🎭</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Experiences Coming Soon</h1>
                    <p className="text-gray-600 mb-8">We are curating the best local tours, cultural workshops, and adventure activities across Assam & Meghalaya. Check back soon!</p>
                    <Link to="/search" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Explore Destinations
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Experiences;