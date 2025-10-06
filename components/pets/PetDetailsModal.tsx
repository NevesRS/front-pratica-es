import React from "react";
import Modal from "../ui/Modal";

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
};

type PetDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    pet: PetDetails | null;
};

export default function PetDetailsModal({ isOpen, onClose, pet }: PetDetailsModalProps) {
    if (!pet) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 pb-8">
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
                </div>

                <div className="space-y-8">
                    {/* Imagem do pet centralizada no topo */}
                    <div className="flex justify-center">
                        <div className="w-80 h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border-2 border-gray-300">
                            <span>Imagem do {pet.name}</span>
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
                                <div>
                                    <span className="font-bold">CEP:</span> {pet.location}
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
                                    <h3 className="font-bold text-lg mb-4">CARACTERÍSTICAS SOBRE {pet.name.toUpperCase()}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">Cuidados Veterinários:</span>
                                            <div>{pet.characteristics.veterinaryCare}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Temperamento:</span>
                                            <div>{pet.characteristics.temperament}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Sociável com:</span>
                                            <div>{pet.characteristics.socialWith}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Vive bem com:</span>
                                            <div>{pet.characteristics.livesWellWith}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão Quero Adotar no final */}
                    <div className="text-center mb-4">
                        <button className="w-full bg-gray-100 text-2xl font-bold text-gray-800 py-6 px-6 rounded-xl transform transition duration-200 ease-in-out hover:bg-gray-200 hover:scale-105">
                            QUERO ADOTAR
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
