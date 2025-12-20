import React from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Teacher Dashboard
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-8 shadow-2xl">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">
                    Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/teacher/results"
                        className="py-6 px-8 rounded-2xl bg-gradient-to-r from-purple-600/70 to-cyan-600/70 hover:from-purple-600 hover:to-cyan-600 text-white font-bold text-lg transition shadow-lg"
                    >
                        Upload / View Results
                    </Link>

                    <Link
                        to="/teacher/students"
                        className="py-6 px-8 rounded-2xl bg-gradient-to-r from-cyan-600/70 to-purple-600/70 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-lg transition shadow-lg"
                    >
                        Find Students By Class
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
