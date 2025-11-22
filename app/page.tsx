"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import FilterItem from "../components/filters/FilterItem";
import FilterItemRaca from "../components/filters/FilterItemRaca";
import PetCard from "../components/pets/PetCard";
import LoginPage from "../components/auth/LoginPage";
import { RegisterForm } from "../components/auth/RegisterForm";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import PetDetailsModal, { PetDetails } from "../components/pets/PetDetailsModal";
import MyPetsPage from "../components/pets/MyPetsPage";
import { PetRegisterForm } from "../components/pets/PetRegisterForm";
import PetTrackingModal from "../components/pets/PetTrackingModal";
import { UserPet } from "../components/pets/MyPetsPage";
import ErrorScreen from "../components/auth/ErrorScreen";
import { petService, Pet } from "../services/petService";
import HeuristicPage from "../components/pets/HeuristicPage";

// -----------------------------------------------------------
// 2. COMPONENTES REUTILIZÁVEIS
// -----------------------------------------------------------

// The components (Navbar, FilterItem, PetCard, LoginPage) were moved to separate files under components/

// -----------------------------------------------------------
// 4. COMPONENTE PRINCIPAL (Home) - SWITCH DE TELAS
// -----------------------------------------------------------

function HomeContent() {
    const { isLoading } = useAuth();

    // Estado para controlar qual tela está visível
    const [isLoginView, setIsLoginView] = useState(false);
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [isMyPetsView, setIsMyPetsView] = useState(false);
    const [isPetRegisterView, setIsPetRegisterView] = useState(false);
    const [isHeuristicView, setIsHeuristicView] = useState(false);

    // Estado para controlar a tela de erro
    const [isErrorView, setIsErrorView] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estado para os pets da API
    const [pets, setPets] = useState<Pet[]>([]);
    const [petsLoading, setPetsLoading] = useState(false);
    const [petsError, setPetsError] = useState<string | null>(null);

    // Estado para busca
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPets, setFilteredPets] = useState<Pet[]>([]);

    // Estado para filtros
    const [filters, setFilters] = useState({
        especie: '',
        raca: '',
        porte: '',
        sexo: ''
    });

    // Estado para controlar o modal
    const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    // Estado para controlar o modal de rastreamento
    const [selectedUserPet, setSelectedUserPet] = useState<UserPet | null>(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

    // Buscar pets ao carregar a página
    useEffect(() => {
        loadPets();
    }, []);

    // Recarregar pets quando filtros mudarem
    useEffect(() => {
        loadPets();
    }, [filters]);

    // Filtrar pets quando o termo de busca ou a lista de pets mudar
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPets(pets);
        } else {
            const filtered = pets.filter(pet =>
                pet.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPets(filtered);
        }
    }, [searchTerm, pets]);

    const loadPets = async () => {
        try {
            setPetsLoading(true);
            setPetsError(null);

            // Construir query params baseados nos filtros
            const params = new URLSearchParams();
            if (filters.especie) params.append('especie', filters.especie);
            if (filters.raca) params.append('raca', filters.raca);
            if (filters.porte) params.append('porte', filters.porte);
            if (filters.sexo) params.append('sexo', filters.sexo);

            const queryString = params.toString();
            const url = queryString ? `?${queryString}` : '';

            const data = await petService.getPetsWithFilters(url);
            setPets(data);
            setFilteredPets(data);
        } catch (error: any) {
            console.error('Erro ao buscar pets:', error);
            setPetsError(error.message || 'Erro ao carregar pets');
        } finally {
            setPetsLoading(false);
        }
    };

    // Componente de loading
    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando...</p>
                </div>
            </div>
        );
    }

    // Função para mostrar a tela de Login
    const handleLoginClick = () => {
        setIsLoginView(true);
        setIsMyPetsView(false);
        setIsRegisterView(false);
    };

    // Função para voltar à tela principal/Home
    const handleHomeClick = () => {
        setIsLoginView(false);
        setIsMyPetsView(false);
        setIsRegisterView(false);
        setIsPetRegisterView(false);
    };

    // Função para mostrar a tela de cadastro
    const handleRegisterClick = () => {
        setIsRegisterView(true);
        setIsLoginView(false);
        setIsMyPetsView(false);
        setIsPetRegisterView(false);
    };

    const handleBackFromRegister = () => setIsRegisterView(false);

    // Função para mostrar a tela de cadastro de pet
    const handlePetRegisterClick = () => {
        setIsPetRegisterView(true);
        setIsLoginView(false);
        setIsMyPetsView(false);
        setIsRegisterView(false);
    };

    const handleBackFromPetRegister = () => {
        setIsPetRegisterView(false);
        setIsMyPetsView(true); // Volta para Meus Pets
    };

    // Função para mostrar Meus Pets
    const handleMyPetsClick = () => {
        setIsMyPetsView(true);
        setIsPetRegisterView(false);
        setIsLoginView(false);
        setIsRegisterView(false);
    };

    // Função para voltar à tela de pesquisa
    const handleSearchClick = () => {
        setIsLoginView(false);
        setIsMyPetsView(false);
        setIsRegisterView(false);
        setIsPetRegisterView(false);
        setIsErrorView(false);
        setIsHeuristicView(false);
    };

    // Função para mostrar a tela de sugestões
    const handleHeuristicClick = () => {
        setIsHeuristicView(true);
        setIsLoginView(false);
        setIsMyPetsView(false);
        setIsRegisterView(false);
        setIsPetRegisterView(false);
        setIsErrorView(false);
    };

    // Função para lidar com erros de login
    const handleLoginError = (error: string) => {
        console.log('HomeContent: Erro de login recebido:', error);
        setErrorMessage(error);
        setIsErrorView(true);
        setIsLoginView(false);
    };

    // Função para voltar do erro para o login
    const handleRetryLogin = () => {
        console.log('HomeContent: Voltando do erro para login');
        setIsErrorView(false);
        setIsLoginView(true);
        setErrorMessage('');
    };

    // Funções para gerenciar o modal
    const handlePetClick = async (pet: Pet | number) => {
        // Validar se pet existe
        if (!pet) {
            console.error('Pet inválido recebido');
            return;
        }

        // Abre o modal imediatamente com loading
        setIsModalOpen(true);
        setIsModalLoading(true);
        setSelectedPet(null);

        try {
            // Se receber um número, é o ID do pet; se for objeto Pet, pegar o id_pet
            const petId = typeof pet === 'number' ? pet : pet.id_pet;
            // Preservar o score se vier de um objeto Pet
            const petScore = typeof pet === 'object' && pet.score !== undefined ? pet.score : undefined;

            // Buscar detalhes completos do pet
            const petDetails = await petService.getPetById(petId);

            // Converter o formato da API para o formato do modal
            const petForModal: PetDetails = {
                id: petDetails.id_pet,
                name: petDetails.nome.toUpperCase(),
                location: "RS",
                imageUrl: petDetails.foto || "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
                type: petDetails.especie === 3 ? "Cachorro" : "Gato",
                breed: "SRD",
                gender: petDetails.sexo === 1 ? "MACHO" : petDetails.sexo === 2 ? "FÊMEA" : "DESCONHECIDO",
                size: (() => {
                    const sizeMap: Record<number, string> = {
                        1: "PEQUENO",
                        2: "MÉDIO",
                        3: "GRANDE",
                        4: "MUITO GRANDE"
                    };
                    return sizeMap[Number(petDetails.porte)] || "DESCONHECIDO";
                })(),
                age: (() => {
                    const ageMap: Record<number, string> = {
                        1: "FILHOTE",
                        2: "ADULTO",
                        3: "IDOSO",
                        4: "INDIFERENTE"
                    };
                    return ageMap[petDetails.idade] || "DESCONHECIDO";
                })(),
                description: petDetails.descricao || "Sem descrição disponível",
                contact: {
                    name: "Contato disponível via ONG",
                    email: "contato@ong.com",
                    phone: "Contato via ONG"
                },
                characteristics: {
                    veterinaryCare: petDetails.doenca_cronica
                        ? "Possui doença crônica - requer acompanhamento veterinário regular"
                        : "Sem doenças crônicas conhecidas",
                    temperament: petDetails.amigavel_outros_animais
                        ? "Amigável com outros animais - convive bem em ambientes com outros pets"
                        : "Prefere ser o único pet - pode não se adaptar bem com outros animais",
                    socialWith: petDetails.necessidades_especiais
                        ? "Possui necessidades especiais - requer atenção e cuidados específicos"
                        : "Sem necessidades especiais",
                    livesWellWith: petDetails.cuidados_constantes
                        ? "Requer cuidados constantes - ideal para tutores com disponibilidade de tempo"
                        : "Cuidados básicos - rotina de cuidados padrão"
                },
                score: petScore
            };

            setSelectedPet(petForModal);
        } catch (error: any) {
            console.error('Erro ao buscar detalhes do pet:', error);
            // Fecha o modal em caso de erro
            setIsModalOpen(false);
            setPetsError(error.message || 'Erro ao carregar detalhes do pet');
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPet(null);
        setIsModalLoading(false);
    };

    // Funções para gerenciar o modal de rastreamento
    const handleUserPetClick = (userPet: UserPet) => {
        setSelectedUserPet(userPet);
        setIsTrackingModalOpen(true);
    };

    const handleCloseTrackingModal = () => {
        setIsTrackingModalOpen(false);
        setSelectedUserPet(null);
    };


    return (
        <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col">
            {/* Alterna entre as views */}
            {isPetRegisterView ? (
                <PetRegisterForm onBackClick={handleBackFromPetRegister} />
            ) : isHeuristicView ? (
                <>
                    <Navbar
                        isLoginView={false}
                        onLoginClick={handleLoginClick}
                        onHomeClick={handleHomeClick}
                        onRegisterClick={handleRegisterClick}
                        onMyPetsClick={handleMyPetsClick}
                        onSearchClick={handleSearchClick}
                        onHeuristicClick={handleHeuristicClick}
                        currentPage="heuristic"
                        onLogoutCallback={handleHomeClick}
                    />
                    <HeuristicPage onPetClick={handlePetClick} />
                </>
            ) : isMyPetsView ? (
                <>
                    {/* Navbar também na tela Meus Pets */}
                    <Navbar
                        isLoginView={false}
                        onLoginClick={handleLoginClick}
                        onHomeClick={handleHomeClick}
                        onRegisterClick={handleRegisterClick}
                        onMyPetsClick={handleMyPetsClick}
                        onSearchClick={handleSearchClick}
                        onHeuristicClick={handleHeuristicClick}
                        currentPage="mypets"
                        onLogoutCallback={handleHomeClick}
                    />
                    <MyPetsPage
                        onBackClick={handleSearchClick}
                        onAddPetClick={handlePetRegisterClick}
                        onEditPet={handleUserPetClick}
                    />
                </>
            ) : isErrorView ? (
                <ErrorScreen
                    errorMessage={errorMessage}
                    onRetry={handleRetryLogin}
                    autoReturnDelay={4000}
                />
            ) : (
                <>
                    {isRegisterView ? (
                        <RegisterForm onBackClick={handleBackFromRegister} />
                    ) : isLoginView ? (
                        <LoginPage
                            onBackClick={handleHomeClick}
                            onRegisterClick={handleRegisterClick}
                            onError={handleLoginError}
                        />
                    ) : (
                        <>
                            {/* 💡 A Navbar agora recebe as funções de clique e o estado para se adaptar */}
                            <Navbar
                                isLoginView={isLoginView}
                                onLoginClick={handleLoginClick}
                                onHomeClick={handleHomeClick}
                                onRegisterClick={handleRegisterClick}
                                onMyPetsClick={handleMyPetsClick}
                                onSearchClick={handleSearchClick}
                                onHeuristicClick={handleHeuristicClick}
                                currentPage="search"
                                onLogoutCallback={handleHomeClick}
                            />

                            {/* Header da página inicial */}
                            <div className="bg-white px-8 py-6 border-b border-gray-200">
                                <h1 className="text-3xl font-bold text-gray-900">PESQUISAR PETS</h1>
                            </div>

                            <div className="container mx-auto p-8 flex gap-8 flex-1">
                                {/* Barra Lateral de Filtros */}
                                <aside className="w-1/4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
                                    <h2 className="text-xl font-bold mb-4">FILTRAR PETS</h2>
                                    <FilterItem
                                        label="ESPÉCIE"
                                        onChange={(value) => setFilters(prev => ({ ...prev, especie: value, raca: '' }))}
                                    />
                                    <FilterItemRaca
                                        label="RAÇA"
                                        especieSelecionada={filters.especie ? parseInt(filters.especie) : null}
                                        onChange={(value) => setFilters(prev => ({ ...prev, raca: value }))}
                                    />
                                    <FilterItem
                                        label="PORTE"
                                        onChange={(value) => setFilters(prev => ({ ...prev, porte: value }))}
                                    />
                                    <FilterItem
                                        label="SEXO"
                                        onChange={(value) => setFilters(prev => ({ ...prev, sexo: value }))}
                                    />

                                    <div className="mt-6 flex flex-col gap-2">
                                        <button
                                            onClick={loadPets}
                                            className="w-full bg-red-500 text-white py-2 rounded-lg font-bold transform transition duration-200 ease-in-out hover:bg-red-600 hover:scale-105"
                                        >
                                            FILTRAR
                                        </button>
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
                                    <div className="mb-8 flex items-center bg-white p-2 rounded-lg shadow-md border border-gray-300">
                                        <input
                                            type="text"
                                            placeholder="Pesquisar por nome do pet..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 p-2 focus:outline-none"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <span className="p-2 text-gray-400">
                                            🔍
                                        </span>
                                    </div>

                                    {/* Grid de Cartões de Animais */}
                                    {petsLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
                                                <p className="text-gray-600 text-lg">Carregando pets...</p>
                                            </div>
                                        </div>
                                    ) : petsError ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="text-center">
                                                <p className="text-red-500 text-lg mb-4">{petsError}</p>
                                                <button
                                                    onClick={loadPets}
                                                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition"
                                                >
                                                    Tentar Novamente
                                                </button>
                                            </div>
                                        </div>
                                    ) : filteredPets.length === 0 ? (
                                        <div className="flex justify-center items-center h-64">
                                            <p className="text-gray-500 text-lg">
                                                {searchTerm
                                                    ? `Nenhum pet encontrado com o nome "${searchTerm}"`
                                                    : 'Nenhum pet encontrado'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredPets.map((pet) => (
                                                <PetCard
                                                    key={pet.id_pet}
                                                    name={pet.nome.toUpperCase()}
                                                    especie={pet.especie === 3 ? "CACHORRO" : pet.especie === 4 ? "GATO" : "OUTRO"}
                                                    imageUrl={pet.foto || "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop"}
                                                    onClick={() => handlePetClick(pet)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </main>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Modal de detalhes do pet */}
            <PetDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pet={selectedPet}
                isLoading={isModalLoading}
            />

            {/* Modal de rastreamento do pet */}
            <PetTrackingModal
                isOpen={isTrackingModalOpen}
                onClose={handleCloseTrackingModal}
                petId={selectedUserPet?.id || null}
                pet={selectedUserPet}
            />
        </div>
    );
}

export default function Home() {
    return (
        <AuthProvider>
            <HomeContent />
        </AuthProvider>
    );
}
