import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;;

const getCities = async () => {
    try {
        const response = await axios.get(`${API_URL}/cities`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};


const createCity = async (city) => {
    try {
        const response = await axios.post(`${API_URL}/cities`, city);
        return response.data;
    } catch (error) {
        console.error('Error creating cities:', error);
        throw error;
    }
};

export { getCities, createCity };