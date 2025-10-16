// hooks/useAuthService.ts
import { authService } from '../services/authService';

export const useAuthService = () => {
    const makeAuthenticatedRequest = async (url: string, options?: RequestInit) => {
        try {
            const response = await authService.authenticatedRequest(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('Erro na requisição autenticada:', error);
            throw error;
        }
    };

    return {
        makeAuthenticatedRequest,
        isAuthenticated: authService.isAuthenticated(),
        getAccessToken: authService.getAccessToken(),
    };
};
