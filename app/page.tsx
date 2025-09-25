"use client";

import React, { useState } from "react"; // Precisamos do useState para alternar entre as telas
import Navbar from "../components/layout/Navbar";
import FilterItem from "../components/filters/FilterItem";
import PetCard from "../components/pets/PetCard";
import LoginPage from "../components/auth/LoginPage";
import { RegisterForm } from "../components/auth/RegisterForm";

// -----------------------------------------------------------
// 1. DADOS DE EXEMPLO
// -----------------------------------------------------------

// Numa aplicação real, estes dados viriam de uma API ou base de dados.
const pets = [
    {
        id: 1,
        name: "GATO",
        location: "PORTO ALEGRE, RS",
        imageUrl: "https://images.unsplash.com/photo-1548247425-a6e54f979145?w=500&auto=format&fit=crop",
        type: "Gato",
    },
    {
        id: 2,
        name: "CACHORRO",
        location: "GRAVATAI, RS",
        imageUrl: "https://images.unsplash.com/photo-1616886477817-48f572418a09?w=500&auto=format&fit=crop",
        type: "Cachorro",
    },
    {
        id: 3,
        name: "CACHORRO E DOG",
        location: "CANOAS, RS",
        imageUrl: "https://images.unsplash.com/photo-1560700055-a0c5c4e7436b?w=500&auto=format&fit=crop",
        type: "Cachorro",
    },
    {
        id: 4,
        name: "CACHORRO",
        location: "PORTO ALEGRE, RS",
        imageUrl: "https://images.unsplash.com/photo-1536750356515-b547285513ba?w=500&auto=format&fit=crop",
        type: "Cachorro",
    },
    {
        id: 5,
        name: "GATO",
        location: "SAPUCAIA DO SUL, RS",
        imageUrl: "https://images.unsplash.com/photo-1574921980838-8957816f192b?w=500&auto=format&fit=crop",
        type: "Gato",
    },
    {
        id: 6,
        name: "GATO",
        location: "SAO LEOPOLDO, RS",
        imageUrl: "https://images.unsplash.com/photo-1514888286973-41a45831934c?w=500&auto=format&fit=crop",
        type: "Gato",
    },
];

// -----------------------------------------------------------
// 2. COMPONENTES REUTILIZÁVEIS
// -----------------------------------------------------------

// The components (Navbar, FilterItem, PetCard, LoginPage) were moved to separate files under components/

// -----------------------------------------------------------
// 4. COMPONENTE PRINCIPAL (Home) - SWITCH DE TELAS
// -----------------------------------------------------------

export default function Home() {
    // Estado para controlar qual tela está visível
    const [isLoginView, setIsLoginView] = useState(false);
    const [isRegisterView, setIsRegisterView] = useState(false);

    // Função para mostrar a tela de Login
    const handleLoginClick = () => setIsLoginView(true);

    // Função para voltar à tela principal/Home
    const handleHomeClick = () => setIsLoginView(false);
    const handleRegisterClick = () => setIsRegisterView(true);
    const handleBackFromRegister = () => setIsRegisterView(false);


    return (
        <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col">
            {/* 💡 A Navbar agora recebe as funções de clique e o estado para se adaptar */}
            <Navbar
                isLoginView={isLoginView}
                onLoginClick={handleLoginClick}
                onHomeClick={handleHomeClick}
                onRegisterClick={handleRegisterClick}
            />

            {/* Alterna entre as views */}
            {isRegisterView ? (
                <div className="container mx-auto p-8 flex justify-center items-center flex-1">
                    <RegisterForm onBackClick={handleBackFromRegister} />
                </div>
            ) : isLoginView ? (
                <LoginPage onBackClick={handleHomeClick} />
            ) : (
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
                                />
                            ))}
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
}