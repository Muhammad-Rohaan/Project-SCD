import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [fees, setFees] = useState(null);
    const [results, setResults] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const requests = await Promise.allSettled([
                    axiosInstance.get('/student/profile'),
                    axiosInstance.get('/student/fees'),
                    axiosInstance.get('/student/my-class-results'),
                    axiosInstance.get('/student/attendance')
                ]);

                const profileRes = requests[0].status === 'fulfilled' ? requests[0].value : null;
                const feesRes = requests[1].status === 'fulfilled' ? requests[1].value : null;
                const resultsRes = requests[2].status === 'fulfilled' ? requests[2].value : null;
                const attendanceRes = requests[3].status === 'fulfilled' ? requests[3].value : null;

                setProfile(profileRes?.data ?? null);
                setFees(feesRes?.data ?? null);
                setResults(resultsRes?.data ?? null);
                setAttendance(attendanceRes?.data ?? null);

                const rejected = requests.find(r => r.status === 'rejected');
                if (rejected) {
                    const status = rejected.reason?.response?.status;
                    if (status && status !== 404) {
                        setError(rejected.reason?.response?.data?.message || 'Failed to load some dashboard data');
                    }
                }
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
                    {profile?.user ? (
                        <div className="space-y-3 text-gray-200">
                            <div className="flex items-center justify-between gap-4 bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                <div>
                                    <div className="text-cyan-300 font-semibold">{profile.user.fullName}</div>
                                    <div className="text-gray-400 text-sm">{profile.user.email}</div>
                                </div>
                                <div className="text-sm text-gray-300">
                                    Role: <span className="text-white font-semibold">{profile.user.role}</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400 break-all">
                                ID: {profile.user._id}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">Profile data not available.</p>
                    )}
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Attendance</h2>
                    {attendance ? (
                        <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                            {JSON.stringify(attendance, null, 2)}
                        </pre>
                    ) : (
                        <p className="text-gray-300">
                            Attendance endpoint not available yet.
                        </p>
                    )}
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Fees</h2>
                    {fees?.student ? (
                        <div className="space-y-4">
                            <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                <div className="text-gray-200 font-semibold">
                                    {fees.student.name} ({fees.student.rollNo}) — {fees.student.className}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                    <div className="text-gray-400 text-sm">Total Records</div>
                                    <div className="text-white text-2xl font-extrabold">{fees.fees?.length || 0}</div>
                                </div>
                                <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                    <div className="text-gray-400 text-sm">Paid</div>
                                    <div className="text-white text-2xl font-extrabold">
                                        {(fees.fees || []).filter(f => f.status === 'paid').length}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                    <div className="text-gray-400 text-sm">Pending</div>
                                    <div className="text-white text-2xl font-extrabold">
                                        {(fees.fees || []).filter(f => f.status === 'pending').length}
                                    </div>
                                </div>
                            </div>

                            {(fees.fees || []).length === 0 ? (
                                <p className="text-gray-300">No fee records found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                                        <thead className="bg-indigo-900/50">
                                            <tr>
                                                <th className="p-4 text-cyan-300">Status</th>
                                                <th className="p-4 text-cyan-300">Collected By</th>
                                                <th className="p-4 text-cyan-300">Collected Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(fees.fees || []).map((f, idx) => (
                                                <tr key={idx} className="border-t border-cyan-400/20">
                                                    <td className="p-4 text-white">{f.status}</td>
                                                    <td className="p-4 text-gray-200">{f.collectedBy || 'N/A'}</td>
                                                    <td className="p-4 text-gray-300">
                                                        {f.collectedDate ? new Date(f.collectedDate).toLocaleString() : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-300">Fees data not available.</p>
                    )}
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
                        <p className="text-gray-300">No results uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
