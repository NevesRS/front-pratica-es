"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import { petService } from "@/services/petService";

type AddTrackingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    petId: number;
    onSuccess: () => void;
};

export default function AddTrackingModal({ isOpen, onClose, petId, onSuccess }: AddTrackingModalProps) {
    const [estadoRastreio, setEstadoRastreio] = useState('');
    const [descricaoRastreio, setDescricaoRastreio] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!estadoRastreio.trim()) {
            setError('Estado do rastreio é obrigatório');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await petService.createRastreio(petId, estadoRastreio, descricaoRastreio || undefined);

            // Limpar campos
            setEstadoRastreio('');
            setDescricaoRastreio('');

            // Notificar sucesso
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Erro ao adicionar rastreio:', error);
            setError(error.message || 'Erro ao adicionar status');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEstadoRastreio('');
        setDescricaoRastreio('');
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">ADICIONAR STATUS DE RASTREIO</h2>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Estado do Rastreio */}
                    <div>
                        <label htmlFor="estadoRastreio" className="block text-sm font-bold text-gray-700 mb-2">
                            ESTADO DO RASTREIO *
                        </label>
                        <input
                            type="text"
                            id="estadoRastreio"
                            value={estadoRastreio}
                            onChange={(e) => setEstadoRastreio(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Ex: Encontrado, Resgatado, Adotado..."
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="descricaoRastreio" className="block text-sm font-bold text-gray-700 mb-2">
                            DESCRIÇÃO (OPCIONAL)
                        </label>
                        <textarea
                            id="descricaoRastreio"
                            value={descricaoRastreio}
                            onChange={(e) => setDescricaoRastreio(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                            placeholder="Ex: Local onde foi encontrado, nome do responsável..."
                            rows={4}
                        />
                    </div>

                    {/* Mensagem de erro */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                            disabled={loading}
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'ADICIONANDO...' : 'ADICIONAR'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
