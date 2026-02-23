import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene la comparación de ventas, averías y rentabilidad
 * entre dos meses/años para una tienda específica.
 *
 * @param {string} shopId - ID de la tienda
 * @param {number} monthA - Mes A (1-12)
 * @param {number} yearA - Año A (ej: 2024)
 * @param {number} monthB - Mes B (1-12)
 * @param {number} yearB - Año B (ej: 2025)
 * @returns {Promise<Array>} Datos con ventas, averías y rentabilidad
 */
const getMonthlyComparison = async (shopId, monthA, yearA, monthB, yearB) => {
  try {
    const response = await axios.get(`${API_URL}/orders/compare-month-year`, {
      params: { shopId, monthA, yearA, monthB, yearB }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly comparison:', error);
    throw error;
  }
};

const getPlatformComparison = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/orders/compare-platforms`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching platform comparison:', error);
    throw error;
  }
};


const getPlatformCitiesComparison = async (platformId, monthA, yearA, monthB, yearB) => {
  try {
    const response = await axios.get(`${API_URL}/orders/compare-platform-cities`, {
      params: { platformId, monthA, yearA, monthB, yearB }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching platform cities comparison:', error);
    throw error;
  }
};

export { getMonthlyComparison, getPlatformComparison, getPlatformCitiesComparison };