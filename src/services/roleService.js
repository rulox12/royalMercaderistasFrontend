import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/roles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

const createRole = async (role) => {
    try {
        const response = await axios.post(`${API_URL}/roles/create`, role);
        return response.data;
    } catch (error) {
        console.error('Error creating rol:', error);
        throw error;
    }
};


export { getRoles, createRole };
