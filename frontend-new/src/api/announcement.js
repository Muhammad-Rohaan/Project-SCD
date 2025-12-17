// src/api/announcement.js
import axiosInstance from './axios';

export const createAnnouncement = async (announcementData) => {
    try {
        const response = await axiosInstance.post('/announcements', announcementData);
        return response.data;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw error;
    }
};

export const getAnnouncements = async () => {
    try {
        const response = await axiosInstance.get('/announcements');
        return response.data;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
};

export const deleteAnnouncement = async (id) => {
    try {
        const response = await axiosInstance.delete(`/announcements/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error;
    }
};
