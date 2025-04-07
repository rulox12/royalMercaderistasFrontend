import axios from "axios";
import { saveAs } from "file-saver";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getBigOrders = async (page, limit,selectedCityId, selectedPlatformId) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (selectedCityId) params.append('cityId', selectedCityId);
    if (selectedPlatformId) params.append('platformId', selectedPlatformId);

    const response = await axios.get(`${API_URL}/big-orders?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching big order:", error);
    throw error;
  }
};

const getBigOrder = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/big-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching big order:", error);
    throw error;
  }
};

const createBigOrder = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/big-orders`, params);
    return response.data;
  } catch (error) {
    console.error("Error creating big order:", error);
    throw error;
  }
};

const updateBigOrder = async (params) => {
  try {
    const response = await axios.put(`${API_URL}/big-orders`, params);
    return { status: 201, message: response.data.message };
  } catch (error) {
    console.error("Error creating big order:", error);
    throw error;
  }
};

const downloadOrderDetails = async (bigOrderId, date, city, platformId) => {
  try {
    const response = await axios.post(
      `${API_URL}/big-orders/export`,
      {
        bigOrderId,
        platformId
      },
      {
        responseType: "blob",
      }
    );

    if (!response.data) {
      throw new Error("No se pudo descargar el archivo");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const blob = new Blob([response.data], { type: "application/octet-stream" });

    saveAs(blob, `${new Date(date).toLocaleDateString("es-CO")}-${city}-${bigOrderId}.xlsx`);

    return true;
  } catch (error) {
    return false;
  }
};

export { getBigOrders, createBigOrder, getBigOrder, updateBigOrder, downloadOrderDetails };
