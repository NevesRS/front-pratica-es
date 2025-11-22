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
                    <button
                        onClick={() => setIsAddTrackingModalOpen(true)}
                        className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        + ADICIONAR STATUS
                    </button>
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
        </Modal>
    );
}
