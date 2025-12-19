// src/components/Reception/ReceptionDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, AcademicCapIcon, BellIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../../api/axios.js';
import RegisterStudent from './RegisterStudent.jsx';

const StatCard = ({ name, stat, icon: Icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/30 backdrop-blur-md border border-cyan-400/20 ${color} text-white`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-90">{name}</p>
                <p className="text-4xl font-extrabold mt-2">{stat}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-full">
                <Icon className="h-8 w-8" />
            </div>
        </div>
    </div>
);

const ReceptionDashboard = () => {
    const [showStudent, setShowStudent] = useState(false);
    const [stats, setStats] = useState({
        activeStudents: 0,
        todayAdmissions: 0,
        TotalFees: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/reception/az-students/fetch-all-students');
                const students = res.data.students || [];

                setStats({
                    activeStudents: students.length,
                    todayAdmissions: students.filter(s => {
                        const today = new Date();
                        const registered = new Date(s.createdAt || s.joiningDate);
                        return registered.toDateString() === today.toDateString();
                    }).length,
                    pendingFees: 0 // future mein real fees se calculate kar lenge
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleStudentRegistered = () => {
        // Refresh stats after registration
        const refresh = async () => {
            try {
                const res = await axiosInstance.get('/reception/az-students/fetch-all-students');
                const students = res.data.students || [];
                setStats(prev => ({
                    ...prev,
                    activeStudents: students.length,
                    todayAdmissions: prev.todayAdmissions + 1 // simple increment
                }));
            } catch (err) {
                console.error(err);
            }
        };
        refresh();
        setShowStudent(false);
    };

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse">Loading dashboard...</p>;
    }

    return (
        <div className="space-y-8 p-6 lg:p-10 bg-gradient-to-br from-slate-900 to-indigo-950 min-h-screen">
            {/* Header - Admin jaisa */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Reception Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1 text-lg">Monitor admissions and manage students efficiently</p>
                </div>
            </motion.div>

            {/* Stats Cards - Admin jaisa */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard name="Active Students" stat={stats.activeStudents} icon={UsersIcon} color="bg-gradient-to-br from-purple-800 to-indigo-900" />
                <StatCard name="Today's Admissions" stat={stats.todayAdmissions} icon={UsersIcon} color="bg-gradient-to-br from-cyan-800 to-blue-900" />
                <StatCard name="Pending Fees" stat={stats.pendingFees} icon={BellIcon} color="bg-gradient-to-br from-red-800 to-pink-900" />
            </div>

            {/* Quick Actions - Admin jaisa */}
            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-8 shadow-2xl">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">
                    Quick Actions
                </h3>

                <div className="space-y-6">
                    <button
                        onClick={() => setShowStudent(true)}
                        className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-purple-600/70 to-cyan-600/70 hover:from-purple-600/90 hover:to-cyan-600/90 text-white font-bold text-lg transition transform hover:scale-105 shadow-lg"
                    >
                        ➕ Register New Student
                    </button>

                    {/* Future mein aur buttons add kar sakte ho */}
                </div>
            </div>

            {/* Modal */}
            {showStudent && (
                <RegisterStudent
                    onClose={() => setShowStudent(false)}
                    onSuccess={handleStudentRegistered}
                />
            )}
        </div>
    );
};

export default ReceptionDashboard;