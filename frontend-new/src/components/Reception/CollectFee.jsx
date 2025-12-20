// src/components/Reception/CollectFeeModal.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';

const CollectFee = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [student, setStudent] = useState(null);

    const [formData, setFormData] = useState({
        rollNo: '',
        month: '',
        year: new Date().getFullYear(),
        feesAmount: '',
        collectedBy: '' // receptionist name — backend se le sakte ho ya manual
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = months[new Date().getMonth()];

    useEffect(() => {
        setFormData(prev => ({ ...prev, month: currentMonth }));
    }, []);

    const searchStudent = async () => {
        if (!formData.rollNo.trim()) {
            alert('Please enter Roll No');
            return;
        }

        setSearchLoading(true);
        try {
            const res = await axiosInstance.get(`/reception/az-students/fetch-student-by-rollNo/${formData.rollNo.trim().toUpperCase()}`);
            if (res.data.student) {
                setStudent(res.data.student);
            } else {
                alert('Student not found');
                setStudent(null);
            }
        } catch (err) {
            alert('Student not found or error');
            setStudent(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student) {
            alert('Please search and select a student first');
            return;
        }

        setLoading(true);
        try {
            const dataToSend = {
                stdId: student._id,
                rollNo: student.rollNo,
                studentName: student.studentFullName,
                className: student.className,
                month: formData.month,
                year: Number(formData.year),
                feesAmount: Number(formData.feesAmount),
                collectedBy: formData.collectedBy || 'Receptionist' // ya auth.user se le lo
            };

            await axiosInstance.post('/reception/fees/collect', dataToSend);

            alert('Fee collected successfully!');
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || 'Failed to collect fee'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl border border-cyan-400/40 p-8 w-full max-w-4xl my-8 shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
                    Collect Monthly Fee
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Roll No Search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Enter Roll No"
                            value={formData.rollNo}
                            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                            className="input-style"
                        />
                        <button
                            type="button"
                            onClick={searchStudent}
                            disabled={searchLoading}
                            className="py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                        >
                            {searchLoading ? 'Searching...' : 'Search Student'}
                        </button>
                    </div>

                    {/* Student Details (Auto Fill) */}
                    {student && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-900/50 rounded-2xl border border-cyan-400/30">
                            <div>
                                <p className="text-sm text-gray-400">Name</p>
                                <p className="text-xl text-white font-bold">{student.studentFullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Class</p>
                                <p className="text-xl text-white font-bold">{student.className}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Roll No</p>
                                <p className="text-xl text-white font-bold">{student.rollNo}</p>
                            </div>
                        </div>
                    )}

                    {/* Fee Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Month</label>
                            <select
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                required
                                className="input-style"
                            >
                                {months.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                required
                                className="input-style"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Fee Amount</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={formData.feesAmount}
                                onChange={(e) => setFormData({ ...formData, feesAmount: e.target.value })}
                                required
                                className="input-style"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Collected By (Optional)</label>
                        <input
                            type="text"
                            placeholder="Receptionist name"
                            value={formData.collectedBy}
                            onChange={(e) => setFormData({ ...formData, collectedBy: e.target.value })}
                            className="input-style"
                        />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading || !student}
                            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white font-bold hover:shadow-lg transition disabled:opacity-50"
                        >
                            {loading ? 'Collecting...' : 'Collect Fee'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectFee;