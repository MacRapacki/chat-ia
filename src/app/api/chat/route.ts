import { Message } from '@/stores/chatStore/chatStore.types';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

const openai = createOpenAI({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const message = formData.get('message') as string;
        const messagesStr = formData.get('messages') as string;

        if (!message) {
            return new NextResponse('Message is required', { status: 400 });
        }

        // Parse previous messages
        let messages: Message[] = [];
        try {
            messages = messagesStr ? JSON.parse(messagesStr) : [];
        } catch (e) {
            console.error('Failed to parse messages:', e);
            messages = [];
        }

        // Process file attachments
        const files: File[] = [];
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('file_') && value instanceof File) {
                files.push(value);
            }
        }

        // Build messages for AI
        const aiMessages = messages.map((msg: Message) => ({
            role: msg.role,
            content: msg.content,
        }));

        // Add current message
        let currentContent = message;

        // If there are files, describe them in the message
        if (files.length > 0) {
            const fileDescriptions = files
                .map(
                    (file) =>
                        `File: ${file.name} (${file.type}, ${Math.round(
                            file.size / 1024
                        )}KB)`
                )
                .join(', ');
            currentContent += `\n\nAttached files: ${fileDescriptions}`;
        }

        aiMessages.push({
            role: 'user',
            content: currentContent,
        });

        // Check if OpenAI API key is set
        if (!process.env.NEXT_PUBLIC_API_KEY) {
            // Return a mock response if no API key is set
            const mockResponse =
                "I'm a mock AI assistant. To enable real AI responses, please set your OPENAI_API_KEY environment variable. " +
                'You can get an API key from https://platform.openai.com/api-keys';

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    // Simulate streaming by sending the message in chunks
                    const words = mockResponse.split(' ');
                    let index = 0;

                    const sendChunk = () => {
                        if (index < words.length) {
                            const chunk = words[index] + ' ';
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({
                                        content: chunk,
                                    })}\n\n`
                                )
                            );
                            index++;
                            setTimeout(sendChunk, 50); // Simulate typing delay
                        } else {
                            controller.enqueue(
                                encoder.encode('data: [DONE]\n\n')
                            );
                            controller.close();
                        }
                    };

                    sendChunk();
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive',
                },
            });
        }

        const result = streamText({
            model: openai('gpt-5'),
            messages: aiMessages,
        });

        // Convert to event-stream format
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    content: chunk,
                                })}\n\n`
                            )
                        );
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
