import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLocalDashboardData = async ({ shopId, monthA, yearA, monthB, yearB }) => {
  try {
    const response = await axios.get(`${API_URL}/shops/dashboard/compare`, {
      params: { shopId, monthA, yearA, monthB, yearB },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
