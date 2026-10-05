// src/lib/api.js

// Use 127.0.0.1 instead of localhost to avoid resolution issues
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
        // Using the /id/:id route we created earlier
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