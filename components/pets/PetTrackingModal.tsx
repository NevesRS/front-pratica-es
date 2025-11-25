"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { UserPet } from "./MyPetsPage";
import { petService, RastreioStep } from "@/services/petService";
import AddTrackingModal from "./AddTrackingModal";

// Tipos para o rastreamento
export type TrackingStep = {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    isCompleted: boolean;
    isActive: boolean;
};

export type PetTracking = {
    pet: UserPet;
    steps: TrackingStep[];
};

type PetTrackingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    petId: number | null;
    pet: UserPet | null;
};

// Função para converter data ISO para formato brasileiro
const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Função para converter RastreioStep da API para TrackingStep do componente
const convertRastreioToTracking = (rastreioSteps: RastreioStep[]): TrackingStep[] => {
    // Ordenar por data
    const sorted = [...rastreioSteps].sort((a, b) =>
        new Date(a.data_atualizacao).getTime() - new Date(b.data_atualizacao).getTime()
    );

    return sorted.map((step, index) => ({
        id: step.id_rastreio,
        title: step.estado_rastreio.toUpperCase(),
        subtitle: step.descricao_rastreio || "",
        date: formatDate(step.data_atualizacao),
        isCompleted: true,
        isActive: index === sorted.length - 1 // O último é o ativo
    }));
};

