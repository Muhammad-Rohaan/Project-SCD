// src/pages/Unauthorized.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br 
         from-slate-900 via-indigo-950 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl 
                border border-red-500/30 max-w-lg"
            >
                <motion.h1
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    className="text-6xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 
                    bg-clip-text text-transparent mb-6"
                >
                    403
                </motion.h1>

                <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>

                <p className="text-lg text-gray-300 mb-8">You Dont have access to this page.<br />
                    Please contact Admin.
                </p>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goBack}
                    className="py-4 px-8 text-lg font-semibold rounded-2xl text-white 
                    bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 
                    shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
                >
                    Go Back
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Unauthorized;