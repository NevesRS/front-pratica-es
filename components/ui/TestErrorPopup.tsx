import React, { useState } from 'react';
import ErrorPopup from './ErrorPopup';

export default function TestErrorPopup() {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const testError = () => {
        console.log('TestErrorPopup: Testando popup de erro');
        setErrorMessage('Este é um teste do popup de erro!');
        setShowError(true);
    };

    return (
        <div className="p-4">
            <button
                onClick={testError}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Testar Popup de Erro
            </button>

            <ErrorPopup
                isVisible={showError}
                message={errorMessage}
                onClose={() => {
                    console.log('TestErrorPopup: Fechando popup');
                    setShowError(false);
                    setErrorMessage('');
                }}
                autoClose={false} // Desativar auto-close para testes
                autoCloseDelay={10000}
            />
        </div>
    );
}
