// src/components/Reception/RegisterStudentModal.jsx
import React, { useState } from 'react';
import axiosInstance from '../../api/axios.js';

const RegisterStudent = ({ onClose, student, onSuccess }) => {
    const isEdit = !!student;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: student?.studentFullName || '',
        email: student?.userId?.email || '',
        password: '',
        rollNo: student?.rollNo || '',
        className: student?.className || '',
        cnic: student?.cnic || '',
        contact: student?.contact || '',
        address: student?.address || '',
        age: student?.age || '',
        field: student?.field || ''
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
                password: formData.password,               // optional on edit
                rollNo: formData.rollNo.trim(),
                className: formData.className.trim(),
                cnic: formData.cnic.trim(),
                contact: formData.contact.trim(),
                address: formData.address.trim(),
                age: Number(formData.age),
                field: formData.field.trim()
            };

            if (isEdit) {
                await axiosInstance.put(
                    `/reception/az-students/update-student/${student.rollNo}`,
                    dataToSend
                );
                alert('Student updated successfully!');
            } else {
                await axiosInstance.post(
                    '/reception/az-students/admissions/register-student',
                    dataToSend
                );
                alert('Student registered successfully!');
            }

            onClose();
            if (onSuccess) onSuccess();   // refresh list
        } catch (err) {
            const msg = err.response?.data?.message || 'Operation failed';
            alert('Error: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl border border-cyan-400/40 p-8 w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
                    {isEdit ? 'Edit Student' : 'Register New Student'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" />
                    <input name="password" type="password" placeholder={isEdit ? "Leave blank to keep" : "Password"} value={formData.password} onChange={handleChange} className="input-style" />
                    <input name="rollNo" type="text" required placeholder="Roll No" value={formData.rollNo} onChange={handleChange} className="input-style" />
                    <input name="className" type="text" required placeholder="Class" value={formData.className} onChange={handleChange} className="input-style" />
                    <input name="cnic" type="text" required placeholder="CNIC" value={formData.cnic} onChange={handleChange} className="input-style" />
                    <input name="contact" type="text" required placeholder="Contact" value={formData.contact} onChange={handleChange} className="input-style" />
                    <input name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style" />
                    <input name="age" type="number" required placeholder="Age" value={formData.age} onChange={handleChange} className="input-style" />
                    <input name="field" type="text" required placeholder="Field" value={formData.field} onChange={handleChange} className="input-style" />

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Processing...' : (isEdit ? 'Update Student' : 'Register Student')}
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