import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getBigOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/big-orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

const getBigOrder = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/big-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

const createBigOrder = async (params) => {
    try {
        const response = await axios.post(`${API_URL}/big-orders`, params);
        return response.data;
    } catch (error) {
        console.error('Error creating cities:', error);
        throw error;
    }
};

const updateBigOrder = async (params) => {
    try {
        const response = await axios.put(`${API_URL}/big-orders`, params);
        return response.data;
    } catch (error) {
        console.error('Error creating cities:', error);
        throw error;
    }
};

export { getBigOrders, createBigOrder, getBigOrder, updateBigOrder };
