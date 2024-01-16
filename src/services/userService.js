import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const createUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export { getUsers, createUser };
