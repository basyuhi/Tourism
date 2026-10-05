
const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center cursor-pointer">
                        <span className="text-2xl font-bold text-blue-600">TravelLocal</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Stays</a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Experiences</a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Local Market</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-700 hover:text-blue-600 font-medium transition hidden sm:block">
                            List your property
                        </button>
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;