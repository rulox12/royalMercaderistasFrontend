import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const updateUser = async (userId, user) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}`, user);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users`, { data: { userId } });

        return response.data;
    } catch (error) {
        console.error('Error delete user:', error);
        throw error;
    }
};


export { getUsers, createUser, deleteUser, updateUser };
