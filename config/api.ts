// config/api.ts

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    ENDPOINTS: {
        LOGIN: '/api/auth/login/',
        TOKEN: '/api/token/',
        TOKEN_REFRESH: '/api/token/refresh/',
        REGISTER: '/api/auth/register/adotante/',
        PETS: '/api/pet/',
        PET_BY_ID: (id: number) => `/api/pet/${id}/`,
        RACAS: '/api/racasPet/',
        RASTREIO: (id: number) => `/api/rastreio/pet/${id}/`,
        RASTREIO_CREATE: '/api/rastreio/',
        TUTOR_BY_USER_ID: (userId: number) => `/api/tutor/usuario/${userId}/`,
    }
};

export default API_CONFIG;
