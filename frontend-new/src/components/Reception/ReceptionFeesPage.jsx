import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ReceptionFeesPage = () => {
    const formatDateTime = (value) => {
        if (!value) return '—';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleString();
    };

    const StatusPill = ({ status }) => {
        const normalized = String(status || '').toLowerCase();
        const isPaid = normalized === 'paid';
        const label = status ? String(status) : 'Unknown';
        return (
            <span
                className={[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
                    isPaid
                        ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30'
                        : 'bg-amber-500/15 text-amber-200 border-amber-400/30'
                ].join(' ')}
            >
                {label}
            </span>
        );
    };

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
                        <div className="mt-5 space-y-3">
                            <div className="p-4 rounded-2xl border border-emerald-400/20 bg-emerald-900/10">
                                <p className="text-emerald-200 font-semibold">
                                    {collectResult.message || 'Fee collected'}
                                </p>
                            </div>

                            {collectResult.fees && (
                                <div className="bg-black/30 p-4 rounded-2xl border border-cyan-400/10">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                        <div>
                                            <p className="text-gray-100 font-semibold">
                                                {collectResult.fees.studentName || 'Student'} ({collectResult.fees.rollNo || '—'})
                                            </p>
                                            <p className="text-gray-300 text-sm">
                                                Class: {collectResult.fees.className || '—'}
                                            </p>
                                        </div>
                                        <StatusPill status={collectResult.fees.status} />
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                            <p className="text-xs text-gray-400">Period</p>
                                            <p className="text-gray-100 font-semibold">
                                                {collectResult.fees.month || '—'} {collectResult.fees.year || ''}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                            <p className="text-xs text-gray-400">Amount</p>
                                            <p className="text-gray-100 font-semibold">
                                                {typeof collectResult.fees.feesAmount === 'number' ? collectResult.fees.feesAmount : (collectResult.fees.feesAmount || '—')}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                            <p className="text-xs text-gray-400">Collected By</p>
                                            <p className="text-gray-100 font-semibold">
                                                {collectResult.fees.collectedBy || '—'}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                            <p className="text-xs text-gray-400">Collected On</p>
                                            <p className="text-gray-100 font-semibold">
                                                {formatDateTime(collectResult.fees.collectedDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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

                            <div className="bg-black/30 rounded-2xl border border-cyan-400/10 overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-white/10">
                                    <p className="text-gray-100 font-semibold">Fee Records</p>
                                    <p className="text-gray-300 text-sm">
                                        Total: {Array.isArray(statusResult.fees) ? statusResult.fees.length : 0}
                                    </p>
                                </div>

                                {Array.isArray(statusResult.fees) && statusResult.fees.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead className="bg-white/5 text-gray-300">
                                                <tr>
                                                    <th className="py-3 px-4 font-semibold">#</th>
                                                    <th className="py-3 px-4 font-semibold">Status</th>
                                                    <th className="py-3 px-4 font-semibold">Collected By</th>
                                                    <th className="py-3 px-4 font-semibold">Collected Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {statusResult.fees.map((fee, idx) => (
                                                    <tr key={`${fee.collectedDate || 'fee'}-${idx}`} className="text-gray-200">
                                                        <td className="py-3 px-4">{idx + 1}</td>
                                                        <td className="py-3 px-4">
                                                            <StatusPill status={fee.status} />
                                                        </td>
                                                        <td className="py-3 px-4">{fee.collectedBy || '—'}</td>
                                                        <td className="py-3 px-4">{formatDateTime(fee.collectedDate)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6 text-gray-300">
                                        No fee records found for this student.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionFeesPage;
