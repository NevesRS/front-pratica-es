import React from "react";

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
    cep?: string;
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

// Dados mock dos pets do usuário logado
const userPets: UserPet[] = [
    {
        id: 1,
        name: "CHESTER",
        breed: "GOLDEN",
        gender: "MACHO",
        size: "PEQUENO",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        temperament: "Dócil, Brincalhão",
        veterinaryCare: "Castrado, Vacinado",
        livesWellWith: "Casa com quintal",
        socialWith: "Crianças, Outros cães",
        cep: "90010-000",
        age: "1 ano",
        type: "Cachorro",
        description: "Chester é um Golden Retriever muito especial que foi resgatado ainda filhote. Ele adora brincar e é muito carinhoso com crianças. Tem muita energia e precisa de exercícios diários, mas também ama momentos de carinho no sofá.",
        contact: {
            name: "Maria Santos",
            email: "maria.santos@email.com",
            phone: "51 99876-5432"
        }
    },
    {
        id: 2,
        name: "LUNA",
        breed: "SRD",
        gender: "FÊMEA",
        size: "MÉDIO",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        temperament: "Carinhosa, Independente",
        veterinaryCare: "Castrada, Vacinada",
        livesWellWith: "Apartamento",
        socialWith: "Crianças, Outros gatos",
        cep: "90020-000",
        age: "2 anos",
        type: "Gato",
        description: "Luna é uma gatinha muito especial que foi encontrada ainda pequena. É muito carinhosa mas também independente, perfeita para quem busca um companheiro tranquilo e afetuoso.",
        contact: {
            name: "João Silva",
            email: "joao.silva@email.com",
            phone: "51 98765-4321"
        }
    },
    {
        id: 3,
        name: "BUDDY",
        breed: "LABRADOR",
        gender: "MACHO",
        size: "GRANDE",
        location: "CANOAS - RS",
        imageUrl: "https://images.unsplash.com/photo-1560700055-a0c5c4e7436b?w=500&auto=format&fit=crop",
        temperament: "Energético, Leal",
        veterinaryCare: "Castrado, Vacinado, Vermifugado",
        livesWellWith: "Casa com quintal grande",
        socialWith: "Crianças, Adultos, Outros cães",
        cep: "92010-000",
        age: "3 anos"
    },
    {
        id: 4,
        name: "MIMI",
        breed: "PERSA",
        gender: "FÊMEA",
        size: "PEQUENO",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        temperament: "Calma, Carinhosa",
        veterinaryCare: "Castrada, Vacinada",
        livesWellWith: "Apartamento tranquilo",
        socialWith: "Adultos, Ambiente calmo",
        cep: "90030-000",
        age: "5 anos"
    },
    {
        id: 5,
        name: "THOR",
        breed: "PASTOR ALEMÃO",
        gender: "MACHO",
        size: "GRANDE",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        temperament: "Protetor, Inteligente",
        veterinaryCare: "Castrado, Vacinado, Adestrado",
        livesWellWith: "Casa com quintal",
        socialWith: "Família, Crianças maiores",
        cep: "90040-000",
        age: "4 anos"
    },
    {
        id: 6,
        name: "BELLA",
        breed: "YORKSHIRE",
        gender: "FÊMEA",
        size: "PEQUENO",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        temperament: "Esperta, Afetuosa",
        veterinaryCare: "Castrada, Vacinada",
        livesWellWith: "Apartamento ou casa",
        socialWith: "Toda a família",
        cep: "90050-000",
        age: "2 anos"
    }
];

export default function MyPetsPage({ onBackClick, onAddPetClick, onEditPet }: MyPetsPageProps) {
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

                {/* Grid de pets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userPets.map((pet) => (
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
                                        <div><span className="font-medium">CEP:</span> {pet.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
