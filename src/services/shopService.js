import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getShops = async (params) => {
    try {
        const response = await axios.get(`${API_URL}/shops`, { params });
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

const updateShop = async (shopId, shop) => {
    try {
        const response = await axios.put(`${API_URL}/shops/${shopId}`, shop);
        return response.data;
    } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
    }
};


const deleteShop = async (shopId) => {
    try {
        const response = await axios.delete(`${API_URL}/shops`, { data: { shopId } });

        return response.data;
    } catch (error) {
        console.error('Error delete shop:', error);
        throw error;
    }
};



export { getShops, createShop, updateShop, deleteShop };
