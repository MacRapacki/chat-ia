'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore/authStore';
import { Camera, Save, User } from 'lucide-react';
import Image from 'next/image';

export default function ProfileForm() {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const updatedUser = { ...user!, ...formData };
            localStorage.setItem('user-profile', JSON.stringify(updatedUser));

            setMessage('Profile updated successfully!');
            setIsEditing(false);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    profilePicture: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    if (!user) {
        return (
            <div className='text-center'>
                <p className='text-gray-500'>No user data available</p>
            </div>
        );
    }

    return (
        <div className='max-w-2xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden'>
            <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                <h2 className='text-xl font-semibold text-gray-900'>
                    Profile Settings
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                    Manage your account information and preferences
                </p>
            </div>

            <form onSubmit={handleSubmit} className='p-6'>
                {/* Profile Picture */}
                <div className='flex items-center space-x-6 mb-6'>
                    <div className='relative'>
                        <div className='h-24 w-24 rounded-full overflow-hidden bg-gray-200'>
                            {formData.profilePicture ? (
                                <Image
                                    src={formData.profilePicture ?? '/user.svg'}
                                    alt='Profile'
                                    className='h-full w-full object-cover'
                                    width={96}
                                    height={96}
                                />
                            ) : (
                                <div className='h-full w-full flex items-center justify-center'>
                                    <User className='h-12 w-12 text-gray-400' />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <button
                                type='button'
                                onClick={triggerImageUpload}
                                className='absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-colors cursor-pointer'
                            >
                                <Camera className='h-4 w-4' />
                            </button>
                        )}
                    </div>

                    <div>
                        <h3 className='text-lg font-medium text-gray-900'>
                            {formData.name}
                        </h3>
                        <p className='text-sm text-gray-500'>
                            {formData.email}
                        </p>
                        {!isEditing && (
                            <button
                                type='button'
                                onClick={() => setIsEditing(true)}
                                className='mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer'
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='hidden'
                    />
                </div>

                {/* Form Fields */}
                <div className='space-y-6'>
                    <div>
                        <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Full Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            disabled={!isEditing}
                            className='mt-1 p-1.5 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Email Address
                        </label>
                        <input
                            type='email'
                            id='email'
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            disabled={!isEditing}
                            className='mt-1 p-1.5 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500'
                        />
                    </div>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`mt-4 p-3 rounded-md ${
                            message.includes('success')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                    <div className='mt-6 flex justify-end space-x-3'>
                        <button
                            type='button'
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user.name,
                                    email: user.email,
                                    profilePicture: user.profilePicture || '',
                                });
                            }}
                            className='px-4 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isSaving}
                            className='inline-flex cursor-pointer items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                        >
                            {isSaving ? (
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                            ) : (
                                <Save className='h-4 w-4 mr-2' />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
