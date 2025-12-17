// src/pages/Students/ListStudents.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllStudents, deleteStudent } from '../../api/admin';

const ListStudents = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const data = await fetchAllStudents();
                setStudents(data.students);
            } catch (err) {
                setError('Failed to fetch students');
            }
        };
        getStudents();
    }, []);

    const handleDelete = async (studentRegId) => {
        try {
            await deleteStudent(studentRegId);
            setStudents(students.filter(student => student.rollNo !== studentRegId));
        } catch (err) {
            setError('Failed to delete student');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Students</h1>
            <Link to="/admin/students/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Add Student
            </Link>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Roll No</th>
                        <th className="py-2 px-4 border-b">Class</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td className="py-2 px-4 border-b">{student.stdName}</td>
                            <td className="py-2 px-4 border-b">{student.userId.email}</td>
                            <td className="py-2 px-4 border-b">{student.rollNo}</td>
                            <td className="py-2 px-4 border-b">{student.className}</td>
                            <td className="py-2 px-4 border-b">
                                <Link to={`/admin/students/edit/${student.rollNo}`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(student.rollNo)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListStudents;
