'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

interface SpeechToTextProps {
    onTranscript: (text: string) => void;
    isDisabled?: boolean;
}

export default function SpeechToText({
    onTranscript,
    isDisabled,
}: SpeechToTextProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    useEffect(() => {
        // Check if speech recognition is supported
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                setIsSupported(true);
                recognitionRef.current = new SpeechRecognition();

                const recognition = recognitionRef.current;

                if (!recognition) return;

                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.onresult = (event) => {
                    let finalTranscript = '';

                    for (
                        let i = event.resultIndex;
                        i < event.results.length;
                        i++
                    ) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        }
                    }

                    if (finalTranscript) {
                        onTranscript(finalTranscript);
                    }
                };

                recognition.onerror = (event) => {
                    setError(`Speech recognition error: ${event.error}`);
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTranscript]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setError(null);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className='flex flex-col items-center space-y-2'>
            <button
                onClick={isListening ? stopListening : startListening}
                disabled={isDisabled}
                className={`p-2 rounded-full transition-all duration-200 ${
                    isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                } ${
                    isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                }`}
                title={isListening ? 'Stop recording' : 'Start voice input'}
            >
                {isListening ? (
                    <Square className='h-4 w-4' />
                ) : (
                    <Mic className='h-4 w-4' />
                )}
            </button>

            {isListening && (
                <div className='text-xs text-red-600 font-medium'>
                    Listening...
                </div>
            )}

            {error && (
                <div className='text-xs text-red-600 max-w-xs text-center'>
                    {error}
                </div>
            )}
        </div>
    );
}

//  SpeechRecognition TypeScript Definitions
interface ISpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onaudiostart?: (this: ISpeechRecognition, ev: Event) => void;
    onaudioend?: (this: ISpeechRecognition, ev: Event) => void;
    onend?: (this: ISpeechRecognition, ev: Event) => void;
    onerror?: (this: ISpeechRecognition, ev: Event & { error: string }) => void;
    onnomatch?: (this: ISpeechRecognition, ev: Event) => void;
    onresult?: (this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void;
    onsoundstart?: (this: ISpeechRecognition, ev: Event) => void;
    onsoundend?: (this: ISpeechRecognition, ev: Event) => void;
    onspeechend?: (this: ISpeechRecognition, ev: Event) => void;
    onstart?: (this: ISpeechRecognition, ev: Event) => void;
}

interface ISpeechRecognitionConstructor {
    new (): ISpeechRecognition;
}

// Extend the Window interface
declare global {
    interface Window {
        SpeechRecognition: ISpeechRecognitionConstructor | undefined;
        webkitSpeechRecognition: ISpeechRecognitionConstructor | undefined;
    }
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}
