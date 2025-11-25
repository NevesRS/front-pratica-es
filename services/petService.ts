import { API_CONFIG } from '@/config/api';

export interface Pet {
    id_pet: number;
    nome: string;
    idade: number;
    porte: string;
    descricao: string | null;
    foto: string | null;
    sexo?: number;
    doenca_cronica: boolean;
    necessidades_especiais: boolean;
    cuidados_constantes: boolean;
    amigavel_outros_animais: boolean;
    especie: number;
    status_pet: number;
    ong: number | null;
    tutor: number | null;
    raca?: number;
    score?: number;
}

export interface CreatePetData {
    nome: string;
    idade: number;
    porte: string;
    descricao?: string;
    foto?: string;
    sexo?: number;
    raca?: number;
    doenca_cronica: boolean;
    necessidades_especiais: boolean;
    cuidados_constantes: boolean;
    amigavel_outros_animais: boolean;
    especie: number;
    status_pet: number;
    ong?: number;
    tutor?: number;
}

export interface Raca {
    id_raca_pet: number;
    raca: string;
    especie: number;
}

export interface RastreioStep {
    id_rastreio: number;
    estado_rastreio: string;
    descricao_rastreio: string | null;
    data_atualizacao: string;
    pet: number;
}

export interface PetRastreio {
    pet: Pet;
    steps: RastreioStep[];
}

export interface RastreioStep {
    id_rastreio: number;
    estado_rastreio: string;
    descricao_rastreio: string | null;
    data_atualizacao: string;
    pet: number;
}

export interface PetRastreio {
    pet: Pet;
    steps: RastreioStep[];
}

class PetService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }

    async getPets(limit: number = 10): Promise<Pet[]> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PETS}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 404) {
                    throw new Error('Endpoint não encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao buscar pets.');
            }

            const data = await response.json();

            // Retorna os primeiros 'limit' pets
            if (Array.isArray(data)) {
                return data.slice(0, limit);
            }

            return [];
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async getPetsWithFilters(queryString: string = '', onlyAvailable: boolean = false): Promise<Pet[]> {
        try {
            const endpoint = onlyAvailable ? '/api/pet/disponiveis/' : API_CONFIG.ENDPOINTS.PETS;
            const url = `${API_CONFIG.BASE_URL}${endpoint}${queryString}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders(),
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 404) {
                    throw new Error('Endpoint não encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao buscar pets.');
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async getPetById(id: number): Promise<Pet> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET_BY_ID(id)}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 404) {
                    throw new Error('Pet não encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao buscar detalhes do pet.');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async createPet(petData: CreatePetData): Promise<Pet> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PETS}`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(petData),
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 400) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    throw new Error(errorMessages || 'Dados inválidos. Verifique os campos.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao cadastrar pet.');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async getRacas(): Promise<Raca[]> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RACAS}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                    signal: AbortSignal.timeout(10000),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 404) {
                    throw new Error('Endpoint não encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao buscar raças.');
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async getPetsByTutor(tutorId: number): Promise<Pet[]> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PETS}?tutor=${tutorId}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                    signal: AbortSignal.timeout(10000),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                } else if (response.status === 404) {
                    throw new Error('Nenhum pet encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Tente novamente mais tarde.');
                }
                throw new Error('Erro ao buscar seus pets.');
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async getRastreioPet(petId: number): Promise<RastreioStep[]> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RASTREIO(petId)}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                    signal: AbortSignal.timeout(10000),
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    // Retorna array vazio se não houver rastreio
                    return [];
                }
                throw new Error('Sem rastreios encontrados');
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            console.error('Erro ao buscar rastreio:', error);
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }

    async createRastreio(petId: number, estadoRastreio: string, descricaoRastreio?: string): Promise<RastreioStep> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RASTREIO_CREATE}`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        estado_rastreio: estadoRastreio,
                        descricao_rastreio: descricaoRastreio || null,
                        pet: petId
                    }),
                    signal: AbortSignal.timeout(10000),
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao criar status de rastreio');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Erro ao criar rastreio:', error);
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor.');
        }
    }
}

export const petService = new PetService();
