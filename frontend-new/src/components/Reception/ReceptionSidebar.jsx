import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BanknotesIcon, ClipboardDocumentCheckIcon, XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const ReceptionSidebar = ({ isOpen, setIsOpen }) => {
    return (
        <div className={`w-64 bg-indigo-950/90 text-white flex flex-col h-screen fixed z-50 transition-transform duration-300 border-r border-indigo-700/20 shadow-2xl lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="p-6 border-b border-cyan-400/30 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-cyan-400" />
                    Reception
                </h1>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavLink
                    to="/reception/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/30 font-semibold border border-cyan-400/50'
                            : 'hover:bg-indigo-800/60 text-gray-300 hover:text-cyan-300'}`
                    }
                >
                    <HomeIcon className="w-6 h-6 mr-3" />
                    <span className="text-sm font-medium">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/reception/az-students"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/30 font-semibold border border-cyan-400/50'
                            : 'hover:bg-indigo-800/60 text-gray-300 hover:text-cyan-300'}`
                    }
                >
                    <UsersIcon className="w-6 h-6 mr-3" />
                    <span className="text-sm font-medium">AZ Students</span>
                </NavLink>

                <NavLink
                    to="/reception/fees"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/30 font-semibold border border-cyan-400/50'
                            : 'hover:bg-indigo-800/60 text-gray-300 hover:text-cyan-300'}`
                    }
                >
                    <BanknotesIcon className="w-6 h-6 mr-3" />
                    <span className="text-sm font-medium">Fees</span>
                </NavLink>

                <NavLink
                    to="/reception/attendance"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/30 font-semibold border border-cyan-400/50'
                            : 'hover:bg-indigo-800/60 text-gray-300 hover:text-cyan-300'}`
                    }
                >
                    <ClipboardDocumentCheckIcon className="w-6 h-6 mr-3" />
                    <span className="text-sm font-medium">Attendance</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default ReceptionSidebar;
