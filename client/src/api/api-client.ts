import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Mock interceptor to add user id to requests for this prototype
apiClient.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    if (userId && config.url === '/expenses') {
        config.params = { ...config.params, userId };
    }
    return config;
});

export default apiClient;
