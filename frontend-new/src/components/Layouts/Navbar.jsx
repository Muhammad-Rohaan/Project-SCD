import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BellIcon, UserCircleIcon, Bars3Icon, PowerIcon } from '@heroicons/react/24/outline';

const Navbar = () => {

    // AuthContext se current user aur logout function use karein
    const { auth, logoutUser } = useAuth();

    const userName = auth.user?.name || 'Admin User';

    return (
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 
         to-indigo-950 shadow-2xl border-b border-indigo-700/50 text-white">

            {/* Mobile Sidebar Toggle (Agar zaroorat ho) */}
            <button className="p-2 rounded-md text-cyan-400 lg:hidden hover:bg-indigo-800/50 transition">
                <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page Title / Search Bar Yahan Aasakta Hai */}
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text
             text-transparent hidden sm:block">
                Welcome, Admin!
            </h2>

            {/* Right Side Icons and User Dropdown */}
            <div className="flex items-center space-x-4">

                {/* Notifications */}
                <button className="p-2 text-cyan-400 hover:text-purple-400 hover:bg-indigo-800/50 rounded-full transition">
                    <BellIcon className="w-6 h-6" />
                </button>

                {/* User Profile / Dropdown */}
                <div className="flex items-center space-x-2 border-l border-indigo-700/50 pl-4">
                    <UserCircleIcon className="w-8 h-8 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300 hidden md:block">
                        {userName}
                    </span>

                    {/* Logout Button (Quick Access) */}
                    <button
                        onClick={logoutUser}
                        className="p-2 rounded-full text-red-500 hover:bg-red-700/30 
                        transition transform hover:scale-110"
                        title="Logout"
                    >
                        <PowerIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;