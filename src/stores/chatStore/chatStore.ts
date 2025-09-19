import { create } from 'zustand';
import {
    ChatState,
    ChatSession,
    Message,
    Attachment,
} from '@/stores/chatStore/chatStore.types';

export const useChatStore = create<ChatState>((set, get) => ({
    currentSession: null,
    isLoading: false,
    error: null,

    sendMessage: async (content: string, attachments?: Attachment[]) => {
        const state = get();

        if (!content.trim()) return;

        set({ isLoading: true, error: null });

        try {
            // Create user message
            const userMessage: Message = {
                id: Date.now().toString(),
                content,
                role: 'user',
                timestamp: new Date(),
                attachments,
            };

            // Update session with user message
            const currentSession = state.currentSession || {
                id: Date.now().toString(),
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedSession: ChatSession = {
                ...currentSession,
                messages: [...currentSession.messages, userMessage],
                updatedAt: new Date(),
            };

            set({ currentSession: updatedSession });

            // Create FormData for API call
            const formData = new FormData();
            formData.append('message', content);
            formData.append(
                'messages',
                JSON.stringify(updatedSession.messages)
            );

            // Add attachments to FormData
            if (attachments) {
                attachments.forEach((attachment, index) => {
                    if (attachment.data) {
                        // Convert base64 to blob for images
                        const byteCharacters = atob(
                            attachment.data.split(',')[1]
                        );
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], {
                            type: attachment.type,
                        });
                        formData.append(`file_${index}`, blob, attachment.name);
                    }
                });
            }

            // Call AI API with streaming
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');

            // Create assistant message placeholder
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: '',
                role: 'assistant',
                timestamp: new Date(),
            };

            const sessionWithAssistant: ChatSession = {
                ...updatedSession,
                messages: [...updatedSession.messages, assistantMessage],
            };

            set({ currentSession: sessionWithAssistant });

            // Process streaming chunks
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: streamDone } = await reader.read();
                done = streamDone;

                if (value) {
                    const chunk = decoder.decode(value);
                    const lines = chunk
                        .split('\n')
                        .filter((line) => line.trim());

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                done = true;
                                break;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.content) {
                                    assistantMessage.content += parsed.content;

                                    // Update the store with the new content
                                    const currentState = get();
                                    if (currentState.currentSession) {
                                        const updatedMessages =
                                            currentState.currentSession.messages.map(
                                                (msg) =>
                                                    msg.id ===
                                                    assistantMessage.id
                                                        ? {
                                                              ...assistantMessage,
                                                          }
                                                        : msg
                                            );

                                        set({
                                            currentSession: {
                                                ...currentState.currentSession,
                                                messages: updatedMessages,
                                                updatedAt: new Date(),
                                            },
                                        });
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing stream chunk', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to send message',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    clearChat: () => {
        set({ currentSession: null, error: null });
    },
}));
