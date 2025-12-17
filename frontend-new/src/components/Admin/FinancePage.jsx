import React from 'react';

const FinancePage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AZ Finance Management
            </h1>

            {/* Yahan table ya list aayegi */}
            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                <p className="text-gray-300">Finance list placeholder...</p>
            </div>
        </div>
    );
};

export default FinancePage;