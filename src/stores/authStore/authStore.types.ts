export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}
