"use client";

import React, { useState, useEffect } from "react";
import { petService, Pet } from "@/services/petService";
import PetCard from "./PetCard";

type HeuristicPageProps = {
    onPetClick: (pet: Pet) => void;
};

export default function HeuristicPage({ onPetClick }: HeuristicPageProps) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadHeuristicPets();
    }, []);

    const loadHeuristicPets = async () => {
        try {
            setLoading(true);
            setError('');

            // Buscar pets da rota heurística
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Você precisa estar logado para ver sugestões');
                return;
            }

            // Decodificar token para pegar ID do usuário
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            const userId = payload.user_id;

            const response = await fetch(
                `http://127.0.0.1:8000/api/pet/4/heuristica/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar sugestões de pets');
            }

            const data = await response.json();
            setPets(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('Erro ao buscar pets heurísticos:', error);
            setError(error.message || 'Erro ao carregar sugestões');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">PETS SUGERIDOS PARA VOCÊ</h1>
                <p className="text-gray-600 mt-2">Baseado nas suas preferências e histórico</p>
            </div>

            {/* Conteúdo principal */}
            <div className="container mx-auto p-8">
                {/* Estado de carregamento */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando sugestões...</p>
                    </div>
                )}

                {/* Estado de erro */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Grid de pets */}
                {!loading && !error && (
                    <>
                        {pets.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Nenhum pet sugerido no momento</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {pets.map((pet) => (
                                    <PetCard
                                        key={pet.id_pet}
                                        name={pet.nome}
                                        especie={pet.especie === 3 ? "CACHORRO" : pet.especie === 4 ? "GATO" : "OUTRO"}
                                        imageUrl={pet.foto || ""}
                                        onClick={() => onPetClick(pet)}
                                        score={pet.score}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
