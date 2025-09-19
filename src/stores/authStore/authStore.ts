import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '@/stores/authStore/authStore.types';

// Hardcoded credentials as specified in requirements
const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'password123';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,

            login: async (
                email: string,
                password: string
            ): Promise<boolean> => {
                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 500));

                if (email === VALID_EMAIL && password === VALID_PASSWORD) {
                    const user: User = {
                        id: '1',
                        name: 'Test User',
                        email: VALID_EMAIL,
                        profilePicture: '/user.svg',
                    };

                    set({ isAuthenticated: true, user });
                    return true;
                }

                return false;
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);
