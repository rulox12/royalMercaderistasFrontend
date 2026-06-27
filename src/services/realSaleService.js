import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getRealSaleFormData = async ({
  platformId,
  cityId,
  shopId,
  startDate,
  endDate,
}) => {
  const response = await axios.get(`${API_URL}/real-sales/form-data`, {
    params: {
      platformId,
      cityId,
      shopId,
      startDate,
      endDate,
    },
  });

  return response.data;
};

const createRealSale = async (payload) => {
  const response = await axios.post(`${API_URL}/real-sales`, payload);
  return response.data;
};

const updateRealSale = async (realSaleId, payload) => {
  const response = await axios.put(`${API_URL}/real-sales/${realSaleId}`, payload);
  return response.data;
};

export {
  getRealSaleFormData,
  createRealSale,
  updateRealSale,
};
