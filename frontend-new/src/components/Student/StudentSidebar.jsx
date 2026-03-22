import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const StudentSidebar = () => {
    return (
        <div className="w-64 bg-indigo-950/90 text-white flex flex-col h-screen fixed">
            <div className="p-8 border-b border-cyan-400/30">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Student Panel
                </h1>
            </div>

            <nav className="flex-1 p-6 space-y-3">
                <NavLink
                    to="/student/dashboard"
                    className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/30'
                            : 'hover:bg-indigo-800/60'}`
                    }
                >
                    <HomeIcon className="w-6 h-6 mr-4" />
                    Dashboard
                </NavLink>
            </nav>
        </div>
    );
};

export default StudentSidebar;
