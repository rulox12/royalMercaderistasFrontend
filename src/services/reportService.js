import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene la comparación de ventas, averías y rentabilidad
 * entre dos rangos de fechas para una tienda específica.
 *
 * @param {string} shopId - ID de la tienda
 * @param {string} startDateA - Fecha inicial del periodo A (YYYY-MM-DD)
 * @param {string} endDateA - Fecha final del periodo A (YYYY-MM-DD)
 * @param {string} startDateB - Fecha inicial del periodo B (YYYY-MM-DD)
 * @param {string} endDateB - Fecha final del periodo B (YYYY-MM-DD)
 * @returns {Promise<Array>} Datos con ventas, averías y rentabilidad
 */
const getDateRangeComparison = async (shopId, startDateA, endDateA, startDateB, endDateB) => {
  try {
    const response = await axios.get(`${API_URL}/orders/compare-date-range`, {
      params: { shopId, startDateA, endDateA, startDateB, endDateB }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching date range comparison:', error);
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


const getPlatformCitiesComparison = async (platformId, startDateA, endDateA, startDateB, endDateB) => {
  try {
    const response = await axios.get(`${API_URL}/orders/compare-platform-cities`, {
      params: { platformId, startDateA, endDateA, startDateB, endDateB }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching platform cities comparison:', error);
    throw error;
  }
};

export { getDateRangeComparison, getPlatformComparison, getPlatformCitiesComparison };