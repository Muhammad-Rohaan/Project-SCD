import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const ReceptionAttendancePage = () => {
    const [form, setForm] = useState({ rollNo: '', status: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await axiosInstance.post('/reception/attendance/markAttendance', {
                rollNo: form.rollNo.trim(),
                status: form.status
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Attendance
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6 max-w-3xl">
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Mark Attendance</h2>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="rollNo"
                        value={form.rollNo}
                        onChange={handleChange}
                        className="input-style w-full"
                        placeholder="Roll No"
                        required
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input-style w-full"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                    >
                        {loading ? 'Processing…' : 'Mark Attendance'}
                    </button>
                </form>

                {result && (
                    <pre className="mt-5 text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ReceptionAttendancePage;
