// src/components/Admin/RegisterReceptionistModal.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios.js';

const RegisterReceptionist = ({ onClose, receptionist, onSuccess }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: receptionist?.receptionistFullName || '',
        email: receptionist?.userId?.email || '',
        password: '',
        receptionRegId: receptionist?.receptionRegId || '',
        cnic: receptionist?.cnic || '',
        salary: receptionist?.salary || '',
        joiningDate: receptionist?.joiningDate?.slice(0, 10) || '',
        contact: receptionist?.contact || '',
        address: receptionist?.address || ''
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
                receptionRegId: formData.receptionRegId.trim(),
                cnic: formData.cnic.trim(),
                salary: Number(formData.salary),
                joiningDate: formData.joiningDate,
                contact: formData.contact.trim(),
                address: formData.address.trim()
            };

            const response = await axiosInstance.post('/admin/az-reception/register-receptionist', dataToSend);

            alert(response.data.message || "Receptionist registered successfully!");
            onSuccess(); // List refresh
            onClose(); // Modal band
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            alert('Error: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl border border-cyan-400/40 p-8 w-full max-w-3xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
                    Register New Receptionist
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" />
                    <input name="receptionRegId" type="text" required placeholder="Reg ID (e.g. USMN456)" value={formData.receptionRegId} onChange={handleChange} className="input-style" />
                    <input name="cnic" type="text" required placeholder="CNIC (xxxxx-xxxxxxx-x)" value={formData.cnic} onChange={handleChange} className="input-style" />
                    <input name="salary" type="number" required placeholder="Salary" value={formData.salary} onChange={handleChange} className="input-style" />
                    <input name="joiningDate" type="date" required value={formData.joiningDate} onChange={handleChange} className="input-style" />
                    <input name="contact" type="text" required placeholder="Contact" value={formData.contact} onChange={handleChange} className="input-style" />
                    <input name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style" />

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Registering...' : 'Register Receptionist'}
                        </button>
                        <button type="button" onClick={handleCancel} className="flex-1 py-4 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterReceptionist;