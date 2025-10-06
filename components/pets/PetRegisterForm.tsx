// components/pets/PetRegisterForm.tsx
import React, { useState } from 'react';

interface PetRegisterFormProps {
    onBackClick: () => void;
}

export const PetRegisterForm: React.FC<PetRegisterFormProps> = ({ onBackClick }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para salvar o pet
        console.log('Pet cadastrado!');
        onBackClick(); // Volta para a tela anterior após cadastrar
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">CADASTRAR PET</h1>
            </div>

            <div className="flex-1 flex justify-center items-center p-4">
                {/* Contêiner principal com a divisão de dois lados */}
                <div className="w-full max-w-4xl flex bg-white rounded-xl shadow-2xl border border-gray-200 z-10 overflow-hidden">

                    {/* Lado Esquerdo - Informações e Upload de Foto */}
                    <div className="w-2/5 bg-red-400 p-8 flex flex-col justify-between text-white border-r-4 border-red-500">
                        <div>
                            <h2 className="text-2xl font-extrabold mb-4">INFORMAÇÕES</h2>
                            <p className="text-sm leading-relaxed mb-6">
                                Se você deseja anunciar um cão ou gato para adoção ou precisa registrar
                                um que encontrou, este é o espaço ideal.
                                Preencha as informações do animal e ajude a aumentar as chances de
                                encontrar um novo lar ou o dono de volta.
                                Lembre-se: uma boa foto faz toda a diferença!
                            </p>

                            <h3 className="text-xl font-bold mb-4">ACRESCENTE UMA FOTO</h3>

                            {/* Upload de Foto */}
                            <div className="mb-6">
                                <label htmlFor="petPhoto" className="cursor-pointer">
                                    <div className="w-75 h-75 border-4 border-white border-dashed rounded-lg flex items-center justify-center bg-red-300 hover:bg-red-350 transition duration-200">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview do pet"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-center text-white">
                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-4xl font-bold">+</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <input
                                    id="petPhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <button
                            onClick={onBackClick}
                            className="w-fit text-sm font-bold mt-4 p-2 px-4 rounded hover:bg-red-500 transition duration-200 border border-white"
                        >
                            VOLTAR
                        </button>
                    </div>

                    {/* Lado Direito - Formulário de Cadastro do Pet */}
                    <div className="w-3/5 p-8">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800">CADASTRAR PET</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Primeira linha - CEP */}
                            <input
                                type="text"
                                placeholder="CEP"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />

                            {/* Segunda linha - Nome e Temperamento */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="NOME"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="TEMPERAMENTO"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Terceira linha - Raça e Cuidados Veterinários */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="RAÇA"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="CUIDADOS VETERINÁRIOS"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Quarta linha - Sexo e Vive Bem Com */}
                            <div className="flex gap-4">
                                <select className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500">
                                    <option value="">SEXO</option>
                                    <option value="macho">MACHO</option>
                                    <option value="femea">FÊMEA</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="VIVE BEM COM"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Quinta linha - Porte e Sociável Com */}
                            <div className="flex gap-4">
                                <select className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500">
                                    <option value="">PORTE</option>
                                    <option value="pequeno">PEQUENO</option>
                                    <option value="medio">MÉDIO</option>
                                    <option value="grande">GRANDE</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="SOCIÁVEL COM"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            {/* Campo de Descrição */}
                            <div>
                                <textarea
                                    placeholder="DESCRIÇÃO DO ANIMAL (História, características especiais, etc.)"
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
                                />
                            </div>

                            {/* Termos de serviço */}
                            <p className="text-xs text-gray-600 mt-2">
                                Ao se cadastrar, você concorda com os <a href="#" className="underline font-medium text-red-500 hover:text-red-700">termos de serviço</a>
                            </p>

                            {/* Botão de Cadastrar */}
                            <button
                                type="submit"
                                className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200"
                            >
                                CADASTRAR PET
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
