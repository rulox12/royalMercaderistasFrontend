import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLocalDashboardData = async ({ shopId, startDateA, endDateA, startDateB, endDateB }) => {
  try {
    const response = await axios.get(`${API_URL}/shops/dashboard/compare`, {
      params: { shopId, startDateA, endDateA, startDateB, endDateB },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
