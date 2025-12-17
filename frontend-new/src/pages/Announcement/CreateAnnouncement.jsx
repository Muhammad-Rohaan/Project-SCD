// src/pages/Announcement/CreateAnnouncement.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncement } from '../../api/announcement';

const CreateAnnouncement = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        role: [],
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (e) => {
        const { options } = e.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAnnouncement(formData);
            navigate('/admin/announcements');
        } catch (err) {
            setError('Failed to create announcement');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Announcement</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                    <input type="text" name="title" id="title" onChange={handleChange} className="p-2 border rounded w-full" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                    <textarea name="content" id="content" onChange={handleChange} className="p-2 border rounded w-full" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Visible to</label>
                    <select multiple name="role" id="role" onChange={handleRoleChange} className="p-2 border rounded w-full" required>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Announcement
                </button>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
