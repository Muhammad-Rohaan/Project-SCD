import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const StudentsPage = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [rollNoQuery, setRollNoQuery] = useState('');
    const [classQuery, setClassQuery] = useState('');

    const formatDate = (value) => {
        if (!value) return '—';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString();
    };

    useEffect(() => {
        const fetchAdminDashboard = async () => {
            try {
                const res = await axiosInstance.get('/admin/az-teachers/getAllStudents');
                setStudents(res.data.getStds || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load admin dashboard endpoint');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminDashboard();
    }, []);

    const filteredStudents = students.filter((s) => {
        const roll = String(s.rollNo || '').toLowerCase();
        const cls = String(s.className || '').toLowerCase();

        const rollOk = rollNoQuery.trim() ? roll.includes(rollNoQuery.trim().toLowerCase()) : true;
        const classOk = classQuery.trim() ? cls === classQuery.trim().toLowerCase() : true;

        return rollOk && classOk;
    });

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AZ Students Management
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                {loading ? (
                    <p className="text-white animate-pulse">Loading…</p>
                ) : error ? (
                    <p className="text-red-300">{error}</p>
                ) : (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                <p className="text-sm text-gray-300">Total Students</p>
                                <p className="text-3xl font-extrabold text-white mt-1">{students.length}</p>
                            </div>
                            <div className="md:col-span-2 bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        value={rollNoQuery}
                                        onChange={(e) => setRollNoQuery(e.target.value)}
                                        className="input-style w-full"
                                        placeholder="Search by roll no (contains)"
                                    />
                                    <input
                                        value={classQuery}
                                        onChange={(e) => setClassQuery(e.target.value)}
                                        className="input-style w-full"
                                        placeholder="Filter by class (exact, e.g. 9)"
                                    />
                                </div>
                            </div>
                        </div>

                        {filteredStudents.length === 0 ? (
                            <div className="bg-black/30 p-6 rounded-2xl border border-cyan-400/10 text-gray-300">
                                No students found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto bg-black/30 rounded-2xl border border-cyan-400/10">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-white/5 text-gray-300">
                                        <tr>
                                            <th className="py-3 px-4 font-semibold">Roll No</th>
                                            <th className="py-3 px-4 font-semibold">Name</th>
                                            <th className="py-3 px-4 font-semibold">Class</th>
                                            <th className="py-3 px-4 font-semibold">Father</th>
                                            <th className="py-3 px-4 font-semibold">Phone</th>
                                            <th className="py-3 px-4 font-semibold">Contact</th>
                                            <th className="py-3 px-4 font-semibold">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredStudents.map((s) => (
                                            <tr key={s._id} className="text-gray-200">
                                                <td className="py-3 px-4 font-semibold text-white">{s.rollNo || '—'}</td>
                                                <td className="py-3 px-4">{s.stdName || '—'}</td>
                                                <td className="py-3 px-4">{s.className || '—'}</td>
                                                <td className="py-3 px-4">{s.fatherName || '—'}</td>
                                                <td className="py-3 px-4">{s.fatherPhone || '—'}</td>
                                                <td className="py-3 px-4">{s.contact || '—'}</td>
                                                <td className="py-3 px-4">{formatDate(s.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsPage;
