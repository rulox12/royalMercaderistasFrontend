import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getStatisticsHome = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/home`);
        if (response) {
            localStorage.setItem('statistics-home', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics home:', error);
        throw error;
    }
};

export { getStatisticsHome };
