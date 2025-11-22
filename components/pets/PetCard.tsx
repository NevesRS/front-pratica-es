import React from "react";

type PetCardProps = {
    name: string;
    especie: string;
    imageUrl: string;
    onClick?: () => void;
    score?: number;
};

export default function PetCard({ name, especie, imageUrl, onClick, score }: PetCardProps) {
    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden p-3 flex flex-col items-center border-4 border-pink-300/80 transform hover:scale-[1.02] transition duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="w-full h-48 relative mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                {/* Espaço reservado para imagem */}
            </div>
            <h3 className="text-xl font-extrabold text-red-500 uppercase">{name}</h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
                <span className="font-medium">{especie}</span>
            </div>
            {score !== undefined && (
                <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Compatibilidade: {score.toFixed(2)}%
                </div>
            )}
        </div>
    );
}
