import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const StudentsPage = () => {
    const [loading, setLoading] = useState(true);
    const [adminDashboard, setAdminDashboard] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdminDashboard = async () => {
            try {
                const res = await axiosInstance.get('/admin/az-teachers/getAllStudents');
                setAdminDashboard(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load admin dashboard endpoint');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminDashboard();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AZ Students Management
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                {/* <p className="text-gray-200">
                    Admin side par students ke liye dedicated backend routes available nahi hain. Students CRUD routes
                    receptionist panel ke under protected hain.
                </p> */}

                <div className="mt-6 bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                    {loading ? (
                        <p className="text-white animate-pulse">Loading…</p>
                    ) : error ? (
                        <p className="text-red-300">{error}</p>
                    ) : (
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                            {JSON.stringify(adminDashboard, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentsPage;
