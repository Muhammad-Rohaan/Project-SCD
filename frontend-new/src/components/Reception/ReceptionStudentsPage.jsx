// src/components/Reception/ReceptionStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import RegisterStudent from './RegisterStudent.jsx';

const ReceptionStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editStudent, setEditStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axiosInstance.get('/reception/az-students/fetch-all-students');
            setStudents(res.data.students || []);
        } catch (err) {
            console.error(err);
            alert('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rollNo) => {
        if (!confirm(`Delete student ${rollNo}?`)) return;
        try {
            await axiosInstance.delete(`/reception/az-students/delete-student/${rollNo}`);
            setStudents(students.filter(s => s.rollNo !== rollNo));
            alert('Student deleted successfully');
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (student) => {
        setEditStudent(student);
    };

    const handleUpdateSuccess = () => {
        setEditStudent(null);
        fetchStudents(); // refresh list
    };

    if (loading) return <p className="text-white text-center text-2xl animate-pulse">Loading...</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Registered Students ({students.length})
            </h1>

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
                                <th className="p-4 text-cyan-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{s.rollNo}</td>
                                    <td className="p-4 text-white">{s.studentFullName}</td>
                                    <td className="p-4 text-gray-300">{s.className}</td>
                                    <td className="p-4 text-gray-300">{s.contact}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(s)}
                                            className="text-yellow-400 mr-4 hover:text-yellow-300 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.rollNo)}
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

            {/* Edit Modal */}
            {editStudent && (
                <RegisterStudent
                    student={editStudent}
                    onClose={() => setEditStudent(null)}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default ReceptionStudentsPage;