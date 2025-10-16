import React, { useEffect } from "react";

interface SuccessPopupProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function SuccessPopup({
    isVisible,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000
}: SuccessPopupProps) {
    useEffect(() => {
        if (isVisible && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoClose, autoCloseDelay, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Popup Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm mx-4 p-6 transform transition-all duration-300 scale-100">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                    <svg
                        className="w-8 h-8 text-green-600"
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

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                    Sucesso!
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 text-center mb-6">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        OK
                    </button>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Progress bar for auto-close */}
                {autoClose && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all duration-300 ease-linear"
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
