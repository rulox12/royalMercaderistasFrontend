import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getOrdersByDate = async (date) => {
    try {
        const response = await axios.post(`${API_URL}/orders/get-orders-by-date`, { date });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export { getOrdersByDate };