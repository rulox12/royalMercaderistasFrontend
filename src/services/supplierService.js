import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getSuppliers = async () => {
    try {
        const response = await axios.get(`${API_URL}/suppliers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

const createSupplier = async (supplier) => {
    try {
        const response = await axios.post(`${API_URL}/suppliers`, supplier);
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

const deleteSupplier = async (supplierId) => {
    try {
        const response = await axios.delete(`${API_URL}/suppliers`, { data: { supplierId } });

        return response.data;
    } catch (error) {
        console.error('Error delete supplier:', error);
        throw error;
    }
};



export { getSuppliers, createSupplier, deleteSupplier };
