// src/components/Admin/ReceptionistsPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import RegisterReceptionist from '../../components/Admin/RegisterReceptionist.jsx'; // Modal for register and edit

const ReceptionistsPage = () => {
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            const response = await axiosInstance.get('/admin/az-reception/fetch-all-receptionists');
            setReceptionists(response.data.receptionists || []);
        } catch (err) {
            console.error("Error fetching receptionists:", err);
            alert('Failed to load receptionists');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (receptionRegId) => {
        if (!confirm(`Are you sure you want to delete receptionist ${receptionRegId}?`)) return;

        try {
            // Ye line change kar do — /api add karo
            await axiosInstance.delete(`/admin/az-reception/delete-receptionist/${receptionRegId}`);

            setReceptionists(receptionists.filter(r => r.receptionRegId !== receptionRegId));
            alert('Receptionist deleted successfully!');
        } catch (err) {
            console.error("Delete error:", err);
            const msg = err.response?.data?.msg || 'Delete failed';
            alert('Error: ' + msg);
        }
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
        fetchReceptionists();
    };

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse">Loading receptionists...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    AZ Receptionists ({receptionists.length})
                </h1>

                <button
                    onClick={() => setShowRegister(true)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-600 hover:to-cyan-600 text-white font-bold transition shadow-lg"
                >
                    + Register Receptionist
                </button>
            </div>

            {receptionists.length === 0 ? (
                <p className="text-center text-gray-400 text-xl py-10">No receptionists registered yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                        <thead className="bg-indigo-900/50">
                            <tr>
                                <th className="p-4 text-cyan-300">Reg ID</th>
                                <th className="p-4 text-cyan-300">Name</th>
                                <th className="p-4 text-cyan-300">Email</th>
                                <th className="p-4 text-cyan-300">Salary</th>
                                <th className="p-4 text-cyan-300">Contact</th>
                                <th className="p-4 text-cyan-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receptionists.map(rec => (
                                <tr key={rec._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{rec.receptionRegId}</td>
                                    <td className="p-4 text-white">{rec.receptionistFullName}</td>
                                    <td className="p-4 text-gray-300">{rec.userId?.email || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">Rs.{rec.salary?.toLocaleString()}</td>
                                    <td className="p-4 text-gray-300">{rec.contact}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(rec.receptionRegId)}
                                            className="text-red-400 hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showRegister && (
                <RegisterReceptionist
                    onClose={() => setShowRegister(false)}
                    onSuccess={handleRegisterSuccess}
                />
            )}
        </div>
    );
};

export default ReceptionistsPage;
