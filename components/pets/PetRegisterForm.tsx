// components/pets/PetRegisterForm.tsx
import React, { useState, useEffect } from 'react';
import { petService, CreatePetData, Raca } from '@/services/petService';
import { authService } from '@/services/authService';

interface PetRegisterFormProps {
    onBackClick: () => void;
}

export const PetRegisterForm: React.FC<PetRegisterFormProps> = ({ onBackClick }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [racas, setRacas] = useState<Raca[]>([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Estado do formulário baseado nos campos da API
    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        porte: '',
        descricao: '',
        especie: '',
        sexo: '',
        raca: '',
        status_pet: '1',
        doenca_cronica: false,
        necessidades_especiais: false,
        cuidados_constantes: false,
        amigavel_outros_animais: false,
    });

    useEffect(() => {
        loadRacas();
    }, []);

    const loadRacas = async () => {
        try {
            const data = await petService.getRacas();
            setRacas(data);
        } catch (error) {
            console.error('Erro ao carregar raças:', error);
        }
    };

    // Filtrar raças por espécie
    const racasFiltradas = formData.especie
        ? racas.filter(raca => raca.especie === parseInt(formData.especie))
        : [];

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            // Se mudar a espécie, limpar a raça selecionada
            if (name === 'especie') {
                setFormData(prev => ({ ...prev, [name]: value, raca: '' }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validações básicas
            if (!formData.nome.trim()) {
                throw new Error('Nome é obrigatório');
            }
            if (!formData.idade || parseInt(formData.idade) <= 0) {
                throw new Error('Idade deve ser maior que zero');
            }
            if (!formData.porte) {
                throw new Error('Porte é obrigatório');
            }
            if (!formData.especie) {
                throw new Error('Espécie é obrigatória');
            }

            // Buscar o ID do tutor a partir do user_id do token
            const userId = authService.getUserIdFromToken();
            if (!userId) {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            const tutorId = await authService.getTutorIdByUserId(userId);
            if (!tutorId) {
                throw new Error('Tutor não encontrado. Certifique-se de que seu perfil está completo.');
            }

            // Preparar dados para enviar
            const petData: CreatePetData = {
                nome: formData.nome,
                idade: parseInt(formData.idade),
                porte: formData.porte,
                descricao: formData.descricao || undefined,
                foto: imagePreview || undefined,
                sexo: formData.sexo ? parseInt(formData.sexo) : undefined,
                raca: formData.raca ? parseInt(formData.raca) : undefined,
                doenca_cronica: formData.doenca_cronica,
                necessidades_especiais: formData.necessidades_especiais,
                cuidados_constantes: formData.cuidados_constantes,
                amigavel_outros_animais: formData.amigavel_outros_animais,
                especie: parseInt(formData.especie),
                status_pet: parseInt(formData.status_pet),
                tutor: tutorId,
            };

            // Enviar para a API
            await petService.createPet(petData);

            // Sucesso - mostra toast e redireciona
            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
                onBackClick();
            }, 2000);
        } catch (error: any) {
            console.error('Erro ao cadastrar pet:', error);
            setError(error.message || 'Erro ao cadastrar pet. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Toast de Sucesso */}
            {showSuccessToast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">Pet cadastrado com sucesso!</span>
                    </div>
                </div>
            )}
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

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Nome e Idade */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder="NOME DO PET"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                                <select
                                    name="idade"
                                    value={formData.idade}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500"
                                    required
                                >
                                    <option value="">IDADE</option>
                                    <option value="1">FILHOTE</option>
                                    <option value="2">ADULTO</option>
                                    <option value="3">IDOSO</option>
                                    <option value="4">INDIFERENTE</option>
                                </select>
                            </div>

                            {/* Espécie e Sexo */}
                            <div className="flex gap-4">
                                <select
                                    name="especie"
                                    value={formData.especie}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500"
                                    required
                                >
                                    <option value="">ESPÉCIE</option>
                                    <option value="1">GATO</option>
                                    <option value="2">CACHORRO</option>
                                </select>
                                <select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500"
                                >
                                    <option value="">SEXO (OPCIONAL)</option>
                                    <option value="1">MACHO</option>
                                    <option value="2">FÊMEA</option>
                                </select>
                            </div>

                            {/* Porte e Raça */}
                            <div className="flex gap-4">
                                <select
                                    name="porte"
                                    value={formData.porte}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500"
                                    required
                                >
                                    <option value="">PORTE</option>
                                    <option value="1">PEQUENO</option>
                                    <option value="2">MÉDIO</option>
                                    <option value="3">GRANDE</option>
                                    <option value="4">MUITO GRANDE</option>
                                </select>
                                <select
                                    name="raca"
                                    value={formData.raca}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-500"
                                    disabled={!formData.especie}
                                >
                                    <option value="">RAÇA (OPCIONAL)</option>
                                    {racasFiltradas.map(raca => (
                                        <option key={raca.id_raca_pet} value={raca.id_raca_pet}>
                                            {raca.raca}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Campo de Descrição */}
                            <div>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    placeholder="DESCRIÇÃO DO ANIMAL (História, características especiais, etc.)"
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
                                />
                            </div>

                            {/* Checkboxes de características */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="doenca_cronica"
                                        checked={formData.doenca_cronica}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Possui doença crônica</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="necessidades_especiais"
                                        checked={formData.necessidades_especiais}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Possui necessidades especiais</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="cuidados_constantes"
                                        checked={formData.cuidados_constantes}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Requer cuidados constantes</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="amigavel_outros_animais"
                                        checked={formData.amigavel_outros_animais}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Amigável com outros animais</span>
                                </label>
                            </div>

                            {/* Termos de serviço */}
                            <p className="text-xs text-gray-600 mt-2">
                                Ao cadastrar, você concorda com os <a href="#" className="underline font-medium text-red-500 hover:text-red-700">termos de serviço</a>
                            </p>

                            {/* Botão de Cadastrar */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'CADASTRANDO...' : 'CADASTRAR PET'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