export default function PetTrackingModal({ isOpen, onClose, petId, pet }: PetTrackingModalProps) {
    const [steps, setSteps] = useState<TrackingStep[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isAddTrackingModalOpen, setIsAddTrackingModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [racas, setRacas] = useState<Array<{ id_raca_pet: number, raca: string, especie: number }>>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (isOpen && petId) {
            loadRastreio();
        }
    }, [isOpen, petId]);

    const loadRastreio = async () => {
        if (!petId) return;

        try {
            setLoading(true);
            setError('');

            const rastreioData = await petService.getRastreioPet(petId);

            if (rastreioData.length === 0) {
                setError('Nenhum rastreamento disponível para este pet');
                setSteps([]);
            } else {
                const convertedSteps = convertRastreioToTracking(rastreioData);
                setSteps(convertedSteps);
            }
        } catch (error: any) {
            console.error('Erro ao buscar rastreio:', error);
            setError(error.message || 'Erro ao carregar rastreamento');
            setSteps([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrackingSuccess = () => {
        // Recarregar os dados de rastreio após adicionar um novo
        loadRastreio();
    };

    const handleEditClick = async () => {
        if (!petId) return;

        try {
            setIsLoadingEdit(true);
            setIsEditMode(true);

            // Buscar as raças disponíveis
            const racasData = await petService.getRacas();
            setRacas(racasData);

            // Buscar os dados atuais do pet na API
            const petData = await petService.getPetById(petId);

            setEditFormData({
                nome: petData.nome,
                idade: petData.idade,
                porte: petData.porte,
                especie: petData.especie,
                descricao: petData.descricao || '',
                sexo: petData.sexo || '',
                raca: petData.raca || '',
                status_pet: petData.status_pet || 1,
                doenca_cronica: petData.doenca_cronica || false,
                necessidades_especiais: petData.necessidades_especiais || false,
                cuidados_constantes: petData.cuidados_constantes || false,
                amigavel_outros_animais: petData.amigavel_outros_animais || false,
            });
        } catch (error: any) {
            console.error('Erro ao buscar dados do pet:', error);
            showToastMessage(error.message || 'Erro ao carregar dados do pet', 'error');
            setIsEditMode(false);
        } finally {
            setIsLoadingEdit(false);
        }
    };

    const handleEditSave = async () => {
        if (!petId) return;

        try {
            setIsLoadingEdit(true);
            const response = await fetch(`http://127.0.0.1:8000/api/pet/${petId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar pet');
            }

            showToastMessage('Pet atualizado com sucesso!', 'success');
            setIsEditMode(false);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error('Erro ao atualizar pet:', error);
            showToastMessage(error.message || 'Erro ao atualizar pet', 'error');
        } finally {
            setIsLoadingEdit(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!petId) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`http://127.0.0.1:8000/api/pet/${petId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir pet');
            }

            showToastMessage('Pet excluído com sucesso!', 'success');
            setShowDeleteConfirm(false);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error('Erro ao excluir pet:', error);
            showToastMessage(error.message || 'Erro ao excluir pet', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setEditFormData((prev: any) => ({ ...prev, [name]: checked }));
        } else {
            setEditFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    if (!pet) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8 max-w-5xl mx-auto">
                {/* Botão Voltar no topo à esquerda */}
                <div className="mb-6">
                    <button
                        onClick={onClose}
                        className="bg-red-400 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-500 transition duration-200"
                    >
                        VOLTAR
                    </button>
                </div>

                {/* Header com título */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">RASTREAR</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            ✏️ EDITAR PET
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
                        >
                            🗑️ EXCLUIR PET
                        </button>
                        <button
                            onClick={() => setIsAddTrackingModalOpen(true)}
                            className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            + ADICIONAR STATUS
                        </button>
                    </div>
                </div>

                {/* Card de rastreamento */}
                <div className="bg-gradient-to-r from-red-300 to-red-400 rounded-2xl p-8 shadow-lg border-4 border-red-500">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white text-lg">Carregando rastreamento...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <p className="text-white text-lg mb-4">{error}</p>
                            </div>
                        </div>
                    ) : steps.length === 0 ? (
                        <div className="flex justify-center items-center py-12">
                            <p className="text-white text-lg">Nenhum rastreamento disponível</p>
                        </div>
                    ) : (
                        <div className="flex items-start gap-8">
                            {/* Foto do pet (placeholder) */}
                            <div className="flex-shrink-0">
                                <div className="w-36 h-36 rounded-2xl border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                                    <div className="text-gray-500 text-center">
                                        <div className="text-4xl mb-2">🐶</div>
                                        <div className="text-sm font-medium">{pet.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline de rastreamento */}
                            <div className="flex-1 pt-4">
                                <div className="flex items-start justify-between relative">
                                    {/* Linha de conexão de fundo */}
                                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-white opacity-50"></div>

                                    {steps.map((step, index) => (
                                        <div key={step.id} className="relative flex flex-col items-center flex-1 z-10">
                                            {/* Círculo do status */}
                                            <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center mb-4 ${step.isActive
                                                ? 'bg-green-500'
                                                : step.isCompleted
                                                    ? 'bg-white'
                                                    : 'bg-gray-300'
                                                }`}>
                                                {step.isActive && (
                                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                                )}
                                            </div>

                                            {/* Informações do step */}
                                            <div className="text-center text-white px-2">
                                                <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                                                <p className="text-xs opacity-95 mb-2 leading-tight">{step.subtitle}</p>
                                                <p className="text-xs font-medium">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Informações do Pet */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">INFORMAÇÕES DO PET</h2>

                    {/* Descrição do pet se disponível */}
                    {pet.description && (
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-4">DESCRIÇÃO</h3>
                            <p className="text-gray-800 mb-6">{pet.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">NOME</h3>
                            <p className="text-gray-600">{pet.name}</p>
                        </div>

                        {pet.type && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">TIPO</h3>
                                <p className="text-gray-600">{pet.type}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">RAÇA</h3>
                            <p className="text-gray-600">{pet.breed}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">SEXO</h3>
                            <p className="text-gray-600">{pet.gender}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">PORTE</h3>
                            <p className="text-gray-600">{pet.size}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">LOCALIZAÇÃO</h3>
                            <p className="text-gray-600">{pet.location}</p>
                        </div>

                        {pet.age && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">IDADE</h3>
                                <p className="text-gray-600">{pet.age}</p>
                            </div>
                        )}

                        {pet.temperament && (
                            <div className="col-span-2">
                                <h3 className="font-bold text-gray-700 mb-2">TEMPERAMENTO</h3>
                                <p className="text-gray-600">{pet.temperament}</p>
                            </div>
                        )}

                        {pet.veterinaryCare && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">CUIDADOS VETERINÁRIOS</h3>
                                <p className="text-gray-600">{pet.veterinaryCare}</p>
                            </div>
                        )}

                        {pet.livesWellWith && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">VIVE BEM COM</h3>
                                <p className="text-gray-600">{pet.livesWellWith}</p>
                            </div>
                        )}

                        {pet.socialWith && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">SOCIÁVEL COM</h3>
                                <p className="text-gray-600">{pet.socialWith}</p>
                            </div>
                        )}
                    </div>

                    {/* Informações de contato se disponíveis */}
                    {pet.contact && (
                        <div className="mt-8">
                            <h3 className="font-bold text-lg mb-4">CONTATOS DO RESPONSÁVEL</h3>
                            <div className="space-y-2 text-sm">
                                <div className="font-bold">{pet.contact.name}</div>
                                <div><span className="font-medium">E-mail:</span> {pet.contact.email}</div>
                                <div><span className="font-medium">Telefone:</span> {pet.contact.phone}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para adicionar novo status de rastreio */}
            {petId && (
                <AddTrackingModal
                    isOpen={isAddTrackingModalOpen}
                    onClose={() => setIsAddTrackingModalOpen(false)}
                    petId={petId}
                    onSuccess={handleAddTrackingSuccess}
                />
            )}

            {/* Modal de Edição do Pet */}
            {isEditMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="bg-blue-500 p-6 text-white">
                            <h2 className="text-2xl font-bold">EDITAR PET</h2>
                        </div>

                        {isLoadingEdit ? (
                            <div className="p-12 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
                                <p className="text-gray-600">Carregando dados do pet...</p>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Nome do Pet</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={editFormData.nome || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nome do Pet"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Idade</label>
                                    <select
                                        name="idade"
                                        value={editFormData.idade || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="1">Filhote</option>
                                        <option value="2">Adulto</option>
                                        <option value="3">Idoso</option>
                                        <option value="4">Indiferente</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Porte</label>
                                    <select
                                        name="porte"
                                        value={editFormData.porte || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="1">Pequeno</option>
                                        <option value="2">Médio</option>
                                        <option value="3">Grande</option>
                                        <option value="4">Muito Grande</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Espécie</label>
                                    <select
                                        name="especie"
                                        value={editFormData.especie || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="1">Gato</option>
                                        <option value="2">Cachorro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Raça (Opcional)</label>
                                    <select
                                        name="raca"
                                        value={editFormData.raca || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Sem raça definida</option>
                                        {racas
                                            .filter(raca => !editFormData.especie || raca.especie === Number(editFormData.especie))
                                            .map(raca => (
                                                <option key={raca.id_raca_pet} value={raca.id_raca_pet}>
                                                    {raca.raca}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        value={editFormData.descricao || ''}
                                        onChange={handleInputChange}
                                        placeholder="Descrição"
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="doenca_cronica"
                                            checked={editFormData.doenca_cronica || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5"
                                        />
                                        <span>Doença Crônica</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="necessidades_especiais"
                                            checked={editFormData.necessidades_especiais || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5"
                                        />
                                        <span>Necessidades Especiais</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="cuidados_constantes"
                                            checked={editFormData.cuidados_constantes || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5"
                                        />
                                        <span>Cuidados Constantes</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="amigavel_outros_animais"
                                            checked={editFormData.amigavel_outros_animais || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5"
                                        />
                                        <span>Amigável com Outros Animais</span>
                                    </label>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleEditSave}
                                        disabled={isLoadingEdit}
                                        className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isLoadingEdit ? 'SALVANDO...' : 'SALVAR'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditMode(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400"
                                    >
                                        CANCELAR
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="bg-red-600 p-6 text-white">
                            <h2 className="text-2xl font-bold">⚠️ CONFIRMAR EXCLUSÃO</h2>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-6">
                                Tem certeza que deseja excluir <strong>{pet?.nome}</strong>?
                                Esta ação não pode ser desfeita.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isDeleting ? 'EXCLUINDO...' : 'SIM, EXCLUIR'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast de Notificação */}
            {showToast && (
                <div className="fixed top-4 right-4 z-[60] animate-slide-in">
                    <div className={`px-6 py-4 rounded-lg shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white font-bold`}>
                        {toastMessage}
                    </div>
                </div>
            )}
        </Modal>
    );
}
