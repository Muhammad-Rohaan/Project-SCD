import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        profile: null,
        fees: null,
        notes: [],
        results: [],
        attendance: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const results = await Promise.allSettled([
                    axiosInstance.get('/student/profile'),
                    axiosInstance.get('/student/fees'),
                    axiosInstance.get('/student/fetchNotes'),
                    axiosInstance.get('/student/my-class-results'),
                    axiosInstance.get('/student/attendance')
                ]);

                setData({
                    profile: results[0].status === 'fulfilled' ? results[0].value.data : null,
                    fees: results[1].status === 'fulfilled' ? results[1].value.data : null,
                    notes: results[2].status === 'fulfilled' ? results[2].value.data.notes : [],
                    results: results[3].status === 'fulfilled' ? results[3].value.data.results : [],
                    attendance: results[4].status === 'fulfilled' ? results[4].value.data : null,
                });

                // If critical profile data fails
                if (results[0].status === 'rejected') setError("Critical error: Profile not found.");

            } catch (err) {
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    return (
        <div className="p-6 space-y-10 text-gray-100">
            {/* Header */}
            <header>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Student Portal
                </h1>
                <p className="text-gray-400 mt-2">Welcome back, {data.profile?.user?.fullName || 'Student'}</p>
            </header>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. PROFILE CARD */}
                <div className="lg:col-span-1 bg-indigo-950/50 backdrop-blur-md border border-cyan-400/30 p-8 rounded-2xl shadow-2xl">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-white/10 pb-2">Your Profile</h3>
                    {data.profile ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Full Name</p>
                                <p className="text-lg text-white">{data.profile.user.fullName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Address</p>
                                <p className="text-gray-300">{data.profile.user.email}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {data.profile.user.role}
                                </span>
                            </div>
                        </div>
                    ) : <p>Loading Profile...</p>}
                </div>

                {/* 2. CLASS NOTES */}
                <div className="lg:col-span-2 bg-indigo-950/50 backdrop-blur-md border border-purple-400/30 p-8 rounded-2xl shadow-2xl">
                    <h3 className="text-xl font-bold text-purple-400 mb-6">Subject Notes & Files</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.notes.length > 0 ? data.notes.map((note) => (
                            <div key={note._id} className="bg-indigo-900/40 p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all group shadow-lg">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h4 className="text-white font-bold group-hover:text-purple-400 transition-colors">{note.title}</h4>
                                        <p className="text-gray-500 text-sm mt-1">{note.subject}</p>
                                    </div>
                                    <a 
                                        href={note.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-4 block text-center bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl transition shadow-lg shadow-purple-900/20"
                                    >
                                        Open File
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 col-span-2 italic py-10 text-center">No notes available for your class.</p>
                        )}
                    </div>
                </div>

                {/* 3. TEST RESULTS */}
                <div className="lg:col-span-2 bg-indigo-950/50 backdrop-blur-md border border-emerald-400/30 p-8 rounded-2xl shadow-2xl">
                    <h3 className="text-xl font-bold text-emerald-400 mb-6">Test Results</h3>
                    <div className="space-y-3">
                        {data.results.length > 0 ? data.results.map((res, i) => (
                            <div key={i} className="flex items-center justify-between bg-indigo-900/40 p-4 rounded-xl border border-emerald-500/20">
                                <span className="text-gray-200 font-medium">{res.testName}</span>
                                <a 
                                    href={res.imageUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 text-sm font-bold hover:underline"
                                >
                                    View Result Image →
                                </a>
                            </div>
                        )) : <p className="text-gray-500">No results found.</p>}
                    </div>
                </div>

                {/* 4. FEE STATUS */}
                <div className="lg:col-span-1 bg-indigo-950/50 backdrop-blur-md border border-yellow-400/30 p-8 rounded-2xl shadow-2xl">
                    <h3 className="text-xl font-bold text-yellow-400 mb-6">Fees Status</h3>
                    {data.fees?.fees?.length > 0 ? (
                        <div className="space-y-4">
                            {data.fees.fees.map((fee, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-indigo-900/40 p-4 rounded-xl border border-yellow-500/20">
                                    <span className="text-gray-300 text-sm">
                                        {fee.collectedDate ? new Date(fee.collectedDate).toLocaleDateString() : 'Due'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                                        fee.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {fee.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 text-center">No fee records.</p>}
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;