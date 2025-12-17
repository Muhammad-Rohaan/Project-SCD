// src/pages/Students/AddStudent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../api/admin';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerStudent(formData);
            navigate('/admin/students');
        } catch (err) {
            setError('Failed to add student');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Student</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="rollNo" placeholder="Roll No" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="fatherPhone" placeholder="Father's Phone" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="contact" placeholder="Contact" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="number" name="age" placeholder="Age" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="className" placeholder="Class" onChange={handleChange} className="p-2 border rounded" required />
                    <select name="field" onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Select Field</option>
                        <option value="cs">CS</option>
                        <option value="medical">Medical</option>
                        <option value="engineering">Engineering</option>
                        <option value="commerce">Commerce</option>
                        <option value="arts">Arts</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Add Student
                </button>
            </form>
        </div>
    );
};

export default AddStudent;
