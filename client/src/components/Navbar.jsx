import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainLinks = [
    { to: '/search', label: 'Explore' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/experiences', label: 'Experiences' }, 
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    const linkClass = 'text-gray-700 hover:text-blue-600 font-medium transition';

    const userLinks = user
        ? [
            ...(user.role === 'admin'
                ? [{ to: '/admin', label: 'Admin Panel', className: 'text-purple-600 hover:text-purple-800 font-medium transition' }]
                : []),
            { to: '/wishlist', label: 'Wishlist', className: 'text-gray-700 hover:text-red-500 font-medium transition' },
            { to: '/dashboard', label: 'My Trips', className: linkClass },
        ]
        : [];

    return (
        <nav aria-label="Main navigation" className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="shrink-0 flex items-center">
                        <span className="text-2xl font-bold text-blue-600">TravelLocal</span>
                    </Link>

                    <div className="hidden md:flex space-x-8">
                        {mainLinks.map((l) => (
                            <Link key={l.to} to={l.to} className={linkClass}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                {userLinks.map((l) => (
                                    <Link key={l.to} to={l.to} className={l.className}>
                                        {l.label}
                                    </Link>
                                ))}
                                <span className="text-sm font-medium text-gray-700">
                                    Hi, {user.name || user.email}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth" className={linkClass}>Sign In</Link>
                                <Link
                                    to="/auth"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
                    {[...mainLinks, ...userLinks].map((l) => (
                        <Link key={l.to} to={l.to} onClick={closeMenu} className={`block ${l.className || linkClass}`}>
                            {l.label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <p className="text-sm font-medium text-gray-700">Hi, {user.name || user.email}!</p>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" onClick={closeMenu} className={`block ${linkClass}`}>Sign In</Link>
                            <Link
                                to="/auth"
                                onClick={closeMenu}
                                className="block text-center bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;