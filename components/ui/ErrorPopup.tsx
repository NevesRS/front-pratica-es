import React, { useEffect } from "react";

interface ErrorPopupProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function ErrorPopup({
    isVisible,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 4000
}: ErrorPopupProps) {
    console.log('ErrorPopup: Renderizando com props:', { isVisible, message, autoClose, autoCloseDelay });

    useEffect(() => {
        if (isVisible && autoClose) {
            console.log('ErrorPopup: Configurando auto-close timer');
            const timer = setTimeout(() => {
                console.log('ErrorPopup: Auto-close executado');
                onClose();
            }, autoCloseDelay);

            return () => {
                console.log('ErrorPopup: Limpando timer');
                clearTimeout(timer);
            };
        }
    }, [isVisible, autoClose, autoCloseDelay, onClose]);

    if (!isVisible) {
        console.log('ErrorPopup: Não visível, retornando null');
        return null;
    }

    console.log('ErrorPopup: Renderizando popup visível com mensagem:', message);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999]"
            style={{ zIndex: 9999 }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={() => {
                    console.log('ErrorPopup: Clique no backdrop, fechando popup');
                    onClose();
                }}
                style={{ zIndex: 9998 }}
            />

            {/* Popup Content */}
            <div
                className="relative bg-white rounded-xl shadow-2xl max-w-sm mx-4 p-6 transform transition-all duration-300 scale-100"
                style={{ zIndex: 10000 }}
            >
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                    <svg
                        className="w-8 h-8 text-red-600"
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

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                    Erro de Autenticação
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 text-center mb-6">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            console.log('ErrorPopup: Clique no botão "Tentar Novamente"');
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Tentar Novamente
                    </button>
                </div>

                {/* Close button */}
                <button
                    onClick={() => {
                        console.log('ErrorPopup: Clique no botão X');
                        onClose();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    title="Fechar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Progress bar for auto-close */}
                {autoClose && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                        <div
                            className="h-full bg-red-600 transition-all duration-300 ease-linear"
                            style={{
                                animation: `shrink ${autoCloseDelay}ms linear`,
                                width: '100%'
                            }}
                        />
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
}
