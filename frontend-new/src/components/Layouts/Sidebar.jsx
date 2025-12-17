import React from 'react';
import { NavLink } from 'react-router-dom';
// Heroicons import karein (npm install @heroicons/react)
import { HomeIcon, UsersIcon, AcademicCapIcon, BanknotesIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext'; // Logout ke liye AuthContext use karenge

// Admin links define karein
const adminNavLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Students', href: '/admin/students', icon: UsersIcon },
    { name: 'Teachers', href: '/admin/teachers', icon: AcademicCapIcon },
    { name: 'Receptionists', href: '/admin/receptionists', icon: UsersIcon },
    { name: 'Finance/Fees', href: '/admin/finance', icon: BanknotesIcon },
    { name: 'Announcements', href: '/admin/announcements', icon: BellIcon },
];

const Sidebar = ({ role }) => {
    const { logoutUser } = useAuth();

    // Yahan hum sirf Admin role ke links dikha rahe hain
    const links = adminNavLinks;

    const baseClasses = 'flex items-center p-3 rounded-xl transition-all duration-300 backdrop-blur-sm';
    const activeClasses = 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow-2xl border border-cyan-400/50';
    const inactiveClasses = 'text-gray-300 hover:bg-indigo-800/50 hover:text-cyan-300 hover:shadow-lg hover:border-cyan-400/30';

    // Agar role admin nahi hai to kuch nahi dikhega
    if (role !== 'admin') return null;

    return (
        <div className='w-64 bg-gradient-to-b from-slate-900 to-indigo-950 text-white flex flex-col h-screen 
         fixed border-r border-indigo-700/20 shadow-2xl'>

            {/* Logo/Title */}
            <div className='p-4 border-b border-indigo-700/50'>
                <h1 className='text-2xl font-extrabold flex items-center bg-gradient-to-r from-cyan-400 
                 to-purple-500 bg-clip-text text-transparent'>
                    <AcademicCapIcon className='w-7 h-7 mr-2 text-cyan-400' />
                    AZ Coaching
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className='flex-1 p-4 space-y-3 overflow-y-auto'>
                {links.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                        }
                        end
                    >
                        <item.icon className='w-6 h-6 mr-3' />
                        <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className='p-4 border-t border-indigo-700/50'>
                <button
                    onClick={logoutUser}
                    className='w-full text-left p-3 rounded-xl text-white
                    bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 
                    hover:to-red-600 transition-all duration-300 flex items-center justify-center 
                    shadow-lg hover:shadow-2xl transform hover:scale-105'
                >
                    <span className='text-sm font-medium'>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;