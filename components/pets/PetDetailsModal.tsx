import React, { useState } from "react";
import Modal from "../ui/Modal";
import { authService } from "@/services/authService";

export type PetDetails = {
    id: number;
    name: string;
    location: string;
    imageUrl: string;
    type: string;
    breed: string;
    gender: string;
    size: string;
    age: string;
    description: string;
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    characteristics: {
        veterinaryCare: string;
        temperament: string;
        socialWith: string;
        livesWellWith: string;
    };
    score?: number;
};

type PetDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    pet: PetDetails | null;
    isLoading?: boolean;
};

export default function PetDetailsModal({ isOpen, onClose, pet, isLoading = false }: PetDetailsModalProps) {
    const [isAdopting, setIsAdopting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAdotar = async () => {
        if (!pet) return;

        try {
            setIsAdopting(true);

            // Obter o ID do adotante do token
            const userId = authService.getUserIdFromToken();
            if (!userId) {
                showToastMessage('Você precisa estar logado como adotante para adotar um pet', 'error');
                return;
            }

            // Buscar o ID do adotante pelo user ID
            const adotanteResponse = await fetch(`http://127.0.0.1:8000/api/adotante/usuario/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!adotanteResponse.ok) {
                throw new Error('Erro ao buscar dados do adotante');
            }

            const adotanteData = await adotanteResponse.json();
            const adotanteId = adotanteData.id; // API retorna 'id' ao invés de 'id_adotante'

            if (!adotanteId) {
                throw new Error('ID do adotante não encontrado');
            }

            // Criar a adoção
            const response = await fetch('http://127.0.0.1:8000/api/adocao/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    data_adocao: new Date().toISOString().split('T')[0],
                    status: 1, // 1 - Em Andamento
                    pet: pet.id,
                    adotante: adotanteId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar adoção');
            }

            showToastMessage('Solicitação de adoção enviada com sucesso!', 'success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error('Erro ao criar adoção:', error);
            showToastMessage(error.message || 'Erro ao criar adoção', 'error');
        } finally {
            setIsAdopting(false);
        }
    };

    const DOG_URL = 'https://love.doghero.com.br/wp-content/uploads/2018/12/golden-retriever-1.png';
    const CAT_URL = 'https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg';

    const getPetImageUrl = (p: PetDetails | null) => {
        if (!p) return '';
        const type = (p.type || '').toString().toLowerCase();
        const breed = (p.breed || '').toString().toLowerCase();

        // Detectar cachorro
        if (type.includes('cach') || type.includes('dog') || breed.includes('cach') || breed.includes('dog')) {
            return DOG_URL;
        }

        // Detectar gato
        if (type.includes('gat') || type.includes('cat') || breed.includes('gat') || breed.includes('cat')) {
            return CAT_URL;
        }

        // Caso não seja cão/gato, usar imageUrl se disponível
        if (p.imageUrl && p.imageUrl.trim() !== '') return p.imageUrl;

        // Fallback simples
        return '';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 pb-8">
                {isLoading ? (
                    // Estado de carregamento
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mb-4"></div>
                        <p className="text-gray-600 text-lg">Carregando detalhes do pet...</p>
                    </div>
                ) : !pet ? null : (
                    // Conteúdo normal do modal
                    <>
                        {/* Botão Voltar no topo à esquerda */}
                        <div className="mb-6">
                            <button
                                onClick={onClose}
                                className="bg-red-400 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-500 transition duration-200"
                            >
                                VOLTAR
                            </button>
                        </div>

                        {/* Header com nome do pet */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 text-center">{pet.name}</h1>
                            {pet.score !== undefined && (
                                <div className="flex justify-center mt-4">
                                    <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full text-lg font-bold">
                                        Compatibilidade: {pet.score.toFixed(2)}%
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* Imagem do pet centralizada no topo */}
                            <div className="flex justify-center">
                                <div className="w-80 h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border-2 border-gray-300 overflow-hidden">
                                    {getPetImageUrl(pet) ? (
                                        <img
                                            src={getPetImageUrl(pet)}
                                            alt={`Imagem de ${pet.name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>Imagem do {pet.name}</span>
                                    )}
                                </div>
                            </div>

                            {/* Informações do pet */}
                            <div className="space-y-6">
                                {/* Informações básicas e descrição */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    {/* Descrição */}
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold mb-4">DESCRIÇÃO</h2>
                                        <p className="text-gray-800 mb-6">{pet.description}</p>
                                    </div>

                                    {/* Informações básicas */}
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                                        <div>
                                            <span className="font-bold">RAÇA:</span> {pet.breed}
                                        </div>
                                        <div>
                                            <span className="font-bold">SEXO:</span> {pet.gender}
                                        </div>
                                        <div>
                                            <span className="font-bold">PORTE:</span> {pet.size}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Contatos do Animal */}
                                        <div>
                                            <h3 className="font-bold text-lg mb-4">CONTATOS DO ANIMAL</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="font-bold">{pet.contact.name}</div>
                                                <div><span className="font-medium">E-mail:</span> {pet.contact.email}</div>
                                                <div><span className="font-medium">Telefone:</span> {pet.contact.phone}</div>
                                            </div>
                                        </div>

                                        {/* Características */}
                                        <div>
                                            <h3 className="font-bold text-lg mb-4">INFORMAÇÕES DE SAÚDE E CUIDADOS</h3>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="font-medium block mb-1">Condição de Saúde:</span>
                                                    <div className="text-gray-700">{pet.characteristics.veterinaryCare}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium block mb-1">Convivência com Outros Animais:</span>
                                                    <div className="text-gray-700">{pet.characteristics.temperament}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium block mb-1">Necessidades Especiais:</span>
                                                    <div className="text-gray-700">{pet.characteristics.socialWith}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium block mb-1">Nível de Cuidados Requeridos:</span>
                                                    <div className="text-gray-700">{pet.characteristics.livesWellWith}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botão Quero Adotar no final */}
                            <div className="text-center mb-4">
                                <button
                                    onClick={handleAdotar}
                                    disabled={isAdopting}
                                    className="w-full bg-red-500 text-2xl font-bold text-white py-6 px-6 rounded-xl transition duration-200 ease-in-out hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAdopting ? 'PROCESSANDO...' : 'ADOTAR'}
                                </button>
                            </div>
                        </div>
                    </>
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
            </div>
        </Modal>
    );
}
