import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const HeroSearch = () => {
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    return (
        <div className="relative bg-gray-900 h-[550px] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2021&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    Discover your next local adventure
                </h1>
                <p className="text-lg text-gray-200 mb-10 drop-shadow-md">
                    Explore top-rated stays, tours, and hidden gems from local hosts.
                </p>

                <div className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center">

                    <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <div className="w-full text-left">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Location</label>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="w-full text-gray-700 font-medium focus:outline-none placeholder-gray-400 bg-transparent"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <div className="w-full text-left">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Dates</label>
                            <input
                                type="text"
                                placeholder="Add dates"
                                className="w-full text-gray-700 font-medium focus:outline-none placeholder-gray-400 bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full flex items-center px-4 py-2">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <div className="w-full text-left">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Travelers</label>
                            <input
                                type="text"
                                placeholder="Add guests"
                                className="w-full text-gray-700 font-medium focus:outline-none placeholder-gray-400 bg-transparent"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/search?location=${location}`)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSearch;