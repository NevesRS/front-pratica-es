import React from "react";

type PetCardProps = {
    name: string;
    location: string;
    imageUrl: string;
    onClick?: () => void;
};

export default function PetCard({ name, location, imageUrl, onClick }: PetCardProps) {
    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden p-3 flex flex-col items-center border-4 border-pink-300/80 transform hover:scale-[1.02] transition duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="w-full h-48 relative mb-3 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <span>Imagem</span>
            </div>
            <h3 className="text-xl font-extrabold text-red-500 uppercase">{name}</h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
                <span className="mr-1 text-base">📍</span>
                <span className="font-medium">{location}</span>
            </div>
        </div>
    );
}
