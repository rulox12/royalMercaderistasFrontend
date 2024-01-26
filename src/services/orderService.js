import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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