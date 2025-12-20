import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BellIcon, UserCircleIcon, PowerIcon } from '@heroicons/react/24/outline';
import StudentSidebar from '../Student/StudentSidebar.jsx';

const StudentLayout = () => {
    const { auth, logoutUser } = useAuth();
    const userName = auth.user?.name || 'Student User';

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
            <StudentSidebar />

            <div className="flex-1 flex flex-col ml-64">
                <header className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-indigo-950 shadow-2xl border-b border-indigo-700/50 text-white">
                    <h2 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Welcome, Student!
                    </h2>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-cyan-400 hover:text-purple-400 hover:bg-indigo-800/50 rounded-full transition">
                            <BellIcon className="w-6 h-6" />
                        </button>

                        <div className="flex items-center space-x-2 border-l border-indigo-700/50 pl-4">
                            <UserCircleIcon className="w-8 h-8 text-cyan-400" />
                            <span className="text-sm font-medium text-gray-300 hidden md:block">
                                {userName}
                            </span>
                            <button
                                onClick={logoutUser}
                                className="p-2 rounded-full text-red-500 hover:bg-red-700/30 transition transform hover:scale-110"
                                title="Logout"
                            >
                                <PowerIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
