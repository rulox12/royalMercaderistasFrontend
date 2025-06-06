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

const getOrders = async (page, limit, selectedShopId, selectedCityId, selectedPlatformId) => {
  try {
    const params = new URLSearchParams({ page, limit });

    if (selectedShopId) params.append('shopId', selectedShopId);
    if (selectedCityId) params.append('cityId', selectedCityId);
    if (selectedPlatformId) params.append('platform', selectedPlatformId);

    const url = `${API_URL}/orders?${params.toString()}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const getUnregisteredOrders = async (date) => {
  try {
    const url = `${API_URL}/orders/not-received/${date}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching unregistered orders:', error);
    throw error;
  }
};

const getUnregisteredOrdersByShopAndRange = async (shopId, startDate, endDate) => {
  try {
    const url = `${API_URL}/orders/not-received/shop/${shopId}/from/${startDate}/to/${endDate}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching unregistered orders by shop and range:', error);
    throw error;
  }
};

export { getOrdersByDate, getOrderByFilter, getOrders, getUnregisteredOrders, getUnregisteredOrdersByShopAndRange };