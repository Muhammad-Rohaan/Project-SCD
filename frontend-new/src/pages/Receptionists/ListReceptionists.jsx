// src/pages/Receptionists/ListReceptionists.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllReceptionists, deleteReceptionist } from '../../api/admin';

const ListReceptionists = () => {
    const [receptionists, setReceptionists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReceptionists = async () => {
            try {
                const data = await fetchAllReceptionists();
                setReceptionists(data.receptionists);
            } catch (err) {
                setError('Failed to fetch receptionists');
            }
        };
        getReceptionists();
    }, []);

    const handleDelete = async (receptionistRegId) => {
        try {
            await deleteReceptionist(receptionistRegId);
            setReceptionists(receptionists.filter(receptionist => receptionist.receptionRegId !== receptionistRegId));
        } catch (err) {
            setError('Failed to delete receptionist');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Receptionists</h1>
            <Link to="/admin/receptionists/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Add Receptionist
            </Link>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Registration ID</th>
                        <th className="py-2 px-4 border-b">Contact</th>
                        <th className="py-2 px-4 border-b">Joining Date</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {receptionists.map(receptionist => (
                        <tr key={receptionist._id}>
                            <td className="py-2 px-4 border-b">{receptionist.receptionistFullName}</td>
                            <td className="py-2 px-4 border-b">{receptionist.receptionRegId}</td>
                            <td className="py-2 px-4 border-b">{receptionist.contact}</td>
                            <td className="py-2 px-4 border-b">{new Date(receptionist.joiningDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => handleDelete(receptionist.receptionRegId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
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

export default ListReceptionists;
