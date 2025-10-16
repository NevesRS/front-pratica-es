"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/authService';

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: (onLogoutCallback?: () => void) => void;
    user: { username: string } | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ username: string } | null>(null);

    // Verifica se já está logado ao carregar a aplicação
    useEffect(() => {
        const checkAuth = () => {
            const isAuthenticated = authService.isAuthenticated();
            setIsLoggedIn(isAuthenticated);

            if (isAuthenticated) {
                setUser({ username: 'Usuário Logado' });
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        console.log('AuthContext: Iniciando login...');

        try {
            const response = await authService.login({ username, password });
            console.log('AuthContext: Login bem-sucedido', response);
            setIsLoggedIn(true);
            setUser({ username: response.username });
        } catch (error) {
            console.error('AuthContext: Erro capturado no login:', error);

            // Garantir que sempre paramos o loading em caso de erro
            setIsLoading(false);

            // Melhor tratamento de diferentes tipos de erro
            if (error instanceof Error) {
                if (error.message.includes('fetch')) {
                    throw new Error('Email ou senha incorretos, tente novamente!');
                }
                throw error;
            } else {
                throw new Error('Erro desconhecido ao fazer login. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (onLogoutCallback?: () => void) => {
        console.log('AuthContext: Fazendo logout');
        authService.logout();
        setIsLoggedIn(false);
        setUser(null);

        // Executa o callback de logout se fornecido
        if (onLogoutCallback) {
            console.log('AuthContext: Executando callback de logout');
            onLogoutCallback();
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
