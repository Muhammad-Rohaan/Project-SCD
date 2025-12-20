import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [fees, setFees] = useState(null);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [p, a, f, r] = await Promise.all([
                    axiosInstance.get('/student/profile'),
                    axiosInstance.get('/student/attendance'),
                    axiosInstance.get('/student/fees'),
                    axiosInstance.get('/teacher/my-class-results')
                ]);
                setProfile(p.data);
                setAttendance(a.data);
                setFees(f.data);
                setResults(r.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load student dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse">Loading dashboard…</p>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Student Dashboard
            </h1>

            {error && (
                <div className="p-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/40">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Profile</h2>
                    <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                        {JSON.stringify(profile, null, 2)}
                    </pre>
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Attendance</h2>
                    <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                        {JSON.stringify(attendance, null, 2)}
                    </pre>
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Fees</h2>
                    <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                        {JSON.stringify(fees, null, 2)}
                    </pre>
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Results</h2>
                    {results?.results?.length ? (
                        <div className="space-y-4">
                            <div className="text-gray-200 font-semibold">
                                Class: {results.className} • Total: {results.totalResults}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.results.map((r, idx) => (
                                    <a
                                        key={`${r.testName}-${idx}`}
                                        href={r.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block bg-black/30 p-4 rounded-2xl border border-cyan-400/10 hover:border-cyan-400/30 transition"
                                    >
                                        <div className="text-cyan-300 font-semibold">{r.testName}</div>
                                        <div className="text-gray-400 text-sm break-all">{r.imageUrl}</div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
