'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore/chatStore';
import { Send, Paperclip, Trash2, Image as ImageSvg } from 'lucide-react';
import { Attachment, Message } from '@/stores/chatStore/chatStore.types';
import FileUpload from './FileUpload';
import SpeechToText from './SpeechToText';
import Image from 'next/image';

export default function ChatInterface() {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { currentSession, isLoading, error, sendMessage, clearChat } =
        useChatStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentSession?.messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;

        await sendMessage(message, attachments);
        setMessage('');
        setAttachments([]);
        setShowFileUpload(false);
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as React.FormEvent);
        }
    };

    const handleSpeechTranscript = (transcript: string) => {
        setMessage((prev) => prev + (prev ? ' ' : '') + transcript);
        // Focus the textarea after speech input
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const MessageBubble = ({ message }: { message: Message }) => {
        const isUser = message.role === 'user';

        return (
            <div
                className={`flex ${
                    isUser ? 'justify-end' : 'justify-start'
                } mb-4`}
            >
                <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isUser
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                    }`}
                >
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className='mb-2 space-y-2'>
                            {message.attachments.map((attachment) => (
                                <div key={attachment.id} className='text-sm'>
                                    {attachment.type.startsWith('image/') &&
                                    attachment.data ? (
                                        <Image
                                            src={attachment.data}
                                            alt={attachment.name}
                                            className='max-w-full h-auto rounded border'
                                        />
                                    ) : (
                                        <div
                                            className={`flex items-center space-x-2 p-2 rounded ${
                                                isUser
                                                    ? 'bg-indigo-500'
                                                    : 'bg-gray-200'
                                            }`}
                                        >
                                            <ImageSvg className='h-4 w-4' />
                                            <span className='text-xs'>
                                                {attachment.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Message content */}
                    <div className='whitespace-pre-wrap'>{message.content}</div>

                    {/* Timestamp */}
                    <div
                        className={`text-xs mt-1 ${
                            isUser ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                    >
                        {formatTime(message.timestamp)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='flex flex-col h-full bg-gray-50'>
            {/* Header */}
            <div className='bg-white border-b border-gray-200 px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold text-gray-900'>
                        AI Chat
                    </h1>
                    <button
                        onClick={clearChat}
                        className='cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-6 py-4'>
                {!currentSession?.messages.length ? (
                    <div className='text-center text-gray-500 mt-8'>
                        <p className='text-lg mb-2'>Welcome to AI Chat!</p>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {currentSession.messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && (
                            <div className='flex justify-start mb-4'>
                                <div className='bg-gray-100 rounded-lg px-4 py-2 max-w-xs lg:max-w-md'>
                                    <div className='flex space-x-1'>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]' />
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]' />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Error message */}
            {error && (
                <div className='mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                    <p className='text-red-600 text-sm'>{error}</p>
                </div>
            )}

            {/* File upload area */}
            {showFileUpload && (
                <div className='mx-6 mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
                    <FileUpload
                        attachments={attachments}
                        onFilesChange={setAttachments}
                    />
                </div>
            )}

            {/* Input area */}
            <div className='bg-white border-t border-gray-200 px-6 py-4'>
                <form onSubmit={handleSubmit} className='flex space-x-3'>
                    <div className='flex-1'>
                        <div className='relative'>
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    e.target.style.height =
                                        Math.min(e.target.scrollHeight, 128) +
                                        'px';
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder='Type your message...'
                                className='block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-black'
                                rows={1}
                            />

                            {/* Attachment indicator */}
                            {attachments.length > 0 && (
                                <div className='absolute bottom-2 left-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded'>
                                    {attachments.length} file
                                    {attachments.length > 1 ? 's' : ''} attached
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className='flex items-end space-x-2'>
                        <SpeechToText
                            onTranscript={handleSpeechTranscript}
                            isDisabled={isLoading}
                        />

                        <button
                            type='button'
                            onClick={() => setShowFileUpload(!showFileUpload)}
                            className={`p-2 rounded-md transition-colors cursor-pointer ${
                                showFileUpload || attachments.length > 0
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Paperclip className='h-5 w-5' />
                        </button>

                        <button
                            type='submit'
                            disabled={
                                isLoading ||
                                (!message.trim() && attachments.length === 0)
                            }
                            className='cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <Send className='h-4 w-4' />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
