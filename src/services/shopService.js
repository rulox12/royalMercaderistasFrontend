import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;;

const getShops = async () => {
    try {
        const response = await axios.get(`${API_URL}/shops`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
    }
};


const createShop = async (shop) => {
    try {
        const response = await axios.post(`${API_URL}/shops`, shop);
        return response.data;
    } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
    }
};

export { getShops, createShop };
