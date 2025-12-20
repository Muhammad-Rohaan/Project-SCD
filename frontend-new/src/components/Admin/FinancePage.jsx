import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const FinancePage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get('/admin/finances');
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load finance endpoint');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AZ Finance Management
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                {loading ? (
                    <p className="text-white text-xl animate-pulse">Loading finance endpoint…</p>
                ) : error ? (
                    <p className="text-red-300">{error}</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-200 font-semibold">Backend response</p>
                        <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancePage;
