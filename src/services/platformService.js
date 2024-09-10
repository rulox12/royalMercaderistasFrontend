import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getPlatforms = async () => {
    try {
        const response = await axios.get(`${API_URL}/platforms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

const getPlatform = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/platforms/${id}`);
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


export { getPlatforms, createPlatform,getPlatform };
