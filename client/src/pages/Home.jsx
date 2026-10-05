import Navbar from '../components/Navbar';
import HeroSearch from '../components/HeroSearch';
import FeaturedListings from '../components/FeaturedListings';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <HeroSearch />
            <FeaturedListings />

            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">TravelLocal</h3>
                    <p className="text-gray-400">Connecting travelers with authentic local experiences.</p>
                    <p className="text-gray-500 text-sm mt-8">&copy; 2026 TravelLocal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;