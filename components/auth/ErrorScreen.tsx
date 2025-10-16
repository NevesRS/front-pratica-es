import React, { useEffect, useState } from 'react';

interface ErrorScreenProps {
    errorMessage: string;
    onRetry: () => void;
    autoReturnDelay?: number;
}

export default function ErrorScreen({
    errorMessage,
    onRetry,
    autoReturnDelay = 3000
}: ErrorScreenProps) {

    useEffect(() => {
        if (autoReturnDelay > 0) {
            // Timer principal
            const timer = setTimeout(() => {
                console.log('ErrorScreen: Auto-retorno após', autoReturnDelay, 'ms');
                onRetry();
            }, autoReturnDelay);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [autoReturnDelay, onRetry]);

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-4">
                {/* Ícone de erro */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
                    <svg
                        className="w-10 h-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ERRO
                </h2>

                {/* Mensagem de erro */}
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {errorMessage}
                </p>

                {/* Botão de tentar novamente */}
                <button
                    onClick={onRetry}
                    className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );
}
