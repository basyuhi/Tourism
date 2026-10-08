// src/pages/Auth.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { login, register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(
                    formData.name,
                    formData.email,
                    formData.password
                );
            }

            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Something went wrong. Please try again.'
            );
        }
    };

    const handleModeChange = (loginMode) => {
        setIsLogin(loginMode);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex mb-8 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => handleModeChange(true)}
                        className={`flex-1 py-3 text-center font-semibold transition ${isLogin
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => handleModeChange(false)}
                        className={`flex-1 py-3 text-center font-semibold transition ${!isLogin
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>

                <p className="text-gray-500 mb-6 text-sm">
                    {isLogin
                        ? 'Sign in to manage your trips and inquiries.'
                        : 'Join us to discover the best of Assam & Meghalaya.'}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition shadow-md"
                    >
                        {loading
                            ? 'Processing...'
                            : isLogin
                                ? 'Sign In'
                                : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;