// src/pages/Students/EditStudent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, fetchStudentById } from '../../api/admin';

const EditStudent = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        rollNo: '',
        fatherName: '',
        fatherPhone: '',
        contact: '',
        address: '',
        age: '',
        className: '',
        field: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { studentRegId } = useParams();

    useEffect(() => {
        const getStudent = async () => {
            try {
                const data = await fetchStudentById(studentRegId);
                const student = data.student;
                if (student) {
                    setFormData({
                        fullName: student.stdName,
                        email: student.userId.email,
                        rollNo: student.rollNo,
                        fatherName: student.fatherName,
                        fatherPhone: student.fatherPhone,
                        contact: student.contact,
                        address: student.address,
                        age: student.age,
                        className: student.className,
                        field: student.field,
                    });
                }
            } catch (err) {
                setError('Failed to fetch student data');
            }
        };
        getStudent();
    }, [studentRegId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateStudent(studentRegId, formData);
            navigate('/admin/students');
        } catch (err) {
            setError('Failed to update student');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Student</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} className="p-2 border rounded" required disabled />
                    <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="fatherPhone" placeholder="Father's Phone" value={formData.fatherPhone} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="className" placeholder="Class" value={formData.className} onChange={handleChange} className="p-2 border rounded" required />
                    <select name="field" value={formData.field} onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Select Field</option>
                        <option value="cs">CS</option>
                        <option value="medical">Medical</option>
                        <option value="engineering">Engineering</option>
                        <option value="commerce">Commerce</option>
                        <option value="arts">Arts</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Update Student
                </button>
            </form>
        </div>
    );
};

export default EditStudent;
