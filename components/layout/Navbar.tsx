import React from "react";

type NavbarProps = {
    isLoginView: boolean;
    onLoginClick: () => void;
    onHomeClick: () => void;
    onRegisterClick?: () => void;
};

export default function Navbar({ isLoginView, onLoginClick, onHomeClick, onRegisterClick }: NavbarProps) {
    const navClasses = isLoginView
        ? "flex justify-between items-center p-4 bg-orange-100 border-b border-gray-300 w-full"
        : "flex justify-between items-center p-4 bg-orange-100 border-b border-gray-300 w-full";

    return (
        <nav className={navClasses}>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 cursor-pointer" onClick={onHomeClick}>
                    <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-sm font-bold">Logo</div>
                </div>

                {/* Navigation links immediately to the right of the logo */}
                {!isLoginView && (
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800 hover:text-red-500 cursor-pointer">MEUS PETS</span>
                        <span className="font-bold text-gray-800 hover:text-red-500 cursor-pointer">RASTREAR</span>
                    </div>
                )}
            </div>

            {/* Right side: actions / icons / buttons */}
            <div className="ml-auto flex items-center gap-4">
                {isLoginView && (
                    <div className="flex gap-4 items-center">
                        <span className="text-xl cursor-pointer hover:opacity-80">❓</span>
                        <span className="text-xl cursor-pointer hover:opacity-80">👤</span>
                    </div>
                )}

                {!isLoginView && (
                    <div className="flex gap-2">
                        <button
                            onClick={onLoginClick}
                            className="bg-white text-red-500 font-medium px-4 py-2 rounded-lg border border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                        >
                            LOGIN
                        </button>
                        <button onClick={onRegisterClick} className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                            CADASTRAR-SE
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
