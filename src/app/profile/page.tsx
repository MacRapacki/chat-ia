'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ProfileForm from '@/app/profile/components/ProfileForm';

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
                    <div className='px-4 py-6 sm:px-0'>
                        <ProfileForm />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
