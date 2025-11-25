// components/pets/PreferencesPage.tsx
import React, { useState, useEffect } from 'react';
import { petService } from '@/services/petService';
import { authService } from '@/services/authService';

interface Raca {
    id_raca_pet: number;
    raca: string;
    especie: number;
}

interface PreferencesFormData {
    preferencia_especie: string;
    preferencia_raca: string;
    preferencia_porte: string;
    preferencia_idade: string;
    preferencia_sexo: string;
    aceita_doenca_cronica: boolean;
    aceita_necessidades_especiais: boolean;
    possui_outros_animais: boolean;
    possui_tempo: boolean;
    preferencia_ativa: boolean;
}

export const PreferencesPage: React.FC = () => {
    const [racas, setRacas] = useState<Raca[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [existingPreferenceId, setExistingPreferenceId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<PreferencesFormData>({
        preferencia_especie: '',
        preferencia_raca: '',
        preferencia_porte: '',
        preferencia_idade: '',
        preferencia_sexo: '',
        aceita_doenca_cronica: false,
        aceita_necessidades_especiais: false,
        possui_outros_animais: false,
        possui_tempo: false,
        preferencia_ativa: true,
    });

    useEffect(() => {
        loadRacas();
        loadExistingPreferences();
    }, []);

    const loadRacas = async () => {
        try {
            const data = await petService.getRacas();
            setRacas(data);
        } catch (error) {
            console.error('Erro ao carregar raças:', error);
        }
    };

    const loadExistingPreferences = async () => {
        try {
            setIsInitialLoading(true);
            const userId = authService.getUserIdFromToken();
            if (!userId) {
                setIsInitialLoading(false);
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/preferencia-adotante/usuario/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`,
                },
            });

            if (response.ok) {
                const preferences = await response.json();
                // A API retorna um array, pegamos o primeiro item
                if (preferences && preferences.length > 0) {
                    const pref = preferences[0];
                    setExistingPreferenceId(pref.id);
                    setIsEditing(true);

                    // Preencher o formulário com os dados existentes
                    setFormData({
                        preferencia_especie: pref.preferencia_especie?.toString() || '',
                        preferencia_raca: pref.preferencia_raca?.toString() || '',
                        preferencia_porte: pref.preferencia_porte?.toString() || '',
                        preferencia_idade: pref.preferencia_idade?.toString() || '',
                        preferencia_sexo: pref.preferencia_sexo?.toString() || '',
                        aceita_doenca_cronica: pref.aceita_doenca_cronica || false,
                        aceita_necessidades_especiais: pref.aceita_necessidades_especiais || false,
                        possui_outros_animais: pref.possui_outros_animais || false,
                        possui_tempo: pref.possui_tempo || false,
                        preferencia_ativa: pref.preferencia_ativa !== undefined ? pref.preferencia_ativa : true,
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar preferências existentes:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    // Filtrar raças por espécie
    const racasFiltradas = formData.preferencia_especie
        ? racas.filter(raca => raca.especie === parseInt(formData.preferencia_especie))
        : [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Limpar raça quando mudar a espécie
            if (name === 'preferencia_especie') {
                setFormData(prev => ({
                    ...prev,
                    preferencia_raca: ''
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Buscar o ID do usuário do token
            const userId = authService.getUserIdFromToken();
            if (!userId) {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            // Buscar o ID do adotante pela API usando user_id
            const adotanteResponse = await fetch(`http://127.0.0.1:8000/api/adotante/usuario/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`,
                },
            });

            if (!adotanteResponse.ok) {
                throw new Error('Perfil de adotante não encontrado. Certifique-se de que seu cadastro está completo.');
            }

            const adotanteData = await adotanteResponse.json();
            const adotanteId = adotanteData.id;

            // Preparar dados para enviar (remover campos undefined)
            const preferencesData: any = {
                adotante: adotanteId,
                preferencia_especie: parseInt(formData.preferencia_especie),
                aceita_doenca_cronica: formData.aceita_doenca_cronica,
                aceita_necessidades_especiais: formData.aceita_necessidades_especiais,
                possui_outros_animais: formData.possui_outros_animais,
                possui_tempo: formData.possui_tempo,
                preferencia_ativa: formData.preferencia_ativa,
            };

            // Adicionar campos opcionais apenas se tiverem valor
            if (formData.preferencia_raca) {
                preferencesData.preferencia_raca = parseInt(formData.preferencia_raca);
            }
            if (formData.preferencia_porte) {
                preferencesData.preferencia_porte = parseInt(formData.preferencia_porte);
            }
            if (formData.preferencia_idade) {
                preferencesData.preferencia_idade = parseInt(formData.preferencia_idade);
            }
            if (formData.preferencia_sexo) {
                preferencesData.preferencia_sexo = parseInt(formData.preferencia_sexo);
            }

            // Determinar se é criação ou edição
            const url = isEditing
                ? `http://127.0.0.1:8000/api/preferencia-adotante/${existingPreferenceId}/`
                : 'http://127.0.0.1:8000/api/preferencia-adotante/';

            const method = isEditing ? 'PUT' : 'POST';

            // Enviar para a API
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getAccessToken()}`,
                },
                body: JSON.stringify(preferencesData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro ao ${isEditing ? 'atualizar' : 'salvar'} preferências`);
            }

            const responseData = await response.json();

            // Se era uma criação, agora passa a ser edição
            if (!isEditing) {
                setExistingPreferenceId(responseData.id);
                setIsEditing(true);
            }

            // Sucesso - mostra toast
            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
            }, 3000);

        } catch (error: any) {
            console.error('Erro ao salvar preferências:', error);
            setError(error.message || 'Erro ao salvar preferências. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            {/* Toast de Sucesso */}
            {showSuccessToast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">
                            {isEditing ? 'Preferências atualizadas com sucesso!' : 'Preferências salvas com sucesso!'}
                        </span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">MINHAS PREFERÊNCIAS</h1>
                <p className="text-gray-600 mt-2">
                    {isEditing
                        ? 'Edite suas preferências para receber recomendações mais precisas'
                        : 'Configure suas preferências para receber recomendações personalizadas'
                    }
                </p>
            </div>

            {/* Loading Inicial */}
            {isInitialLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Carregando preferências...</p>
                    </div>
                </div>
            ) : (
                /* Formulário */
                <div className="flex-1 flex justify-center items-center p-8">
                    <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Erro */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Espécie e Raça */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ESPÉCIE *
                                    </label>
                                    <select
                                        name="preferencia_especie"
                                        value={formData.preferencia_especie}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        required
                                    >
                                        <option value="">SELECIONE</option>
                                        <option value="1">GATO</option>
                                        <option value="2">CACHORRO</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        RAÇA (OPCIONAL)
                                    </label>
                                    <select
                                        name="preferencia_raca"
                                        value={formData.preferencia_raca}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        disabled={!formData.preferencia_especie}
                                    >
                                        <option value="">TODAS</option>
                                        {racasFiltradas.map(raca => (
                                            <option key={raca.id_raca_pet} value={raca.id_raca_pet}>
                                                {raca.raca}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Porte e Idade */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        PORTE (OPCIONAL)
                                    </label>
                                    <select
                                        name="preferencia_porte"
                                        value={formData.preferencia_porte}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">INDIFERENTE</option>
                                        <option value="1">PEQUENO</option>
                                        <option value="2">MÉDIO</option>
                                        <option value="3">GRANDE</option>
                                        <option value="4">MUITO GRANDE</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        IDADE (OPCIONAL)
                                    </label>
                                    <select
                                        name="preferencia_idade"
                                        value={formData.preferencia_idade}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">INDIFERENTE</option>
                                        <option value="1">FILHOTE</option>
                                        <option value="2">ADULTO</option>
                                        <option value="3">IDOSO</option>
                                    </select>
                                </div>
                            </div>

                            {/* Sexo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    SEXO (OPCIONAL)
                                </label>
                                <select
                                    name="preferencia_sexo"
                                    value={formData.preferencia_sexo}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">INDIFERENTE</option>
                                    <option value="1">MACHO</option>
                                    <option value="2">FÊMEA</option>
                                </select>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="aceita_doenca_cronica"
                                        checked={formData.aceita_doenca_cronica}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium">Aceito pets com doenças crônicas</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="aceita_necessidades_especiais"
                                        checked={formData.aceita_necessidades_especiais}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium">Aceito pets com necessidades especiais</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="possui_outros_animais"
                                        checked={formData.possui_outros_animais}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium">Possuo outros animais em casa</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="possui_tempo"
                                        checked={formData.possui_tempo}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium">Tenho tempo para cuidados constantes</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="preferencia_ativa"
                                        checked={formData.preferencia_ativa}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium">Manter esta preferência ativa</span>
                                </label>
                            </div>

                            {/* Botão de Enviar */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-500 text-white font-bold py-4 rounded-lg hover:bg-red-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? (isEditing ? 'ATUALIZANDO...' : 'SALVANDO...')
                                    : (isEditing ? 'ATUALIZAR PREFERÊNCIAS' : 'SALVAR PREFERÊNCIAS')
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
