import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";

interface AuthUser {
    email?: string;
    avatarUrl?: string | null;
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    login: (token: string, user?: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token"),
    );

    const [user, setUser] = useState<AuthUser | null>(
        token ? {} : null,
    );

    // Store authentication data locally.
    const login = (
        newToken: string,
        newUser: AuthUser = {},
    ) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
    };

    // Clear all local authentication data.
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            login,
            logout,
        }),
        [user, token],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider",
        );
    }

    return context;
}
