import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const user = response.data.user;
        const token = response.data.token;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


export { login, getCurrentUser };
