"use client";

import React, { useState } from "react"; // Precisamos do useState para alternar entre as telas
import Navbar from "../components/layout/Navbar";
import FilterItem from "../components/filters/FilterItem";
import PetCard from "../components/pets/PetCard";
import LoginPage from "../components/auth/LoginPage";
import { RegisterForm } from "../components/auth/RegisterForm";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import PetDetailsModal, { PetDetails } from "../components/pets/PetDetailsModal";
import MyPetsPage from "../components/pets/MyPetsPage";
import { PetRegisterForm } from "../components/pets/PetRegisterForm";
import PetTrackingModal, { PetTracking, getMockTracking } from "../components/pets/PetTrackingModal";
import { UserPet } from "../components/pets/MyPetsPage";
import ErrorScreen from "../components/auth/ErrorScreen";

// -----------------------------------------------------------
// 1. DADOS DE EXEMPLO
// -----------------------------------------------------------

// Numa aplicação real, estes dados viriam de uma API ou base de dados.
const pets: PetDetails[] = [
    {
        id: 1,
        name: "CHESTER",
        location: "PORTO ALEGRE - RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        type: "Cachorro",
        breed: "GOLDEN",
        gender: "MACHO",
        size: "PEQUENO",
        age: "1 ano",
        description: "Chester é um Golden Retriever de 1 ano, cheio de energia e carinho. Mora em Porto Alegre, RS e adora brincar de bolinha, correr no parque e estar perto das pessoas. De porte pequeno, já está castrado e vacinado, pronto para ser o melhor amigo de alguém que queira um companheiro fiel e alegre.",
        contact: {
            name: "Igor Ponticelli",
            email: "igor@email.com",
            phone: "51 91234-5678"
        },
        characteristics: {
            veterinaryCare: "Castrado",
            temperament: "Dócil, Brincalhão",
            socialWith: "Crianças, Desconhecidos",
            livesWellWith: "Casa com quintal"
        }
    },
    {
        id: 2,
        name: "LUNA",
        location: "GRAVATAI, RS",
        imageUrl: "https://images.unsplash.com/photo-1616886477817-48f572418a09?w=500&auto=format&fit=crop",
        type: "Gato",
        breed: "SRD",
        gender: "FÊMEA",
        size: "MÉDIO",
        age: "2 anos",
        description: "Luna é uma gatinha muito carinhosa e independente. Adora ficar no sol e brincar com bolinhas de papel. É muito sociável e se dá bem com outros gatos.",
        contact: {
            name: "Maria Silva",
            email: "maria@email.com",
            phone: "51 98765-4321"
        },
        characteristics: {
            veterinaryCare: "Castrada, Vacinada",
            temperament: "Carinhosa, Independente",
            socialWith: "Outros gatos, Adultos",
            livesWellWith: "Apartamento"
        }
    },
    {
        id: 3,
        name: "MAX",
        location: "CANOAS, RS",
        imageUrl: "https://images.unsplash.com/photo-1560700055-a0c5c4e7436b?w=500&auto=format&fit=crop",
        type: "Cachorro",
        breed: "LABRADOR",
        gender: "MACHO",
        size: "GRANDE",
        age: "3 anos",
        description: "Max é um Labrador muito energético e leal. Adora nadar e buscar objetos. É perfeito para famílias ativas.",
        contact: {
            name: "João Santos",
            email: "joao@email.com",
            phone: "51 99888-7777"
        },
        characteristics: {
            veterinaryCare: "Castrado, Vacinado",
            temperament: "Energético, Leal",
            socialWith: "Crianças, Outros cães",
            livesWellWith: "Casa com quintal grande"
        }
    }
];

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

    // Estado para controlar a tela de erro
    const [isErrorView, setIsErrorView] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estado para controlar o modal
    const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para controlar o modal de rastreamento
    const [selectedUserPet, setSelectedUserPet] = useState<UserPet | null>(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

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
    const handlePetClick = (pet: PetDetails) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPet(null);
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
                                    <FilterItem label="ESPÉCIE" />
                                    <FilterItem label="CEP" />
                                    <FilterItem label="RAÇA" />
                                    <FilterItem label="PORTE" />
                                    <FilterItem label="SEXO" />

                                    <div className="mt-6 flex flex-col gap-2">
                                        <button className="w-full bg-red-500 text-white py-2 rounded-lg font-bold transform transition duration-200 ease-in-out hover:bg-red-600 hover:scale-105">
                                            FILTRAR
                                        </button>
                                        <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold transform transition duration-200 ease-in-out hover:bg-gray-300 hover:scale-105">
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
                                            placeholder="Pesquisar..."
                                            className="flex-1 p-2 focus:outline-none"
                                        />
                                        <span className="p-2 cursor-pointer rounded hover:bg-gray-100 transition-colors duration-150">
                                            🔍
                                        </span>
                                    </div>

                                    {/* Grid de Cartões de Animais */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pets.map((pet) => (
                                            <PetCard
                                                key={pet.id}
                                                name={pet.name}
                                                location={pet.location}
                                                imageUrl={pet.imageUrl}
                                                onClick={() => handlePetClick(pet)}
                                            />
                                        ))}
                                    </div>
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
            />

            {/* Modal de rastreamento do pet */}
            <PetTrackingModal
                isOpen={isTrackingModalOpen}
                onClose={handleCloseTrackingModal}
                petTracking={selectedUserPet ? getMockTracking(selectedUserPet) : null}
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
