export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
    data?: string; // base64 for images
}

export interface ChatSession {
    id: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    currentSession: ChatSession | null;
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
    clearChat: () => void;
}
