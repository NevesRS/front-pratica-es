import React, { useEffect, useState } from "react";
import { petService, Raca } from "@/services/petService";

type FilterItemRacaProps = {
    label: string;
    especieSelecionada?: number | null;
    onChange?: (value: string) => void;
};

export default function FilterItemRaca({ label, especieSelecionada, onChange }: FilterItemRacaProps) {
    const [racas, setRacas] = useState<Raca[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadRacas();
    }, []);

    const loadRacas = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await petService.getRacas();
            setRacas(data);
        } catch (error: any) {
            console.error('Erro ao buscar raças:', error);
            setError('Erro ao carregar raças');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar raças por espécie se uma espécie foi selecionada
    const racasFiltradas = especieSelecionada
        ? racas.filter(raca => raca.especie === especieSelecionada)
        : racas;

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                disabled={loading}
                onChange={(e) => onChange?.(e.target.value)}
            >
                <option value="">
                    {loading ? 'Carregando...' : error ? error : 'Todas'}
                </option>
                {racasFiltradas.map((raca) => (
                    <option key={raca.id_raca_pet} value={raca.id_raca_pet}>
                        {raca.raca}
                    </option>
                ))}
            </select>
        </div>
    );
}
