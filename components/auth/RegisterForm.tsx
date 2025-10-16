// components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import ErrorPopup from '../ui/ErrorPopup';

interface RegisterFormProps {
    onBackClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackClick }) => {
    const [formData, setFormData] = useState({
        cep: '',
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShowErrorPopup(false);

        // Validação básica
        if (!formData.cep || !formData.name || !formData.phone || !formData.email || !formData.password) {
            setError('Por favor, preencha todos os campos obrigatórios.');
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

        // Aqui você pode implementar a lógica de cadastro
        console.log('Dados do formulário:', formData);
    };
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
                        <h2 className="text-2xl font-bold mb-8 text-gray-800">FAÇA SEU CADASTRO</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="cep"
                                placeholder="CEP"
                                value={formData.cep}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="NOME COMPLETO"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="TELEFONE"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-MAIL"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="DEFINIR SENHA"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />

                            <p className="text-xs text-gray-600 mt-2">
                                Ao se cadastrar, você concorda com os <a href="#" className="underline font-medium text-red-500 hover:text-red-700">termos de serviço</a>
                            </p>

                            <button type="submit" className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200">
                                CADASTRAR
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
