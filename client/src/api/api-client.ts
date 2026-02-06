import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const userId = localStorage.getItem('userId');
    if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
    }
    return config;
});

export default apiClient;
