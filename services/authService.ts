// services/authService.ts
import API_CONFIG from '../config/api';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
}

interface RefreshTokenRequest {
    refresh: string;
}

interface RefreshTokenResponse {
    refresh: string;
}

interface RegisterData {
    nome: string;
    email: string;
    telefone: string;
    password: string;
}

interface RegisterResponse {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    message?: string;
}

class AuthService {
    private baseUrl = API_CONFIG.BASE_URL;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        // Carrega tokens do localStorage se disponíveis
        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('access_token');
            this.refreshToken = localStorage.getItem('refresh_token');
        }
    }

    // Decodifica o JWT token para extrair informações do payload
    private decodeToken(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    // Obtém o ID do usuário do token
    getUserIdFromToken(): number | null {
        if (!this.accessToken) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (!token) return null;
            this.accessToken = token;
        }

        const decoded = this.decodeToken(this.accessToken);
        return decoded?.user_id || decoded?.id || null;
    }

    // Busca o ID do tutor a partir do user_id
    async getTutorIdByUserId(userId: number): Promise<number | null> {
        try {
            const token = this.getAccessToken();
            if (!token) return null;

            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TUTOR_BY_USER_ID(userId)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Erro ao buscar tutor:', response.status);
                return null;
            }

            const data = await response.json();
            return data?.id_tutor || null;
        } catch (error) {
            console.error('Erro ao buscar tutor:', error);
            return null;
        }
    }

    // Obtém o username do token
    getUsernameFromToken(): string | null {
        if (!this.accessToken) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (!token) return null;
            this.accessToken = token;
        }

        const decoded = this.decodeToken(this.accessToken);
        return decoded?.username || decoded?.email || null;
    }

    // Obtém o perfil do usuário do token (adotante ou tutor)
    getUserProfileFromToken(): 'adotante' | 'tutor' | null {
        if (!this.accessToken) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (!token) return null;
            this.accessToken = token;
        }

        const decoded = this.decodeToken(this.accessToken);
        // O token usa "role" com valores "ADOTANTE" ou "TUTOR"
        const role = decoded?.role;
        if (role === 'ADOTANTE') return 'adotante';
        if (role === 'TUTOR') return 'tutor';
        return null;
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            // Adiciona timeout para evitar loading infinito
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.LOGIN}`, {
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

            // Armazena os tokens JWT
            this.accessToken = data.access;
            this.refreshToken = data.refresh;

            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', this.accessToken);
                localStorage.setItem('refresh_token', this.refreshToken);
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
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }

    async register(data: RegisterData): Promise<RegisterResponse> {
        try {
            // Adiciona timeout para evitar loading infinito
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('AuthService: Resposta de registro recebida, status:', response.status);

            if (!response.ok) {
                let errorMessage = 'Erro ao criar conta';

                try {
                    const errorData = await response.json();
                    console.log('AuthService: Dados de erro da API:', errorData);

                    if (response.status === 400) {
                        // Erros de validação
                        if (errorData.email) {
                            errorMessage = 'E-mail já cadastrado ou inválido.';
                        } else if (errorData.telefone) {
                            errorMessage = 'Telefone inválido.';
                        } else if (errorData.nome) {
                            errorMessage = 'Nome inválido.';
                        } else {
                            errorMessage = errorData.detail || errorData.message || 'Dados inválidos.';
                        }
                    } else if (response.status === 409) {
                        errorMessage = 'Usuário já existe com esse e-mail.';
                    } else if (response.status >= 500) {
                        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
                    } else {
                        errorMessage = errorData.detail || errorData.message || errorMessage;
                    }
                } catch (parseError) {
                    console.log('AuthService: Erro ao fazer parse do JSON de erro:', parseError);
                    if (response.status === 400) {
                        errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
                    } else if (response.status === 409) {
                        errorMessage = 'Usuário já existe com esse e-mail.';
                    }
                }

                console.log('AuthService: Lançando erro com mensagem:', errorMessage);
                throw new Error(errorMessage);
            }

            const responseData: RegisterResponse = await response.json();
            console.log('AuthService: Cadastro realizado com sucesso:', responseData);

            return responseData;
        } catch (error) {
            console.error('Erro no registro:', error);

            // Tratamento específico para diferentes tipos de erro
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Timeout: A conexão demorou muito para responder. Tente novamente.');
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
                } else {
                    throw error; // Mantém a mensagem de erro original se já foi tratada
                }
            } else {
                throw new Error('Erro desconhecido. Tente novamente.');
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.accessToken || !!(typeof window !== 'undefined' && localStorage.getItem('access_token'));
    }

    getAccessToken(): string | null {
        if (!this.accessToken && typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('access_token');
        }
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
