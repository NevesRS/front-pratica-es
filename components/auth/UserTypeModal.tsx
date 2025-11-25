// components/auth/UserTypeModal.tsx
import React from 'react';

interface UserTypeModalProps {
    onSelectType: (type: 'adotante' | 'tutor') => void;
    onClose: () => void;
}

export const UserTypeModal: React.FC<UserTypeModalProps> = ({ onSelectType, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 p-6 text-white">
                    <h2 className="text-2xl font-bold">BEM-VINDO!</h2>
                    <p className="text-sm mt-1">Escolha como deseja se cadastrar</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Botão Adotante */}
                    <button
                        onClick={() => onSelectType('adotante')}
                        className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition duration-200 text-left group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-500">ADOTANTE</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Quero adotar um pet e dar um lar cheio de amor
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Botão Tutor */}
                    <button
                        onClick={() => onSelectType('tutor')}
                        className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition duration-200 text-left group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-500">TUTOR</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Sou tutor ou ONG e quero cadastrar pets para adoção
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t">
                    <button
                        onClick={onClose}
                        className="w-full text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
