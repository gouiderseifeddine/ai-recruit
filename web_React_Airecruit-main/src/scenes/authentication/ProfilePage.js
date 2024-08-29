// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../../constants/config'
import { refreshToken } from '../authentication/tokenUtils';  // Import the refreshToken function

const ProfilePage = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        profilePicture: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            // Get token from local storage or however it's stored
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/tokenIsValid`, { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture, email: response.data.user.email });
                    console.log(user.name)

                }
                if (response.status === 500) {
                    console.log('response', response.status)
                    try {
                        const newToken = await refreshToken();
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        const response = await axios.get('/tokenIsValid', { headers: { Authorization: `Bearer ${newToken}` } });
                        setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture });
                        console.log(user)
                    } catch (refreshError) {
                        console.error('Error after refreshing token', refreshError);
                    }

                }

            } catch (error) {
                if (error.response || error.response.status === 500 || error.response.status === 401) {
                    try {
                        const newToken = await refreshToken();
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        const response = await axios.get('/tokenIsValid', { headers: { Authorization: `Bearer ${newToken}` } });
                        setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture });
                        console.log(user)
                    } catch (refreshError) {
                        console.error('Error after refreshing token', refreshError);
                    }
                } else {
                    console.error('Error fetching user data', error);
                }
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            // Update user details in backend
            const response = await axios.put('path/to/update/user/api', user);
            console.log('Profile updated successfully', response.data);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <Box p={3}>
            <Avatar src={user.profile_picture || '../../assets/user.png'} sx={{ width: 90, height: 90 }} />
            <Typography variant="h6">Profile</Typography>
            <TextField
                label="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                fullWidth
            />
            <TextField
                label="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                fullWidth
            />
            <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Profile
            </Button>
        </Box>
    );
};

export default ProfilePage;
