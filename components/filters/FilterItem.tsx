import React from "react";

type FilterItemProps = {
    label: string;
    options?: { value: string | number; label: string }[];
    onChange?: (value: string) => void;
};

export default function FilterItem({ label, options, onChange }: FilterItemProps) {
    const getDefaultOptions = () => {
        switch (label) {
            case "ESPÉCIE":
                return [
                    { value: "", label: "Todas" },
                    { value: "3", label: "Cachorro" },
                    { value: "4", label: "Gato" }
                ];
            case "PORTE":
                return [
                    { value: "", label: "Todos" },
                    { value: "1", label: "Pequeno" },
                    { value: "2", label: "Médio" },
                    { value: "3", label: "Grande" },
                    { value: "4", label: "Muito Grande" }
                ];
            case "SEXO":
                return [
                    { value: "", label: "Todos" },
                    { value: "1", label: "Macho" },
                    { value: "2", label: "Fêmea" }
                ];
            case "IDADE":
                return [
                    { value: "", label: "Todas" },
                    { value: "1", label: "Filhote" },
                    { value: "2", label: "Adulto" },
                    { value: "3", label: "Idoso" },
                    { value: "4", label: "Indiferente" }
                ];
            default:
                return [{ value: "", label: "Selecione uma opção" }];
        }
    };

    const displayOptions = options || getDefaultOptions();

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                onChange={(e) => onChange?.(e.target.value)}
            >
                {displayOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
