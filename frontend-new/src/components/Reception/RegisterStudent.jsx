// src/components/Reception/RegisterStudentModal.jsx

import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const RegisterStudent = ({ onClose }) => {
    const [loading, setLoading] = useState(false);

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
        field: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                rollNo: formData.rollNo.trim(),
                fatherName: formData.fatherName.trim() || 'N/A',
                fatherPhone: formData.fatherPhone.trim(),
                contact: formData.contact.trim(),
                address: formData.address.trim(),
                age: Number(formData.age),
                className: formData.className.trim(),
                field: formData.field.trim()
            };

            const response = await axiosInstance.post('/reception/az-students/admissions/register-student', dataToSend);

            alert(response.data.message || "Student registered successfully!");
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            alert('Error: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl border border-cyan-400/40 p-8 w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
                    Register New Student
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" />
                    <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" />
                    <input name="rollNo" type="text" required placeholder="Roll No (e.g. 11A-04)" value={formData.rollNo} onChange={handleChange} className="input-style" />
                    <input name="fatherName" type="text" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} className="input-style" />
                    <input name="fatherPhone" type="text" placeholder="Father Phone" value={formData.fatherPhone} onChange={handleChange} className="input-style" />
                    <input name="contact" type="text" placeholder="Student Contact" value={formData.contact} onChange={handleChange} className="input-style" />
                    <input name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style" />
                    <input name="age" type="number" required placeholder="Age" value={formData.age} onChange={handleChange} className="input-style" />
                    <input name="className" type="text" required placeholder="Class (e.g. 11)" value={formData.className} onChange={handleChange} className="input-style" />
                    {/* Field Dropdown - Ye purana input hata do aur ye daal do */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Field <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="field"
                            required
                            value={formData.field}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-indigo-900 text-white border border-cyan-400/30 rounded-2xl focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none backdrop-blur-md transition-all"
                        >
                            <option value="">-- Select Field --</option>
                            <option value="cs">Computer Science (CS)</option>
                            <option value="medical">Pre-Medical</option>
                            <option value="engineering">Pre-Engineering</option>
                            <option value="commerce">Commerce</option>
                            <option value="arts">Arts</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Registering...' : 'Register Student'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterStudent;