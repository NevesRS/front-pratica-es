import React from "react";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";

type NavbarProps = {
    isLoginView: boolean;
    onLoginClick: () => void;
    onHomeClick: () => void;
    onRegisterClick?: () => void;
    onMyPetsClick?: () => void;
    onSearchClick?: () => void;
    onHeuristicClick?: () => void;
    onPreferencesClick?: () => void;
    onAdoptionsClick?: () => void;
    currentPage?: 'search' | 'mypets' | 'heuristic' | 'preferences' | 'adoptions';
    onLogoutCallback?: () => void;
};

export default function Navbar({ isLoginView, onLoginClick, onHomeClick, onRegisterClick, onMyPetsClick, onSearchClick, onHeuristicClick, onPreferencesClick, onAdoptionsClick, currentPage, onLogoutCallback }: NavbarProps) {
    const { isLoggedIn, logout } = useAuth();

    // Obtém o perfil do usuário (adotante ou tutor)
    const userProfile = isLoggedIn ? authService.getUserProfileFromToken() : null;

    const handleLogout = () => {
        console.log('Navbar: Executando logout');
        logout(() => {
            console.log('Navbar: Callback de logout executado, redirecionando para home');
            if (onLogoutCallback) {
                onLogoutCallback();
            } else {
                onHomeClick(); // Fallback para voltar ao home
            }
        });
    };

    const navClasses = isLoginView
        ? "flex justify-between items-center p-4 bg-orange-100 border-b border-gray-300 w-full"
        : "flex justify-between items-center p-4 bg-orange-100 border-b border-gray-300 w-full";

    const handleLogoClick = () => {
        if (isLoggedIn && userProfile === 'tutor' && onMyPetsClick) {
            onMyPetsClick();
        } else {
            onHomeClick();
        }
    };

    return (
        <nav className={navClasses}>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={handleLogoClick}>
                    <Image
                        src="/logo.png"
                        alt="FADA ORG - Ecossistema do Bem Estar Animal"
                        width={90}
                        height={20}
                        className="object-contain"
                    />
                </div>

                {/* Navigation links immediately to the right of the logo */}
                {!isLoginView && (
                    <div className="flex items-center gap-4">
                        {/* MEUS PETS - apenas para tutores */}
                        {isLoggedIn && userProfile === 'tutor' && (
                            <span
                                className={`font-bold cursor-pointer border-b-2 pb-1 ${currentPage === 'mypets'
                                    ? 'text-red-500 border-red-500'
                                    : 'text-gray-800 hover:text-red-500 border-transparent'
                                    }`}
                                onClick={onMyPetsClick}
                            >
                                MEUS PETS
                            </span>
                        )}

                        {/* PESQUISAR - apenas para adotantes */}
                        {isLoggedIn && userProfile === 'adotante' && (
                            <span
                                className={`font-bold cursor-pointer border-b-2 pb-1 ${currentPage === 'search'
                                    ? 'text-red-500 border-red-500'
                                    : 'text-gray-800 hover:text-red-500 border-transparent'
                                    }`}
                                onClick={onSearchClick}
                            >
                                PESQUISAR
                            </span>
                        )}

                        {/* RECOMENDADOS - apenas para adotantes */}
                        {isLoggedIn && userProfile === 'adotante' && (
                            <span
                                className={`font-bold cursor-pointer border-b-2 pb-1 ${currentPage === 'heuristic'
                                    ? 'text-red-500 border-red-500'
                                    : 'text-gray-800 hover:text-red-500 border-transparent'
                                    }`}
                                onClick={onHeuristicClick}
                            >
                                RECOMENDADOS
                            </span>
                        )}

                        {/* PREFERÊNCIAS - apenas para adotantes */}
                        {isLoggedIn && userProfile === 'adotante' && (
                            <span
                                className={`font-bold cursor-pointer border-b-2 pb-1 ${currentPage === 'preferences'
                                    ? 'text-red-500 border-red-500'
                                    : 'text-gray-800 hover:text-red-500 border-transparent'
                                    }`}
                                onClick={onPreferencesClick}
                            >
                                PREFERÊNCIAS
                            </span>
                        )}

                        {/* ADOÇÕES - para adotantes e tutores */}
                        {isLoggedIn && (userProfile === 'adotante' || userProfile === 'tutor') && (
                            <span
                                className={`font-bold cursor-pointer border-b-2 pb-1 ${currentPage === 'adoptions'
                                    ? 'text-red-500 border-red-500'
                                    : 'text-gray-800 hover:text-red-500 border-transparent'
                                    }`}
                                onClick={onAdoptionsClick}
                            >
                                ADOÇÕES
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Right side: actions / icons / buttons */}
            <div className="ml-auto flex items-center gap-4">
                {!isLoginView && (
                    <div className="flex gap-2">
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={onLoginClick}
                                    className="bg-white text-red-500 font-medium px-4 py-2 rounded-lg border border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                                >
                                    LOGIN
                                </button>
                                <button onClick={onRegisterClick} className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                                    CADASTRAR-SE
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                SAIR
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
