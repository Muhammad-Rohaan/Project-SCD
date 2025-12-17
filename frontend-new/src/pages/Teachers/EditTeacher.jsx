// src/pages/Teachers/EditTeacher.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTeacher, fetchAllTeachers } from '../../api/admin';

const EditTeacher = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        dob: '',
        teacherRegId: '',
        fatherName: '',
        cnic: '',
        qualification: '',
        salary: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { teacherRegId } = useParams();

    useEffect(() => {
        const getTeacher = async () => {
            try {
                const data = await fetchAllTeachers();
                const teacher = data.teachers.find(t => t.teacherRegId === teacherRegId);
                if (teacher) {
                    setFormData({
                        name: teacher.user.name,
                        email: teacher.user.email,
                        phone: teacher.profile.phone,
                        gender: teacher.profile.gender,
                        address: teacher.profile.address,
                        dob: new Date(teacher.profile.dob).toISOString().split('T')[0],
                        teacherRegId: teacher.teacherRegId,
                        fatherName: teacher.profile.fatherName,
                        cnic: teacher.profile.cnic,
                        qualification: teacher.profile.qualification,
                        salary: teacher.profile.salary,
                    });
                }
            } catch (err) {
                setError('Failed to fetch teacher data');
            }
        };
        getTeacher();
    }, [teacherRegId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTeacher(teacherRegId, formData);
            navigate('/admin/teachers');
        } catch (err) {
            setError('Failed to update teacher');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" />
                    <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="teacherRegId" placeholder="Teacher Registration ID" value={formData.teacherRegId} onChange={handleChange} className="p-2 border rounded" required disabled />
                    <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="cnic" placeholder="CNIC" value={formData.cnic} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="p-2 border rounded" />
                    <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="p-2 border rounded" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Update Teacher
                </button>
            </form>
        </div>
    );
};

export default EditTeacher;
