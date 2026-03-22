// src/components/Reception/ReceptionStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import RegisterStudent from './RegisterStudent.jsx';
import EditStudent from './EditStudent.jsx';

const ReceptionStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [editStudent, setEditStudent] = useState(null);

    const [rollNoQuery, setRollNoQuery] = useState('');
    const [classQuery, setClassQuery] = useState('');

    useEffect(() => {
        refreshAll();
    }, []);

    const refreshAll = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/reception/az-students/fetch-all-students');
            setStudents(response.data.students || []);
        } catch {
            alert('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const searchByRollNo = async () => {
        const q = rollNoQuery.trim();
        if (!q) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reception/az-students/fetch-student-by-rollno/${encodeURIComponent(q)}`);
            setStudents(res.data.student ? [res.data.student] : []);
        } catch (err) {
            alert(err.response?.data?.message || 'Student not found');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const searchByClass = async () => {
        const q = classQuery.trim();
        if (!q) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reception/az-students/fetch-students-by-class/${encodeURIComponent(q)}`);
            setStudents(res.data.students || []);
        } catch (err) {
            alert(err.response?.data?.message || 'No students found');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rollNo) => {
        if (!confirm(`Delete student ${rollNo}?`)) return;
        try {
            await axiosInstance.delete(`/reception/az-students/delete-student/${encodeURIComponent(rollNo)}`);
            setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse">Loading students...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Registered Students ({students.length})
                </h1>

                <button
                    onClick={() => setShowRegister(true)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-600 hover:to-cyan-600 text-white font-bold transition shadow-lg"
                >
                    + Register Student
                </button>
            </div>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6 space-y-4">
                <h3 className="text-xl font-semibold text-cyan-300">Search</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">By Roll No</label>
                        <input
                            value={rollNoQuery}
                            onChange={(e) => setRollNoQuery(e.target.value)}
                            className="input-style w-full"
                            placeholder="e.g. 11A-04"
                        />
                        <button
                            onClick={searchByRollNo}
                            className="w-full py-3 bg-indigo-800/60 rounded-xl text-white hover:bg-indigo-800 transition"
                        >
                            Search
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">By Class</label>
                        <input
                            value={classQuery}
                            onChange={(e) => setClassQuery(e.target.value)}
                            className="input-style w-full"
                            placeholder="e.g. 11"
                        />
                        <button
                            onClick={searchByClass}
                            className="w-full py-3 bg-indigo-800/60 rounded-xl text-white hover:bg-indigo-800 transition"
                        >
                            Filter
                        </button>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setRollNoQuery('');
                                setClassQuery('');
                                refreshAll();
                            }}
                            className="w-full py-3 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {students.length === 0 ? (
                <p className="text-center text-gray-400 text-xl py-10">No students registered yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                        <thead className="bg-indigo-900/50">
                            <tr>
                                <th className="p-4 text-cyan-300">Roll No</th>
                                <th className="p-4 text-cyan-300">Name</th>
                                <th className="p-4 text-cyan-300">Class</th>
                                <th className="p-4 text-cyan-300">Contact</th>
                                <th className="p-4 text-cyan-300">Status</th>
                                <th className="p-4 text-cyan-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{student.rollNo}</td>
                                    <td className="p-4 text-white">{student.stdName || student.userId?.fullName || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">{student.className}</td>
                                    <td className="p-4 text-gray-300">{student.contact || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">{student.userId?.isActive === false ? 'Inactive' : 'Active'}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setEditStudent(student)}
                                            className="text-yellow-400 mr-4 hover:text-yellow-300 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.rollNo)}
                                            className="text-red-400 hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showRegister && (
                <RegisterStudent
                    onClose={() => setShowRegister(false)}
                    onSuccess={refreshAll}
                />
            )}

            {editStudent && (
                <EditStudent
                    student={editStudent}
                    onClose={() => setEditStudent(null)}
                    onSuccess={refreshAll}
                />
            )}
        </div>
    );
};

export default ReceptionStudentsPage;
