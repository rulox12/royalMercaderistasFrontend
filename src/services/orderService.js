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

const getOrderByFilter = async (date, cityId, shopId) => {
  try {
    const url = `${API_URL}/orders?date=${date}&shop=${shopId}&cityId=${cityId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const getOrders = async (page, limit, selectedShopId = '') => {
  try {
    const url = `${API_URL}/orders?page=${page}&limit=${limit}&shopId=${selectedShopId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export { getOrdersByDate, getOrderByFilter, getOrders };