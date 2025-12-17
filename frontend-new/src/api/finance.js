// src/api/finance.js
import axiosInstance from './axios';

export const getPendingFees = async () => {
    try {
        const response = await axiosInstance.get('/fees/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending fees:', error);
        throw error;
    }
};

export const getTotalRevenue = async () => {
    try {
        const response = await axiosInstance.get('/fees/revenue');
        return response.data;
    } catch (error) {
        console.error('Error fetching total revenue:', error);
        throw error;
    }
};

export const getAllTransactions = async () => {
    try {
        const response = await axiosInstance.get('/fees/transactions');
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};
