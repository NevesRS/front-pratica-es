// components/auth/RegisterForm.tsx
import React from 'react';

interface RegisterFormProps {
    onBackClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackClick }) => {
    return (
        // Contêiner principal com a divisão de dois lados
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
                <form className="flex flex-col gap-4">
                    <input type="text" placeholder="CEP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    <input type="text" placeholder="NOME COMPLETO" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    <input type="tel" placeholder="TELEFONE" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    <input type="email" placeholder="E-MAIL" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    <input type="password" placeholder="DEFINIR SENHA" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    
                    <p className="text-xs text-gray-600 mt-2">
                        Ao se cadastrar, você concorda com os <a href="#" className="underline font-medium text-red-500 hover:text-red-700">termos de serviço</a>
                    </p>

                    <button type="submit" className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200">
                        CADASTRAR
                    </button>
                </form>
            </div>

        </div>
    );
}