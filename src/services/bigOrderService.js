import axios from "axios";
import { saveAs } from 'file-saver';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getBigOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/big-orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

const getBigOrder = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/big-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

const createBigOrder = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/big-orders`, params);
    return response.data;
  } catch (error) {
    console.error("Error creating cities:", error);
    throw error;
  }
};

const updateBigOrder = async (params) => {
  try {
    const response = await axios.put(`${API_URL}/big-orders`, params);
    return response.data;
  } catch (error) {
    console.error("Error creating cities:", error);
    throw error;
  }
};

const downloadOrderDetails = async (bigOrderId) => {
  try {
    const response = await axios.post(
      `${API_URL}/big-orders/export`,
      {
        bigOrderId,
      },
      {
        responseType: "blob",
      }
    );

    if (!response.data) {
      throw new Error("No se pudo descargar el archivo");
    }

    // Generar una URL de objeto blob para el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const blob = new Blob([response.data], { type: "application/octet-stream" });
    console.log(url);
    
    saveAs(blob, `${bigOrderId}.xlsx`);
    
    return true
  } catch (error) {
    return false
  }
};

export { getBigOrders, createBigOrder, getBigOrder, updateBigOrder, downloadOrderDetails };
