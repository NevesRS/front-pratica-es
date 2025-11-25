// components/auth/RegisterForm.tsx
import React, { useState, useEffect } from 'react';
import ErrorPopup from '../ui/ErrorPopup';
import { authService } from '../../services/authService';
import { UserTypeModal } from './UserTypeModal';

interface RegisterFormProps {
    onBackClick: () => void;
    onSuccess?: () => void;
}

interface Ong {
    id_ong: number;
    nome: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackClick, onSuccess }) => {
    const [showTypeModal, setShowTypeModal] = useState(true);
    const [userType, setUserType] = useState<'adotante' | 'tutor' | null>(null);
    const [ongs, setOngs] = useState<Ong[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        password: '',
        ong: ''
    });
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userType === 'tutor') {
            loadOngs();
        }
    }, [userType]);

    const loadOngs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/ong/', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                setOngs(data);
            }
        } catch (error) {
            console.error('Erro ao carregar ONGs:', error);
        }
    };

    const handleUserTypeSelect = (type: 'adotante' | 'tutor') => {
        setUserType(type);
        setShowTypeModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShowErrorPopup(false);

        // Validação básica
        if (!formData.name || !formData.phone || !formData.email || !formData.password) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            setShowErrorPopup(true);
            return;
        }

        if (userType === 'tutor' && !formData.cpf) {
            setError('CPF é obrigatório para tutores.');
            setShowErrorPopup(true);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Por favor, insira um e-mail válido.');
            setShowErrorPopup(true);
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setShowErrorPopup(true);
            return;
        }

        setIsLoading(true);

        try {
            if (userType === 'adotante') {
                // Cadastro de adotante
                const response = await authService.register({
                    nome: formData.name,
                    email: formData.email,
                    telefone: formData.phone,
                    password: formData.password,
                });
                console.log('RegisterForm: Cadastro de adotante realizado com sucesso:', response);
            } else if (userType === 'tutor') {
                // Cadastro de tutor
                const tutorData: any = {
                    nome: formData.name,
                    cpf: formData.cpf,
                    telefone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                    ong_id: formData.ong ? parseInt(formData.ong) : undefined,
                };

                const response = await fetch('http://127.0.0.1:8000/api/auth/register/tutor/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tutorData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Erro ao cadastrar tutor');
                }

                console.log('RegisterForm: Cadastro de tutor realizado com sucesso');
            }

            // Limpa o formulário
            setFormData({
                name: '',
                cpf: '',
                phone: '',
                email: '',
                password: '',
                ong: ''
            });

            // Chama callback de sucesso se fornecido
            if (onSuccess) {
                onSuccess();
            } else {
                // Volta para a tela anterior
                onBackClick();
            }
        } catch (error) {
            console.error('RegisterForm: Erro ao cadastrar:', error);

            let errorMessage = 'Erro ao criar conta. Tente novamente.';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            setError(errorMessage);
            setShowErrorPopup(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar modal de seleção primeiro
    if (showTypeModal) {
        return <UserTypeModal onSelectType={handleUserTypeSelect} onClose={onBackClick} />;
    }
    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">CADASTRO</h1>
            </div>

            <div className="flex-1 flex justify-center items-center p-4">
                {/* Contêiner principal com a divisão de dois lados */}
                <div className="w-full max-w-4xl flex bg-white rounded-xl shadow-2xl border border-gray-200 z-10 overflow-hidden">

                    {/* Lado Esquerdo - Informações (50% ou w-2/5 para ser mais fiel) */}
                    <div className="w-2/5 bg-red-400 p-8 flex flex-col justify-between text-white border-r-4 border-red-500">
                        <div>
                            <h2 className="text-2xl font-extrabold mb-4">INFORMAÇÕES</h2>
                            <p className="text-sm leading-relaxed">
                                Se você tem um cão ou gato para doar ou se está procurando um que
                                perdeu, este é o lugar certo. Cadastre-se para anunciar seu pet.
                                Lembre-se: uma boa foto é essencial para ajudar a encontrar um novo
                                lar ou o caminho de volta para casa!
                            </p>
                        </div>
                        <button
                            onClick={onBackClick}
                            className="w-fit text-sm font-bold mt-8 p-2 px-4 rounded hover:bg-red-500 transition duration-200 border border-white"
                        >
                            VOLTAR
                        </button>
                    </div>

                    {/* Lado Direito - Formulário de Cadastro (50% ou w-3/5) */}
                    <div className="w-3/5 p-8">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            {userType === 'tutor' ? 'CADASTRO DE TUTOR' : 'FAÇA SEU CADASTRO'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {userType === 'tutor' ? 'Cadastre-se como tutor para anunciar pets' : 'Cadastre-se como adotante'}
                        </p>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="NOME COMPLETO"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />

                            {userType === 'tutor' && (
                                <input
                                    type="text"
                                    name="cpf"
                                    placeholder="CPF"
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    maxLength={14}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            )}

                            <input
                                type="tel"
                                name="phone"
                                placeholder="TELEFONE"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-MAIL"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="DEFINIR SENHA"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />

                            {userType === 'tutor' && (
                                <select
                                    name="ong"
                                    value={formData.ong}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-700"
                                >
                                    <option value="">ONG (OPCIONAL)</option>
                                    {ongs.map(ong => (
                                        <option key={ong.id_ong} value={ong.id_ong}>
                                            {ong.nome}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <p className="text-xs text-gray-600 mt-2">
                                Ao se cadastrar, você concorda com os <a href="#" className="underline font-medium text-red-500 hover:text-red-700">termos de serviço</a>
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Error Popup */}
            <ErrorPopup
                isVisible={showErrorPopup}
                message={error}
                onClose={() => {
                    setShowErrorPopup(false);
                    setError('');
                }}
                autoClose={true}
                autoCloseDelay={5000}
            />
        </div>
    );
}
