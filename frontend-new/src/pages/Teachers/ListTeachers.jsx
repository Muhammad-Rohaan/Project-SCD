// src/pages/Teachers/ListTeachers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllTeachers, deleteTeacher } from '../../api/admin';

const ListTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTeachers = async () => {
            try {
                const data = await fetchAllTeachers();
                setTeachers(data.teachers);
            } catch (err) {
                setError('Failed to fetch teachers');
            }
        };
        getTeachers();
    }, []);

    const handleDelete = async (teacherRegId) => {
        try {
            await deleteTeacher(teacherRegId);
            setTeachers(teachers.filter(teacher => teacher.teacherRegId !== teacherRegId));
        } catch (err) {
            setError('Failed to delete teacher');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Teachers</h1>
            <Link to="/admin/teachers/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Add Teacher
            </Link>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Registration ID</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td className="py-2 px-4 border-b">{teacher.user.name}</td>
                            <td className="py-2 px-4 border-b">{teacher.user.email}</td>
                            <td className="py-2 px-4 border-b">{teacher.teacherRegId}</td>
                            <td className="py-2 px-4 border-b">
                                <Link to={`/admin/teachers/edit/${teacher.teacherRegId}`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(teacher.teacherRegId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
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

export default ListTeachers;
