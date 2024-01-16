import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getLists = async () => {
    try {
        const response = await axios.get(`${API_URL}/lists`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lists:', error);
        throw error;
    }
};

const createList = async (list) => {
    try {
        const response = await axios.post(`${API_URL}/lists`, list);
        return response.data;
    } catch (error) {
        console.error('Error creating list:', error);
        throw error;
    }
};

const createListProduct = async (listId, products) => {
    try {
        const response = await axios.post(`${API_URL}/lists/products`, { listId, products });
        return response.data;
    } catch (error) {
        console.error('Error creating list:', error);
        throw error;
    }
};

const getAllProductsForListId = async (listId) => {
    try {
        const response = await axios.get(`${API_URL}/lists/products/${listId}/true`);
        return response.data;
    } catch (error) {
        console.error('Error creating list:', error);
        throw error;
    }
};

export { getLists, createList, createListProduct, getAllProductsForListId };
