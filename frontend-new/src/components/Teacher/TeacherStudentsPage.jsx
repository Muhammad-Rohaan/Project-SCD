import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const TeacherStudentsPage = () => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    const fetchStudents = async (e) => {
        e.preventDefault();
        const cls = className.trim().toUpperCase();
        if (!cls) return;
        setLoading(true);
        setError('');
        setStudents([]);
        try {
            const res = await axiosInstance.get(`/teacher/students/${encodeURIComponent(cls)}`);
            setStudents(res.data.data || []);
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Students
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-4">Search By Class</h3>

                <form onSubmit={fetchStudents} className="flex flex-col md:flex-row gap-4">
                    <input
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="input-style w-full"
                        placeholder="Class (e.g. 11)"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                    >
                        {loading ? 'Loading…' : 'Search'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30">
                        {error}
                    </div>
                )}
            </div>

            {students.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                        <thead className="bg-indigo-900/50">
                            <tr>
                                <th className="p-4 text-cyan-300">Roll No</th>
                                <th className="p-4 text-cyan-300">Name</th>
                                <th className="p-4 text-cyan-300">Class</th>
                                <th className="p-4 text-cyan-300">Field</th>
                                <th className="p-4 text-cyan-300">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{s.rollNo}</td>
                                    <td className="p-4 text-white">{s.stdName}</td>
                                    <td className="p-4 text-gray-300">{s.className}</td>
                                    <td className="p-4 text-gray-300">{s.field || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">{s.contact || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentsPage;
