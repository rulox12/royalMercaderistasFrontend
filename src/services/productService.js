import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};


const createProduct = async (product) => {
    try {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const updateProduct = async (productId, product) => {
    try {
        const response = await axios.put(`${API_URL}/products/${productId}`, product);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/products`, { data: { productId } });

        return response.data;
    } catch (error) {
        console.error('Error delete product:', error);
        return null;
    }
};


export { getProducts, createProduct, deleteProduct, updateProduct };
