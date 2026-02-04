import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor to add user id to requests
apiClient.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
    }
    return config;
});

export default apiClient;
