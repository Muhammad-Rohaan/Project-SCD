// src/pages/Teachers/AddTeacher.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerTeacher } from '../../api/admin';

const AddTeacher = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerTeacher(formData);
            navigate('/admin/teachers');
        } catch (err) {
            setError('Failed to add teacher');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Teacher</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="gender" placeholder="Gender" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} className="p-2 border rounded" />
                    <input type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="teacherRegId" placeholder="Teacher Registration ID" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="cnic" placeholder="CNIC" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="qualification" placeholder="Qualification" onChange={handleChange} className="p-2 border rounded" />
                    <input type="number" name="salary" placeholder="Salary" onChange={handleChange} className="p-2 border rounded" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Add Teacher
                </button>
            </form>
        </div>
    );
};

export default AddTeacher;
