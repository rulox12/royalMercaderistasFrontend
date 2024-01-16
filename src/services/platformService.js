import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getPlatforms = async () => {
    try {
        const response = await axios.get(`${API_URL}/platforms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};


const createPlatform = async (platform) => {
    try {
        const response = await axios.post(`${API_URL}/platforms`, platform);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export { getPlatforms, createPlatform };
