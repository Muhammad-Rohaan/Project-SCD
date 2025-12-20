import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ReceptionFeesPage = () => {
    const [collectForm, setCollectForm] = useState({
        rollNo: '',
        month: '',
        year: new Date().getFullYear(),
        feesAmount: ''
    });
    const [collectLoading, setCollectLoading] = useState(false);
    const [collectResult, setCollectResult] = useState(null);
    const [collectError, setCollectError] = useState('');

    const [statusRollNo, setStatusRollNo] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusResult, setStatusResult] = useState(null);
    const [statusError, setStatusError] = useState('');

    const onCollectChange = (e) => {
        const { name, value } = e.target;
        setCollectForm(prev => ({ ...prev, [name]: value }));
    };

    const submitCollect = async (e) => {
        e.preventDefault();
        setCollectLoading(true);
        setCollectError('');
        setCollectResult(null);

        try {
            const res = await axiosInstance.post('/reception/fees/collect', {
                rollNo: collectForm.rollNo.trim(),
                month: collectForm.month,
                year: Number(collectForm.year),
                feesAmount: Number(collectForm.feesAmount)
            });
            setCollectResult(res.data);
        } catch (err) {
            setCollectError(err.response?.data?.message || 'Fee collection failed');
        } finally {
            setCollectLoading(false);
        }
    };

    const fetchStatus = async (e) => {
        e.preventDefault();
        setStatusLoading(true);
        setStatusError('');
        setStatusResult(null);

        try {
            const res = await axiosInstance.get(`/reception/fees/student/${encodeURIComponent(statusRollNo.trim())}`);
            setStatusResult(res.data);
        } catch (err) {
            setStatusError(err.response?.data?.message || 'Failed to fetch fee status');
        } finally {
            setStatusLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Fees
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Collect Fee</h2>

                    {collectError && (
                        <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30">
                            {collectError}
                        </div>
                    )}

                    <form onSubmit={submitCollect} className="space-y-4">
                        <input
                            name="rollNo"
                            value={collectForm.rollNo}
                            onChange={onCollectChange}
                            className="input-style w-full"
                            placeholder="Roll No (e.g. 11A-04)"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="month"
                                value={collectForm.month}
                                onChange={onCollectChange}
                                className="input-style w-full"
                                required
                            >
                                <option value="">Select Month</option>
                                {months.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>

                            <input
                                name="year"
                                type="number"
                                value={collectForm.year}
                                onChange={onCollectChange}
                                className="input-style w-full"
                                placeholder="Year"
                                required
                            />
                        </div>

                        <input
                            name="feesAmount"
                            type="number"
                            value={collectForm.feesAmount}
                            onChange={onCollectChange}
                            className="input-style w-full"
                            placeholder="Amount"
                            required
                        />

                        <button
                            type="submit"
                            disabled={collectLoading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                        >
                            {collectLoading ? 'Processing…' : 'Collect Fee'}
                        </button>
                    </form>

                    {collectResult && (
                        <pre className="mt-5 text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                            {JSON.stringify(collectResult, null, 2)}
                        </pre>
                    )}
                </div>

                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Student Fee Status</h2>

                    {statusError && (
                        <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30">
                            {statusError}
                        </div>
                    )}

                    <form onSubmit={fetchStatus} className="flex flex-col md:flex-row gap-4">
                        <input
                            value={statusRollNo}
                            onChange={(e) => setStatusRollNo(e.target.value)}
                            className="input-style w-full"
                            placeholder="Roll No"
                            required
                        />
                        <button
                            type="submit"
                            disabled={statusLoading}
                            className="py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                        >
                            {statusLoading ? 'Loading…' : 'Check'}
                        </button>
                    </form>

                    {statusResult && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                <p className="text-gray-200 font-semibold">
                                    {statusResult.student?.name} ({statusResult.student?.rollNo}) — {statusResult.student?.className}
                                </p>
                            </div>
                            <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                                {JSON.stringify(statusResult, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionFeesPage;
