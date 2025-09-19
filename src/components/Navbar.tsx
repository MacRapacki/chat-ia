'use client';

import { useAuthStore } from '@/stores/authStore/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) return null;

    return (
        <nav className='bg-white shadow-sm border-b border-gray-200'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center space-x-8'>
                        <div className='flex-shrink-0'>
                            <h1 className='text-xl font-bold text-gray-900'>
                                AI Chat App
                            </h1>
                        </div>

                        <div className='flex space-x-4'>
                            <Link
                                href='/chat'
                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === '/chat'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <MessageCircle className='h-4 w-4 mr-2' />
                                Chat
                            </Link>

                            <Link
                                href='/profile'
                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === '/profile'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <User className='h-4 w-4 mr-2' />
                                Profile
                            </Link>
                        </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-3'>
                            <Image
                                src={user.profilePicture ?? '/user.svg'}
                                alt={user.name}
                                className='h-8 w-8 rounded-full bg-gray-200'
                                width={32}
                                height={32}
                            />
                            <span className='text-sm font-medium text-gray-700'>
                                {user.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className='inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer'
                        >
                            <LogOut className='h-4 w-4 mr-2' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
