import React from "react";
import { useAuth } from "../../contexts/AuthContext";

type LoginPageProps = {
    onBackClick?: () => void;
    onRegisterClick?: () => void;
};

export default function LoginPage({ onBackClick, onRegisterClick }: LoginPageProps) {
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login();
        if (onBackClick) {
            onBackClick(); // Volta para a tela inicial após login
        }
    };
    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">LOGIN</h1>
            </div>

            <div className="flex-1 flex justify-center items-center p-4 relative">
                <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#fff,#fff 10px,#f9fafb 10px,#f9fafb 20px)] opacity-10" />
                </div>

                <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl border border-gray-200 z-10">
                    <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center">Icon</div>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        <input type="email" placeholder="E-MAIL" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                        <input type="password" placeholder="SENHA" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />

                        <button type="submit" className="w-full bg-red-400 text-white font-bold py-3 rounded-xl shadow-md mt-4 hover:bg-red-500 transition duration-200">ENTRAR</button>
                    </form>

                    {onBackClick && (
                        <div className="mt-4">
                            <button onClick={onBackClick} className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-xl shadow-md mt-2 hover:bg-gray-300 transition duration-200">
                                VOLTAR
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col items-center mt-4 text-sm gap-2">
                        <a href="#" className="text-red-500 hover:text-red-700 font-semibold transition duration-200">ESQUECI MINHA SENHA</a>
                        <button
                            onClick={onRegisterClick}
                            className="text-gray-700 hover:text-black font-medium transition duration-200 bg-transparent border-none cursor-pointer"
                        >
                            CRIAR CONTA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
