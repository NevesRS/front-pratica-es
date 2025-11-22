import React, { useEffect, useState } from 'react';

interface SuccessScreenProps {
    successMessage: string;
    onContinue: () => void;
    autoReturnDelay?: number;
}

export default function SuccessScreen({
    successMessage,
    onContinue,
    autoReturnDelay = 3000
}: SuccessScreenProps) {
    const [remainingTime, setRemainingTime] = useState(Math.ceil(autoReturnDelay / 1000));

    useEffect(() => {
        if (autoReturnDelay > 0) {
            // Contador regressivo
            const countdownInterval = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Timer principal
            const timer = setTimeout(() => {
                console.log('SuccessScreen: Auto-retorno após', autoReturnDelay, 'ms');
                onContinue();
            }, autoReturnDelay);

            return () => {
                clearTimeout(timer);
                clearInterval(countdownInterval);
            };
        }
    }, [autoReturnDelay, onContinue]);

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-4">
                {/* Ícone de sucesso */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
                    <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Cadastro realizado com sucesso!
                </h2>

                {/* Mensagem de sucesso */}
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {successMessage}
                </p>

                {/* Botão de continuar */}
                <button
                    onClick={onContinue}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Fazer Login
                </button>

                {/* Indicador de auto-retorno */}
                {autoReturnDelay > 0 && remainingTime > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-2">
                            Redirecionando para login em:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="text-2xl font-bold text-green-600">
                                {remainingTime}
                            </div>
                            <span className="text-sm text-gray-500 ml-1">
                                {remainingTime === 1 ? 'segundo' : 'segundos'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
