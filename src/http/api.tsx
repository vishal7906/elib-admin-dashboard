import useTokenStore from '@/store';
import { Book } from '@/types';
import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5501',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
    const { token } = useTokenStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// API Functions
export const login = async (data: { email: string; password: string }) => {
    try {
        const response = await api.post('/api/users/login', data);
        console.log('Login API Response:', response.data); // Add this to check the response structure
        const { accessToken, userId } = response.data; // Adjust according to actual response structure

        return { data: { accessToken, userId } }; // Ensure this matches the expected response format
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export const register = async (data: { name: string; email: string; password: string }) => {
    try {
        return await api.post('/api/users/register', data);
    } catch (error) {
        console.error('Register Error:', error);
        throw error;
    }
};

export const getBooks = async () => {
    try {
        return await api.get('/api/books');
    } catch (error) {
        console.error('Get Books Error:', error);
        throw error;
    }
};

export const createBook = async (data: FormData) => {
    try {
        return await api.post('/api/books', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Create Book Error:', error);
        throw error;
    }
};

export const updateBook = async (id: string, data: FormData) => {
    try {
        const response = await api.patch(`/api/books/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Update Book Error:', error.message, error.response?.data);
        } else {
            console.error('Update Book Error:', error);
        }
        throw error;
    }
};

export const getBookById = async (id: string): Promise<Book> => {
    try {
        const response = await api.get(`/api/books/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Book By ID Error:', error);
        throw error;
    }
};

export const deleteBook = async (id: string) => {
    try {
        const response = await api.delete(`/api/books/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || 'Failed to delete book');
        } else {
            throw new Error('Failed to delete book');
        }
    }
};
