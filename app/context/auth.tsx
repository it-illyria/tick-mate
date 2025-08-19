import React, { createContext, useContext, useState, useEffect } from 'react';
import {User} from "@/models/user";
import {authService} from "@/services/authService";

interface AuthContextType {
    user: User | null;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signIn = async (username: string, password: string) => {
        try {
            setLoading(true);
            const user = await authService.signIn(username, password);
            if (user) {
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign in failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (username: string, password: string) => {
        try {
            setLoading(true);
            const user = await authService.signUp(username, password);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, signIn, signUp, signOut, loading, error };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
