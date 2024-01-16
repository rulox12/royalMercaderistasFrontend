import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
