// src/api/axios.js

import axios from 'axios';

// Backend ka port
const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Must be true to send/receive cookies
    headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
// Yey allow kar raha hai frontend ko backend sey baat karanay mai.
