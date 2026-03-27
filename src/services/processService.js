import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const runFullProcess = async (startDate, endDate) => {
  try {
    const response = await axios.post(`${API_URL}/statistics/full-process`, {
      startDate,
      endDate
    });
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || 'Error ejecutando full process';
    throw new Error(message);
  }
};

export { runFullProcess };