import React from "react";

type PetCardProps = {
    name: string;
    especie: string;
    imageUrl: string;
    onClick?: () => void;
    score?: number;
};

export default function PetCard({ name, especie, imageUrl, onClick, score }: PetCardProps) {
    const DOG_URL = 'https://love.doghero.com.br/wp-content/uploads/2018/12/golden-retriever-1.png';
    const CAT_URL = 'https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg';

    const getImage = () => {
        const type = (especie || '').toString().toLowerCase();
        if (type.includes('cach') || type.includes('dog')) return DOG_URL;
        if (type.includes('gat') || type.includes('cat')) return CAT_URL;
        if (imageUrl && imageUrl.trim() !== '') return imageUrl;
        return '';
    };

    const imgSrc = getImage();

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden p-3 flex flex-col items-center border-4 border-pink-300/80 transform hover:scale-[1.02] transition duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="w-full h-48 relative mb-3 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {imgSrc ? (
                    <img src={imgSrc} alt={`Imagem de ${name}`} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-500">Imagem</div>
                )}
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
