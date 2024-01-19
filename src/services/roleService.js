import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;;

const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/roles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export { getRoles };
