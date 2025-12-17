// src/pages/Announcement/ListAnnouncements.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements, deleteAnnouncement } from '../../api/announcement';
import { useAuth } from '../../context/AuthContext';

const ListAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data.announcements);
            } catch (err) {
                setError('Failed to fetch announcements');
            }
        };
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteAnnouncement(id);
            setAnnouncements(announcements.filter(announcement => announcement._id !== id));
        } catch (err) {
            setError('Failed to delete announcement');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Announcements</h1>
            {auth.user && (auth.user.role === 'admin' || auth.user.role === 'teacher' || auth.user.role === 'receptionist') && (
                <Link to="/admin/announcements/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                    Create Announcement
                </Link>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.map(announcement => (
                    <div key={announcement._id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-bold">{announcement.title}</h2>
                        <p className="text-gray-700">{announcement.content}</p>
                        <p className="text-sm text-gray-500 mt-2">By: {announcement.author.name}</p>
                        <p className="text-sm text-gray-500">For: {announcement.role.join(', ')}</p>
                        {auth.user && auth.user.role === 'admin' && (
                            <button onClick={() => handleDelete(announcement._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2">
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListAnnouncements;
