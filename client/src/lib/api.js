const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchDestinations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/destinations`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch destinations:", error);
        throw error;
    }
};

export const fetchDestinationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/destinations/id/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch destination ${id}:`, error);
        throw error;
    }
};

export const submitInquiry = async (inquiryData) => {
    const url = `${API_BASE_URL}/api/inquiries/track`;
    console.log("🚀 Attempting to send inquiry to:", url); 
    console.log("📦 Payload:", inquiryData); 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inquiryData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to submit inquiry:", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const fetchMyInquiries = async () => {
    try {
        const token = localStorage.getItem('tourismToken');
        const response = await fetch(`${API_BASE_URL}/api/inquiries/my-inquiries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        throw error;
    }
};
export const toggleWishlist = async (destinationId) => {
    const token = localStorage.getItem('tourismToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/wishlist/${destinationId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
};

export const fetchWishlist = async () => {
    const token = localStorage.getItem('tourismToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return await response.json();
};
export const toggleHotelWishlist = async (hotelId) => {
    const token = localStorage.getItem('tourismToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/hotel-wishlist/${hotelId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
};

export const fetchHotelWishlist = async () => {
    const token = localStorage.getItem('tourismToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/hotel-wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch hotel wishlist');
    return await response.json();
};