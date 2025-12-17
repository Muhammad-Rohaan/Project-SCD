// src/pages/Receptionists/AddReceptionist.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerReceptionist } from '../../api/admin';

const AddReceptionist = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        receptionRegId: '',
        cnic: '',
        salary: '',
        joiningDate: '',
        contact: '',
        address: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerReceptionist(formData);
            navigate('/admin/receptionists');
        } catch (err) {
            setError('Failed to add receptionist');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Receptionist</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="receptionRegId" placeholder="Registration ID" onChange={handleChange} className="p-2 border rounded" required />
                    <input type="text" name="cnic" placeholder="CNIC" onChange={handleChange} className="p-2 border rounded" />
                    <input type="number" name="salary" placeholder="Salary" onChange={handleChange} className="p-2 border rounded" />
                    <input type="date" name="joiningDate" placeholder="Joining Date" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="contact" placeholder="Contact" onChange={handleChange} className="p-2 border rounded" />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} className="p-2 border rounded" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Add Receptionist
                </button>
            </form>
        </div>
    );
};

export default AddReceptionist;
