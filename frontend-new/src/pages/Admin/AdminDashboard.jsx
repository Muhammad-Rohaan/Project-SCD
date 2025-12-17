// src/pages/Admin/AdminDashboard.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // agar nested routes use kar rahey ho
import Sidebar from '../../components/Layouts/Sidebar';
import Navbar from '../../components/Layouts/Navbar';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { auth } = useAuth();

    // Agar admin nahi hai (protection already ProtectedRoute se ho rahi hai, lekin safe side)
    if (auth.user?.role !== 'admin') {
        // Redirect ya unauthorized dikhao
        return null;
    }
    // Yahan aapko zaroorat padegi:
    // 1. User ka data (name/role) AuthContext se uthane ki.
    // 2. Sidebar ki visibility (agar mobile view ho).

    return (

        // Flex container jo poori screen (h-screen) ko cover karega
        <div className='flex h-screen bg-gradient-to-br from-slate-900 to-indigo-950 
         overflow-hidden'>

            {/* 1. SIDEBAR (Navigation) - Fixed */}
            {/* Hum role "admin" explicitly bhej rahe hain */}
            <Sidebar role="admin" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div >
        </div >
    );
};

export default AdminDashboard;