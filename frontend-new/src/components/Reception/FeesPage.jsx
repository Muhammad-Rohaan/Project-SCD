// src/components/Reception/FeesPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import CollectFee from './CollectFee.jsx';

const FeesPage = () => {
    const [studentsFees, setStudentsFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchAllStudentsFees();
    }, []);

    const fetchAllStudentsFees = async () => {
        try {
            // Assume backend has a route to get all students fees summary
            const res = await axiosInstance.get('/reception/fees'); // ye route bana lo backend mein
            setStudentsFees(res.data.fees || []);
        } catch (err) {
            alert('Failed to load fees data');
        } finally {
            setLoading(false);
        }
    };

    const handleCollectFee = (student) => {
        setSelectedStudent(student);
    };

    if (loading) return <p className="text-white text-center text-2xl animate-pulse">Loading fees...</p>;

    const pendingStudents = studentsFees.filter(s => s.status !== 'paid');

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Fees Management ({pendingStudents.length} Pending)
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                    <thead className="bg-indigo-900/50">
                        <tr>
                            <th className="p-4 text-cyan-300">Roll No</th>
                            <th className="p-4 text-cyan-300">Name</th>
                            <th className="p-4 text-cyan-300">Class</th>
                            <th className="p-4 text-cyan-300">Total Fee</th>
                            <th className="p-4 text-cyan-300">Paid</th>
                            <th className="p-4 text-cyan-300">Due</th>
                            <th className="p-4 text-cyan-300">Status</th>
                            <th className="p-4 text-cyan-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsFees.map(f => (
                            <tr key={f._id} className="border-t border-cyan-400/20">
                                <td className="p-4 text-white">{f.rollNo}</td>
                                <td className="p-4 text-white">{f.studentFullName}</td>
                                <td className="p-4 text-gray-300">{f.className}</td>
                                <td className="p-4 text-gray-300">Rs. {f.totalFee}</td>
                                <td className="p-4 text-gray-300">Rs. {f.paidAmount}</td>
                                <td className="p-4 text-red-400 font-bold">Rs. {f.dueAmount}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${f.status === 'paid' ? 'bg-green-600/30 text-green-300' :
                                            f.status === 'partial' ? 'bg-yellow-600/30 text-yellow-300' :
                                                'bg-red-600/30 text-red-300'
                                        }`}>
                                        {f.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleCollectFee(f)}
                                        className="text-green-400 hover:text-green-300 font-medium"
                                    >
                                        Collect Fee
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Collect Fee Modal */}
            {selectedStudent && (
                <CollectFee
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onSuccess={fetchAllStudentsFees}
                />
            )}
        </div>
    );
};

export default FeesPage;