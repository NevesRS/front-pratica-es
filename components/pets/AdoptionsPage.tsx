import React, { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { petService } from "@/services/petService";

type AdoptionAPI = {
    id: number;
    data_adocao: string;
    status: number;
    pet: number;
    adotante: number;
};

type Adoption = {
    id: number;
    data_adocao: string;
    status: number;
    pet: {
        id_pet: number;
        nome: string;
        especie: number;
        idade: number;
        porte: string;
    };
};

export default function AdoptionsPage() {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    useEffect(() => {
        loadAdoptions();
    }, []);

    const loadAdoptions = async () => {
        try {
            setLoading(true);
            setError('');

            const userId = authService.getUserIdFromToken();
            if (!userId) {
                setError('Você precisa estar logado para ver suas adoções');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/adocao/usuario/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar adoções');
            }

            const adoptionsData: AdoptionAPI[] = await response.json();

            // Buscar dados de cada pet
            const adoptionsWithPetData = await Promise.all(
                adoptionsData.map(async (adoption) => {
                    try {
                        const petData = await petService.getPetById(adoption.pet);
                        return {
                            id: adoption.id,
                            data_adocao: adoption.data_adocao,
                            status: adoption.status,
                            pet: {
                                id_pet: petData.id_pet,
                                nome: petData.nome,
                                especie: petData.especie,
                                idade: petData.idade,
                                porte: petData.porte,
                            },
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar pet ${adoption.pet}:`, error);
                        // Retornar dados parciais se falhar
                        return {
                            id: adoption.id,
                            data_adocao: adoption.data_adocao,
                            status: adoption.status,
                            pet: {
                                id_pet: adoption.pet,
                                nome: 'Pet não encontrado',
                                especie: 0,
                                idade: 0,
                                porte: 'Desconhecido',
                            },
                        };
                    }
                })
            );

            setAdoptions(adoptionsWithPetData);
        } catch (error: any) {
            console.error('Erro ao buscar adoções:', error);
            setError(error.message || 'Erro ao carregar adoções');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAdoption = async (adoptionId: number) => {
        if (!confirm('Tem certeza que deseja cancelar esta adoção?')) {
            return;
        }

        try {
            setDeletingId(adoptionId);

            const response = await fetch(`http://127.0.0.1:8000/api/adocao/${adoptionId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao cancelar adoção');
            }

            showToastMessage('Adoção cancelada com sucesso!', 'success');
            loadAdoptions(); // Recarregar a lista
        } catch (error: any) {
            console.error('Erro ao cancelar adoção:', error);
            showToastMessage(error.message || 'Erro ao cancelar adoção', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusLabel = (status: number) => {
        const statusMap: Record<number, string> = {
            1: 'Em Andamento',
            2: 'Rejeitada',
            3: 'Concluída',
        };
        return statusMap[status] || 'Desconhecido';
    };

    const getStatusColor = (status: number) => {
        const colorMap: Record<number, string> = {
            1: 'bg-yellow-100 text-yellow-800',
            2: 'bg-red-100 text-red-800',
            3: 'bg-green-100 text-green-800',
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getEspecieLabel = (especie: number) => {
        return especie === 1 ? 'Gato' : 'Cachorro';
    };

    const getIdadeLabel = (idade: number) => {
        const idadeMap: Record<number, string> = {
            1: 'Filhote',
            2: 'Adulto',
            3: 'Idoso',
            4: 'Indiferente',
        };
        return idadeMap[idade] || 'Desconhecido';
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header da página */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">MINHAS ADOÇÕES</h1>
            </div>

            {/* Conteúdo principal */}
            <div className="container mx-auto px-8 py-8">
                {/* Estado de carregamento */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando suas adoções...</p>
                    </div>
                )}

                {/* Estado de erro */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Lista de adoções */}
                {!loading && !error && (
                    <>
                        {adoptions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">Você ainda não possui adoções.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {adoptions.map((adoption) => (
                                    <div
                                        key={adoption.id}
                                        className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition duration-200"
                                    >
                                        <div className="space-y-4">
                                            {/* Nome do Pet */}
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {adoption.pet.nome.toUpperCase()}
                                            </h3>

                                            {/* Status */}
                                            <div className="flex justify-start">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(adoption.status)}`}>
                                                    {getStatusLabel(adoption.status)}
                                                </span>
                                            </div>

                                            {/* Informações do Pet */}
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <div>
                                                    <span className="font-medium">Espécie:</span> {getEspecieLabel(adoption.pet.especie)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Idade:</span> {getIdadeLabel(adoption.pet.idade)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Porte:</span> {adoption.pet.porte}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Data da Adoção:</span> {formatDate(adoption.data_adocao)}
                                                </div>
                                            </div>

                                            {/* Botão Cancelar */}
                                            <button
                                                onClick={() => handleCancelAdoption(adoption.id)}
                                                disabled={deletingId === adoption.id}
                                                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === adoption.id ? 'CANCELANDO...' : 'CANCELAR ADOÇÃO'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Toast de Notificação */}
            {showToast && (
                <div className="fixed top-4 right-4 z-[60] animate-slide-in">
                    <div className={`px-6 py-4 rounded-lg shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white font-bold`}>
                        {toastMessage}
                    </div>
                </div>
            )}
        </div>
    );
}
