// src/components/Reception/ReceptionStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';

const ReceptionStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get('/reception/az-students/fetch-all-students');
                setStudents(response.data.students || []);
            } catch (err) {
                console.error("Error fetching students:", err);
                alert('Failed to load students');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse">Loading students...</p>;
    }

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
                            {students.map(student => (
                                <tr key={student._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{student.rollNo}</td>
                                    <td className="p-4 text-white">{student.fullName}</td>
                                    <td className="p-4 text-gray-300">{student.className}</td>
                                    <td className="p-4 text-gray-300">{student.contact}</td>
                                    <td className="p-4">
                                        <button className="text-yellow-400 mr-4 hover:text-yellow-300 font-medium">Edit</button>
                                        <button className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReceptionStudentsPage;