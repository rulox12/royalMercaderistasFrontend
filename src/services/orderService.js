import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getOrdersByDate = async (date, cityId) => {
    try {
        const url = `${API_URL}/big-orders/by-data-and-city?date=${date}&cityId=${cityId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export { getOrdersByDate };