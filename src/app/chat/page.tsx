'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/app/chat/components/ChatInterface';

export default function ChatPage() {
    return (
        <ProtectedRoute>
            <div className='h-screen flex flex-col'>
                <Navbar />
                <div className='flex-1'>
                    <ChatInterface />
                </div>
            </div>
        </ProtectedRoute>
    );
}
