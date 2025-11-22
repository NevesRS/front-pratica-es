import React, { useState, useEffect } from "react";
import { petService, Pet } from "@/services/petService";
import { authService } from "@/services/authService";

// Tipo para os dados do pet do usuário
export type UserPet = {
    id: number;
    name: string;
    breed: string;
    gender: string;
    size: string;
    location: string;
    imageUrl: string;
    // Campos adicionais do cadastro
    temperament?: string;
    veterinaryCare?: string;
    livesWellWith?: string;
    socialWith?: string;
    age?: string;
    // Campos para compatibilidade com PetDetails
    type?: string; // Tipo do animal (Cachorro, Gato, etc.)
    description?: string; // Descrição/história do pet
    contact?: {
        name: string;
        email: string;
        phone: string;
    };
};

type MyPetsPageProps = {
    onBackClick?: () => void;
    onAddPetClick?: () => void;
    onEditPet?: (pet: UserPet) => void;
};

export default function MyPetsPage({ onBackClick, onAddPetClick, onEditPet }: MyPetsPageProps) {
    const [pets, setPets] = useState<UserPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadUserPets();
    }, []);

    const loadUserPets = async () => {
        try {
            setLoading(true);
            setError('');

            // Obter ID do usuário logado
            const userId = authService.getUserIdFromToken();

            if (!userId) {
                setError('Você precisa estar logado para ver seus pets');
                setLoading(false);
                return;
            }

            // Buscar pets do usuário
            const userPetsData = await petService.getPetsByTutor(userId);

            // Converter formato da API para formato do componente
            const convertedPets: UserPet[] = userPetsData.map(pet => {
                // Mapear idade
                const ageMap: Record<number, string> = {
                    1: "FILHOTE",
                    2: "ADULTO",
                    3: "IDOSO",
                    4: "INDIFERENTE"
                };

                // Mapear porte
                const sizeMap: Record<number, string> = {
                    1: "PEQUENO",
                    2: "MÉDIO",
                    3: "GRANDE",
                    4: "MUITO GRANDE"
                };

                // Mapear sexo
                const genderMap: Record<number, string> = {
                    1: "MACHO",
                    2: "FÊMEA"
                };

                return {
                    id: pet.id_pet,
                    name: pet.nome.toUpperCase(),
                    breed: pet.raca ? `${pet.raca}` : "SRD",
                    gender: genderMap[pet.sexo || 0] || "DESCONHECIDO",
                    size: sizeMap[Number(pet.porte)] || "DESCONHECIDO",
                    location: "",
                    imageUrl: pet.foto || "",
                    age: ageMap[pet.idade] || "DESCONHECIDO",
                    type: pet.especie === 3 ? "Cachorro" : "Gato",
                    description: pet.descricao || "",
                    temperament: pet.amigavel_outros_animais ? "Amigável com outros animais" : "Prefere estar sozinho",
                    veterinaryCare: [
                        pet.doenca_cronica && "Possui doença crônica",
                        pet.cuidados_constantes && "Requer cuidados constantes"
                    ].filter(Boolean).join(", ") || "Saudável",
                    livesWellWith: pet.cuidados_constantes ? "Ambiente com atenção especial" : "Ambiente adaptável",
                    socialWith: pet.necessidades_especiais ? "Necessita atenção especial" : "Sociável"
                };
            });

            setPets(convertedPets);
        } catch (error: any) {
            console.error('Erro ao buscar pets do usuário:', error);
            setError(error.message || 'Erro ao carregar seus pets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Conteúdo principal */}
            <div className="container mx-auto px-8 py-8">
                {/* Botão Cadastrar Pet */}
                <div className="mb-8 flex justify-start">
                    <button
                        onClick={onAddPetClick}
                        className="bg-red-300 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-red-400 transition duration-200"
                    >
                        <span className="text-xl">+</span>
                        CADASTRAR PET
                    </button>
                </div>

                {/* Estado de carregamento */}
                {loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Carregando seus pets...</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="bg-white rounded-2xl p-4 shadow-lg border-4 border-red-300 hover:shadow-xl transition duration-200 cursor-pointer"
                                onClick={() => onEditPet?.(pet)}
                            >
                                <div className="flex gap-4">
                                    {/* Imagem do pet */}
                                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                                        <span className="text-sm">Imagem</span>
                                    </div>

                                    {/* Informações do pet */}
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-bold text-lg text-gray-900">NOME: {pet.name}</h3>

                                        <div className="space-y-1 text-sm text-gray-800">
                                            <div><span className="font-medium">RAÇA:</span> {pet.breed}</div>
                                            <div><span className="font-medium">SEXO:</span> {pet.gender}</div>
                                            <div><span className="font-medium">PORTE:</span> {pet.size}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
