'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File } from 'lucide-react';
import Image from 'next/image';
import { Attachment } from '@/stores/chatStore/chatStore.types';

interface FileUploadProps {
    onFilesChange: (files: Attachment[]) => void;
    attachments: Attachment[];
}

export default function FileUpload({
    onFilesChange,
    attachments,
}: FileUploadProps) {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);

            const maxSize = 10 * 1024 * 1024; // 10MB
            const validFiles = acceptedFiles.filter((file) => {
                if (file.size > maxSize) {
                    setError(
                        `File ${file.name} is too large. Maximum size is 10MB.`
                    );
                    return false;
                }
                return true;
            });

            const newAttachments: Attachment[] = [];

            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const attachment: Attachment = {
                        id:
                            Date.now().toString() +
                            Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: reader.result as string,
                    };

                    newAttachments.push(attachment);

                    if (newAttachments.length === validFiles.length) {
                        onFilesChange([...attachments, ...newAttachments]);
                    }
                };

                reader.readAsDataURL(file);
            });
        },
        [attachments, onFilesChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
            'text/*': ['.txt', '.md'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        onDropRejected: () => {
            setError(
                'Something went wrong with the file upload. Make sure the file type and size are correct.'
            );
        },
    });

    const removeAttachment = (id: string) => {
        onFilesChange(attachments.filter((att) => att.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className='space-y-3'>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <Upload className='mx-auto h-8 w-8 text-gray-400' />
                <p className='mt-2 text-sm text-gray-600'>
                    {isDragActive
                        ? 'Drop files here...'
                        : 'Drag & drop files here, or click to select'}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                    Supports images, PDFs, text files (max 10MB each)
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className='text-red-600 text-sm bg-red-50 p-2 rounded'>
                    {error}
                </div>
            )}

            {/* Attached files preview */}
            {attachments.length > 0 && (
                <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-700'>
                        Attached files:
                    </p>
                    <div className='space-y-2'>
                        {attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'
                            >
                                <div className='flex items-center space-x-3'>
                                    {attachment.type.startsWith('image/') &&
                                    attachment.data ? (
                                        <div className='flex-shrink-0'>
                                            <Image
                                                src={attachment.data}
                                                alt={attachment.name}
                                                className='h-10 w-10 object-cover rounded'
                                            />
                                        </div>
                                    ) : (
                                        <File className='h-8 w-8 text-gray-400' />
                                    )}
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>
                                            {attachment.name}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            {formatFileSize(attachment.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        removeAttachment(attachment.id)
                                    }
                                    className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                                >
                                    <X className='h-4 w-4' />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
