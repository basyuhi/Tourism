import { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from '../lib/api';

const AuthContext = createContext(null);

const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('tourismUser');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            return JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('tourismUser');
        localStorage.removeItem('tourismToken');
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            console.log("🔑 Attempting login with:", email);
            const data = await loginUser({ email, password });
            console.log("✅ RAW Backend login response:", data);

            let userData = data?.user || data?.data?.user || data?.data || data;
            const token = data?.token || data?.data?.token || userData?.token;

            if (userData && (userData._id || userData.email)) {
                setUser(userData);
                localStorage.setItem('tourismUser', JSON.stringify(userData));
                if (token) localStorage.setItem('tourismToken', token);
                return userData;
            } else {
                throw new Error("No valid user data found in login response");
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            console.log("📝 Attempting register with:", email);
            const data = await registerUser({ name, email, password });
            console.log("✅ RAW Backend register response:", data);

            let userData = data?.user || data?.data?.user || data?.data || data;
            const token = data?.token || data?.data?.token || userData?.token;

            if (userData && (userData._id || userData.email)) {
                setUser(userData);
                localStorage.setItem('tourismUser', JSON.stringify(userData));
                if (token) localStorage.setItem('tourismToken', token);
                return userData;
            } else {
                console.error("Parsed userData is invalid or empty:", userData);
                throw new Error("No user data found in response");
            }
        } catch (error) {
            console.error("❌ Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tourismUser');
        localStorage.removeItem('tourismToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};