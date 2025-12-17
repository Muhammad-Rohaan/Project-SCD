import React, { useState, useEffect } from 'react';
// Heroicons import karein
import { UsersIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios.js';
import RegisterTeacher from '../../components/Admin/RegisterTeacher.jsx';
import RegisterReceptionist from '../../components/Admin/RegisterReceptionist.jsx';

const StatCard = ({ name, stat, icon: Icon, color }) => (
    <div className={`p-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/30 backdrop-blur-md border border-cyan-400/20 ${color} text-white`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-90">{name}</p>
                <p className="text-3xl font-extrabold mt-1">{stat}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
                <Icon className="h-6 w-6" />
            </div>
        </div>
    </div>
);

const DashboardContent = () => {
    const [showTeacher, setShowTeacher] = useState(false);
    const [showReceptionist, setShowReceptionist] = useState(false);
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        announcements: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Teachers count fetch karo
                const teachersRes = await axiosInstance.get('/admin/az-teachers/fetch-all-teachers');
                const teachersCount = teachersRes.data.teachers?.length || 0;

                // Baaki counts future mein add kar sakte ho (students, announcements)

                setStats({
                    students: 0, // abhi dummy, baad mein real API se
                    teachers: teachersCount,
                    announcements: 0
                });
            } catch (err) {
                console.error("Stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <p className="text-center text-white text-2xl">Loading stats...</p>;
    }

    return (
        <div className="space-y-8 p-6 lg:p-10 bg-gradient-to-br from-slate-900 to-indigo-950 min-h-screen">

            {/* ==== Ye Naya Beautiful Header ==== */}
            <div className="mb-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-400 mt-1 text-sm">Monitor your institute's performance at a glance</p>
                    </div>
                </motion.div>
            </div>
            {/* ==== Header Khatam ==== */}

            {/* Stats/Summary Cards Grid (Layout alag: Stacked on mobile, grid with gap) */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
                <StatCard name="Active Students" stat={stats.students} icon={UsersIcon} color="bg-gradient-to-br from-purple-800 to-indigo-900" />
                <StatCard name="Total Teachers" stat={stats.teachers} icon={AcademicCapIcon} color="bg-gradient-to-br from-cyan-800 to-blue-900" />
                <StatCard name="Upcoming Announcements" stat={stats.announcements} icon={CalendarDaysIcon} color="bg-gradient-to-br from-pink-800 to-red-900" />
            </div>

            {/* Recent Activities and Quick Links (Layout alag: Recent full width, Quick actions niche) */}
            <div className="grid grid-cols-1 gap-6">
                {/* Quick Actions */}
                <div className="bg-indigo-950/50 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-400/30">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-4">

                        {/* Register New Teacher Button */}
                        <button
                            onClick={() => setShowTeacher(true)}
                            className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-indigo-800/50 to-purple-800/50 hover:from-indigo-900/50 hover:to-purple-900/50 text-cyan-300 font-medium transition transform hover:scale-105 shadow-md"
                        >
                            ➕ Register New Teacher
                        </button>

                        {/* Receptionist Button (future ke liye) */}
                        <button
                            onClick={() => setShowReceptionist(true)}
                            className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-cyan-800/50 to-blue-800/50 hover:from-cyan-900/50 hover:to-blue-900/50 text-cyan-300 font-medium transition transform hover:scale-105 shadow-md">
                            ➕ Register New Receptionist
                        </button>

                        {/* Announcement Button */}
                        <button className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-pink-800/50 to-red-800/50 hover:from-pink-900/50 hover:to-red-900/50 text-pink-300 font-medium transition transform hover:scale-105 shadow-md">
                            📢 Create Announcement
                        </button>
                    </div>

                    {showTeacher && (
                        <RegisterTeacher onClose={() => setShowTeacher(false)} />
                    )}
                    {showReceptionist && (
                        <RegisterReceptionist onClose={() => setShowReceptionist(false)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;