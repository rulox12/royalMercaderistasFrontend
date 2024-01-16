import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

const createBigOrder = async (date) => {
    try {
        const response = await axios.post(`${API_URL}/big-orders`, date);
        return response.data;
    } catch (error) {
        console.error('Error creating cities:', error);
        throw error;
    }
};

export { getBigOrders, createBigOrder, getBigOrder };
