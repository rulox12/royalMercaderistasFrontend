import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

const createCategory = async (category) => {
  const response = await axios.post(`${API_URL}/categories`, category);
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await axios.delete(`${API_URL}/categories`, { data: { categoryId } });
  return response.data;
};

const updateCategory = async (categoryId, data) => {
  const response = await axios.put(`${API_URL}/categories/${categoryId}`, data);
  return response.data;
};

const addProductToCategory = async (categoryId, productId) => {
  const response = await axios.post(`${API_URL}/categories/${categoryId}/products`, { productId });
  return response.data;
};

const removeProductFromCategory = async (productId) => {
  const response = await axios.delete(`${API_URL}/categories/products/${productId}`);
  return response.data;
};

export { getCategories, createCategory, deleteCategory, updateCategory, addProductToCategory, removeProductFromCategory };
