// services/authService.ts
import API_CONFIG from '../config/api';

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    username: string;
    password: string;
}

interface RefreshTokenRequest {
    refresh: string;
}

interface RefreshTokenResponse {
    refresh: string;
}

class AuthService {
    private baseUrl = API_CONFIG.BASE_URL;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        // Carrega tokens do localStorage se disponíveis
        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
            this.refreshToken = localStorage.getItem('refreshToken');
        }
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            // Adiciona timeout para evitar loading infinito
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = 'Erro ao fazer login';

                try {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        errorMessage = 'Credenciais incorretas. Verifique seu e-mail e senha.';
                    } else if (response.status === 404) {
                        errorMessage = 'Usuário não encontrado.';
                    } else if (response.status >= 500) {
                        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
                    } else {
                        errorMessage = errorData.detail || errorData.message || errorMessage;
                    }
                } catch (parseError) {
                    // Se não conseguir fazer parse do JSON de erro
                    if (response.status === 401) {
                        errorMessage = 'Credenciais incorretas. Verifique seu e-mail e senha.';
                    } else if (response.status === 404) {
                        errorMessage = 'Usuário não encontrado.';
                    }
                }

                throw new Error(errorMessage);
            }

            const data: LoginResponse = await response.json();

            // Armazena os tokens
            this.accessToken = data.username; // Baseado na resposta da API
            this.refreshToken = data.password; // Baseado na resposta da API

            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', this.accessToken);
                localStorage.setItem('refreshToken', this.refreshToken);
            }

            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async refreshAccessToken(): Promise<string> {
        if (!this.refreshToken) {
            throw new Error('Refresh token não encontrado');
        }

        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TOKEN_REFRESH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: this.refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Erro ao renovar token');
            }

            const data: RefreshTokenResponse = await response.json();
            this.refreshToken = data.refresh;

            if (typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', this.refreshToken);
            }

            return this.refreshToken;
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            this.logout(); // Remove tokens inválidos
            throw error;
        }
    }

    logout(): void {
        this.accessToken = null;
        this.refreshToken = null;

        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    // Método para fazer requisições autenticadas
    async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        let response = await fetch(url, {
            ...options,
            headers,
        });

        // Se o token expirou, tenta renovar
        if (response.status === 401 && this.refreshToken) {
            try {
                await this.refreshAccessToken();
                headers['Authorization'] = `Bearer ${this.accessToken}`;
                response = await fetch(url, {
                    ...options,
                    headers,
                });
            } catch (error) {
                // Se não conseguir renovar, faz logout
                this.logout();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
        }

        return response;
    }
}

// Instância singleton do serviço
export const authService = new AuthService();
