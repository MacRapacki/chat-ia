'use client';

import { useAuthStore } from '@/stores/authStore/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';

export default function Home() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/chat');
        }
    }, [isAuthenticated, router]);

    return <LoginForm />;
}
