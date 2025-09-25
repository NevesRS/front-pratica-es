import React from "react";

type FilterItemProps = {
    label: string;
};

export default function FilterItem({ label }: FilterItemProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                <option>TIPO 1 (SELECT BOX)</option>
            </select>
        </div>
    );
}
