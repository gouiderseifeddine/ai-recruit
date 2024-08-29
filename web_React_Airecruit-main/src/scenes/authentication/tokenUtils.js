import axios from 'axios';

import { BASE_URL } from '../../constants/config'

const refreshToken = async () => {
    try {
        const token = localStorage.getItem('refreshToken'); // Get refresh token from local storage

        // Make a POST request to the refresh token endpoint
        const response = await axios.post(`${BASE_URL}/refreshToken`, {}, {
            headers: { Authorization: `Bearer ${token}` } // Headers are set correctly here
        });

        // Assuming the new access token is in the response under `response.data.user.access_token`
        const newAccessToken = response.data.user.access_token;
        localStorage.setItem('token', newAccessToken); // Save the new access token in local storage
        return newAccessToken; // Return the new access token
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error; // Rethrow the error for further handling
    }
};

export { refreshToken };
