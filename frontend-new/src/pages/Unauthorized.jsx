// src/pages/Unauthorized.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
                <p className="text-gray-700 mb-6">Aapke paas iss page ko dekhne ki ijazat nahi hai.</p>
                <button
                    onClick={goBack}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default Unauthorized;