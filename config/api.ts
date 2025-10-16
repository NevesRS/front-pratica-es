// config/api.ts

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    ENDPOINTS: {
        TOKEN: '/api/token/',
        TOKEN_REFRESH: '/api/token/refresh/',
    }
};

export default API_CONFIG;
