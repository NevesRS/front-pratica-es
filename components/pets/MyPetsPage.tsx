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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPets, setFilteredPets] = useState<UserPet[]>([]);
    const [filters, setFilters] = useState({
        especie: '',
        raca: '',
        porte: '',
        sexo: ''
    });

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

            // Buscar todas as raças para fazer o mapeamento
            const racas = await petService.getRacas();

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

                // Buscar nome da raça
                let breedName = "SRD";
                if (pet.raca) {
                    const racaEncontrada = racas.find(r => r.id_raca_pet === pet.raca);
                    if (racaEncontrada) {
                        breedName = racaEncontrada.raca;
                    }
                }

                return {
                    id: pet.id_pet,
                    name: pet.nome.toUpperCase(),
                    breed: breedName,
                    gender: genderMap[pet.sexo || 0] || "DESCONHECIDO",
                    size: sizeMap[Number(pet.porte)] || "DESCONHECIDO",
                    location: "",
                    imageUrl: pet.foto || "",
                    age: ageMap[pet.idade] || "DESCONHECIDO",
                    type: pet.especie === 1 ? "Gato" : "Cachorro",
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
            setFilteredPets(convertedPets);
        } catch (error: any) {
            console.error('Erro ao buscar pets do usuário:', error);
            setError(error.message || 'Erro ao carregar seus pets');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar pets quando o termo de busca ou filtros mudarem
    useEffect(() => {
        let result = [...pets];

        // Filtro de busca por nome
        if (searchTerm.trim() !== '') {
            result = result.filter(pet =>
                pet.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro de espécie
        if (filters.especie) {
            const especieNome = filters.especie === '1' ? 'Gato' : 'Cachorro';
            result = result.filter(pet => pet.type === especieNome);
        }

        // Filtro de porte
        if (filters.porte) {
            const porteMap: Record<string, string> = {
                '1': 'PEQUENO',
                '2': 'MÉDIO',
                '3': 'GRANDE',
                '4': 'MUITO GRANDE'
            };
            const porteNome = porteMap[filters.porte];
            result = result.filter(pet => pet.size === porteNome);
        }

        // Filtro de sexo
        if (filters.sexo) {
            const sexoMap: Record<string, string> = {
                '1': 'MACHO',
                '2': 'FÊMEA'
            };
            const sexoNome = sexoMap[filters.sexo];
            result = result.filter(pet => pet.gender === sexoNome);
        }

        setFilteredPets(result);
    }, [searchTerm, filters, pets]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header da página */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">MEUS PETS</h1>
            </div>

            {/* Conteúdo principal com filtros */}
            <div className="container mx-auto p-8 flex gap-8">
                {/* Barra Lateral de Filtros */}
                <aside className="w-1/4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-xl font-bold mb-4">FILTRAR PETS</h2>
                    <div className="space-y-4">
                        {/* Filtro de Espécie */}
                        <div>
                            <label className="block text-sm font-bold mb-2">ESPÉCIE</label>
                            <select
                                value={filters.especie}
                                onChange={(e) => setFilters(prev => ({ ...prev, especie: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Todas</option>
                                <option value="1">Gato</option>
                                <option value="2">Cachorro</option>
                            </select>
                        </div>

                        {/* Filtro de Porte */}
                        <div>
                            <label className="block text-sm font-bold mb-2">PORTE</label>
                            <select
                                value={filters.porte}
                                onChange={(e) => setFilters(prev => ({ ...prev, porte: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Todos</option>
                                <option value="1">Pequeno</option>
                                <option value="2">Médio</option>
                                <option value="3">Grande</option>
                                <option value="4">Muito Grande</option>
                            </select>
                        </div>

                        {/* Filtro de Sexo */}
                        <div>
                            <label className="block text-sm font-bold mb-2">SEXO</label>
                            <select
                                value={filters.sexo}
                                onChange={(e) => setFilters(prev => ({ ...prev, sexo: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Todos</option>
                                <option value="1">Macho</option>
                                <option value="2">Fêmea</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                setFilters({ especie: '', raca: '', porte: '', sexo: '' });
                                setSearchTerm('');
                            }}
                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold transform transition duration-200 ease-in-out hover:bg-gray-300 hover:scale-105"
                        >
                            LIMPAR FILTROS
                        </button>
                    </div>
                </aside>

                {/* Área de Conteúdo Principal */}
                <main className="flex-1">
                    {/* Barra de Pesquisa */}
                    <div className="mb-6 flex items-center bg-white p-2 rounded-lg shadow-md border border-gray-300">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome do pet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 focus:outline-none"
                        />
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 ml-2">
                            🔍
                        </button>
                    </div>

                    {/* Botão Cadastrar Pet */}
                    <div className="mb-6 flex justify-start">
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
                            {filteredPets.length === 0 ? (
                                <div className="col-span-2 text-center py-8">
                                    <p className="text-gray-600">Nenhum pet encontrado com os filtros selecionados.</p>
                                </div>
                            ) : (
                                filteredPets.map((pet) => (
                                    <div
                                        key={pet.id}
                                        className="bg-white rounded-2xl p-4 shadow-lg border-4 border-red-300 hover:shadow-xl transition duration-200 cursor-pointer"
                                        onClick={() => onEditPet?.(pet)}
                                    >
                                        <div className="flex gap-4">
                                                {/* Imagem do pet */}
                                                <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                                                    {pet.imageUrl || pet.type ? (
                                                        (() => {
                                                            const DOG_URL = 'https://love.doghero.com.br/wp-content/uploads/2018/12/golden-retriever-1.png';
                                                            const CAT_URL = 'https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg';
                                                            const type = (pet.type || '').toString().toLowerCase();
                                                            const src = type.includes('cach') || type.includes('dog') ? DOG_URL : type.includes('gat') || type.includes('cat') ? CAT_URL : (pet.imageUrl || '');
                                                            return src ? <img src={src} alt={`Imagem de ${pet.name}`} className="w-full h-full object-cover" /> : <span className="text-sm">Imagem</span>;
                                                        })()
                                                    ) : (
                                                        <span className="text-sm">Imagem</span>
                                                    )}
                                                </div>

                                            {/* Informações do pet */}
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-bold text-lg text-gray-900">NOME: {pet.name}</h3>

                                                <div className="space-y-1 text-sm text-gray-800">
                                                    <div><span className="font-medium">ESPÉCIE:</span> {pet.type}</div>
                                                    <div><span className="font-medium">RAÇA:</span> {pet.breed}</div>
                                                    <div><span className="font-medium">SEXO:</span> {pet.gender}</div>
                                                    <div><span className="font-medium">PORTE:</span> {pet.size}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
