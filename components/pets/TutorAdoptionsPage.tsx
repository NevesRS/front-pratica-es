import React, { useState, useEffect } from "react";
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
    adotante: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
    };
};

export default function TutorAdoptionsPage() {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [processingId, setProcessingId] = useState<number | null>(null);

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

            const response = await fetch(`http://127.0.0.1:8000/api/adocao/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar adoções');
            }

            const adoptionsData: AdoptionAPI[] = await response.json();

            // Buscar dados de cada pet e adotante
            const adoptionsWithFullData = await Promise.all(
                adoptionsData.map(async (adoption) => {
                    try {
                        // Buscar dados do pet
                        const petData = await petService.getPetById(adoption.pet);

                        // Buscar dados do adotante
                        const adotanteResponse = await fetch(`http://127.0.0.1:8000/api/adotante/${adoption.adotante}/`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            },
                        });

                        let adotanteData = {
                            id: adoption.adotante,
                            nome: 'Adotante não encontrado',
                            email: '-',
                            telefone: '-',
                        };

                        if (adotanteResponse.ok) {
                            adotanteData = await adotanteResponse.json();
                        }

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
                            adotante: adotanteData,
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar dados da adoção ${adoption.id}:`, error);
                        return null;
                    }
                })
            );

            // Filtrar adoções nulas (erros)
            const validAdoptions = adoptionsWithFullData.filter((a): a is Adoption => a !== null);
            setAdoptions(validAdoptions);
        } catch (error: any) {
            console.error('Erro ao buscar adoções:', error);
            setError(error.message || 'Erro ao carregar adoções');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAdoption = async (adoption: Adoption) => {
        if (!confirm(`Tem certeza que deseja aprovar a adoção de ${adoption.pet.nome}?`)) {
            return;
        }

        try {
            setProcessingId(adoption.id);

            // Criar rastreamento de pet adotado
            const trackingResponse = await fetch(`http://127.0.0.1:8000/api/rastreio/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado_rastreio: 'Pet foi adotado',
                    descricao_rastreio: null,
                    pet: adoption.pet.id_pet,
                }),
            });

            if (!trackingResponse.ok) {
                throw new Error('Erro ao criar rastreamento de adoção');
            }

            // Atualizar status da adoção para "Concluída" (status 3)
            const updateResponse = await fetch(`http://127.0.0.1:8000/api/adocao/${adoption.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data_adocao: adoption.data_adocao,
                    status: 3,
                    pet: adoption.pet.id_pet,
                    adotante: adoption.adotante.id,
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('Erro ao atualizar status da adoção');
            }

            showToastMessage('Adoção aprovada com sucesso!', 'success');
            loadAdoptions(); // Recarregar a lista
        } catch (error: any) {
            console.error('Erro ao aprovar adoção:', error);
            showToastMessage(error.message || 'Erro ao aprovar adoção', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectAdoption = async (adoption: Adoption) => {
        if (!confirm(`Tem certeza que deseja rejeitar a adoção de ${adoption.pet.nome}?`)) {
            return;
        }

        try {
            setProcessingId(adoption.id);

            // Criar rastreamento de adoção cancelada
            const trackingResponse = await fetch(`http://127.0.0.1:8000/api/rastreio/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado_rastreio: 'Pet teve uma adoção cancelada',
                    descricao_rastreio: null,
                    pet: adoption.pet.id_pet,
                }),
            });

            if (!trackingResponse.ok) {
                throw new Error('Erro ao criar rastreamento de cancelamento');
            }

            // Deletar o registro de adoção
            const deleteResponse = await fetch(`http://127.0.0.1:8000/api/adocao/${adoption.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!deleteResponse.ok) {
                throw new Error('Erro ao deletar adoção');
            }

            showToastMessage('Adoção rejeitada com sucesso!', 'success');
            loadAdoptions(); // Recarregar a lista
        } catch (error: any) {
            console.error('Erro ao rejeitar adoção:', error);
            showToastMessage(error.message || 'Erro ao rejeitar adoção', 'error');
        } finally {
            setProcessingId(null);
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
                <h1 className="text-3xl font-bold text-gray-900">SOLICITAÇÕES DE ADOÇÃO</h1>
            </div>

            {/* Conteúdo principal */}
            <div className="container mx-auto px-8 py-8">
                {/* Estado de carregamento */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando solicitações de adoção...</p>
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
                                <p className="text-gray-600 text-lg">Nenhuma solicitação de adoção encontrada.</p>
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
                                            <div className="space-y-2 text-sm text-gray-700 border-t pt-3">
                                                <h4 className="font-bold text-gray-900">Dados do Pet:</h4>
                                                <div>
                                                    <span className="font-medium">Espécie:</span> {getEspecieLabel(adoption.pet.especie)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Idade:</span> {getIdadeLabel(adoption.pet.idade)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Porte:</span> {adoption.pet.porte}
                                                </div>
                                            </div>

                                            {/* Informações do Adotante */}
                                            <div className="space-y-2 text-sm text-gray-700 border-t pt-3">
                                                <h4 className="font-bold text-gray-900">Dados do Adotante:</h4>
                                                <div>
                                                    <span className="font-medium">Nome:</span> {adoption.adotante.nome}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Email:</span> {adoption.adotante.email}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Telefone:</span> {adoption.adotante.telefone}
                                                </div>
                                            </div>

                                            {/* Data da Adoção */}
                                            <div className="text-sm text-gray-600 border-t pt-3">
                                                <span className="font-medium">Data da Solicitação:</span> {formatDate(adoption.data_adocao)}
                                            </div>

                                            {/* Botões de Ação */}
                                            {adoption.status === 1 && (
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => handleApproveAdoption(adoption)}
                                                        disabled={processingId === adoption.id}
                                                        className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === adoption.id ? 'PROCESSANDO...' : 'APROVAR'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectAdoption(adoption)}
                                                        disabled={processingId === adoption.id}
                                                        className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === adoption.id ? 'PROCESSANDO...' : 'REJEITAR'}
                                                    </button>
                                                </div>
                                            )}
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
