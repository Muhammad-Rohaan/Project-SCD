export const fetchAllReceptionists = async () => {
    try {
        const response = await axiosInstance.get('/admin/az-reception/fetch-all-receptionists');
        return response.data;
    } catch (error) {
        console.error('Error fetching receptionists:', error);
        throw error;
    }
};

export const registerReceptionist = async (receptionistData) => {
    try {
        const response = await axiosInstance.post('/admin/az-reception/register-receptionist', receptionistData);
        return response.data;
    } catch (error) {
        console.error('Error registering receptionist:', error);
        throw error;
    }
};

export const deleteReceptionist = async (receptionistRegId) => {
    try {
        const response = await axiosInstance.delete(`/admin/az-reception/delete-receptionist/${receptionistRegId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting receptionist:', error);
        throw error;
    }
};