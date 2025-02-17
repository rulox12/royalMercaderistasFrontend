import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const user = response.data.user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export { login };
