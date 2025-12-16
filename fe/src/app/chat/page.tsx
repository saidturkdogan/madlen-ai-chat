'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatInterface from '../../components/ChatInterface';
import { fetchModels, fetchSessions, sendMessage, createSession } from '../../services/api';
import { Message, AIModel, ChatSession } from '../../types';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const { isLoaded, userId, getToken } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [models, setModels] = useState<AIModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && !userId) {
            router.push('/sign-in');
        }
    }, [isLoaded, userId, router]);

    // Initial Data Load
    useEffect(() => {
        if (!userId) return;

        const loadData = async () => {
            try {
                const token = await getToken();
                if (!token) return;

                const [modelsData, sessionsData] = await Promise.all([
                    fetchModels(),
                    fetchSessions(token)
                ]);
                setModels(modelsData);

                // Restore saved model from localStorage, or use first model
                const savedModel = localStorage.getItem('selectedModel');
                if (savedModel && modelsData.some((m: AIModel) => m.id === savedModel)) {
                    setSelectedModel(savedModel);
                } else if (modelsData.length > 0) {
                    setSelectedModel(modelsData[0].id);
                }

                setSessions(sessionsData);

                // Restore saved session from localStorage
                const savedSessionId = localStorage.getItem('currentSessionId');
                if (savedSessionId && sessionsData.some((s: ChatSession) => s.id === savedSessionId)) {
                    setCurrentSessionId(savedSessionId);
                    // Load messages for the saved session
                    const { fetchSessionMessages } = await import('../../services/api');
                    const rawMessages = await fetchSessionMessages(savedSessionId, token);
                    const sessionMessages: Message[] = rawMessages.map((m: { id: string; role: string; content: string; timestamp: string; image_url?: string }) => ({
                        id: m.id,
                        role: m.role as 'user' | 'assistant' | 'system',
                        content: m.content,
                        timestamp: m.timestamp,
                        imageUrl: m.image_url
                    }));
                    setMessages(sessionMessages);
                }
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, [userId, getToken]);

    if (!isLoaded || !userId) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-madlen-200 border-t-madlen-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading Madlen AI...</p>
                </div>
            </div>
        );
    }

    const handleNewChat = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const newSession = await createSession(token);
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSession.id);
            localStorage.setItem('currentSessionId', newSession.id);
            setMessages([]);
            // On mobile, close sidebar after creation
            setIsSidebarOpen(false);
        } catch (error) {
            console.error("Failed to create session", error);
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        setCurrentSessionId(sessionId);
        localStorage.setItem('currentSessionId', sessionId);
        try {
            const token = await getToken();
            if (!token) return;
            // Real fetch messages
            const { fetchSessionMessages } = await import('../../services/api');
            const rawMessages = await fetchSessionMessages(sessionId, token);
            // Map backend field names to frontend format
            const sessionMessages: Message[] = rawMessages.map((m: { id: string; role: string; content: string; timestamp: string; image_url?: string }) => ({
                id: m.id,
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
                timestamp: m.timestamp,
                imageUrl: m.image_url
            }));
            setMessages(sessionMessages);
        } catch (error) {
            console.error("Failed to load session messages", error);
        }
    };

    const handleSendMessage = async (text: string, image?: File) => {
        const token = await getToken();
        if (!token) return;

        // If no session exists, create one first
        let activeSessionId = currentSessionId;
        if (!activeSessionId) {
            try {
                const newSession = await createSession(token);
                setSessions(prev => [newSession, ...prev]);
                activeSessionId = newSession.id;
                setCurrentSessionId(activeSessionId);
            } catch (e) {
                console.error("Failed to create session before sending", e);
                return;
            }
        }

        // Add user message to UI immediately
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
            imageUrl: image ? URL.createObjectURL(image) : undefined
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await sendMessage(activeSessionId!, text, selectedModel, token, image);
            // Backend returns MessageResponse directly, not wrapped in { message: ... }
            const aiMessage: Message = {
                id: response.id,
                role: response.role as 'user' | 'assistant' | 'system',
                content: response.content,
                timestamp: response.timestamp,
                imageUrl: response.image_url
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Failed to send message", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with backend.';
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                content: `⚠️ ${errorMessage}`,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };



    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;

        try {
            const token = await getToken();
            if (!token) return;

            const { deleteSession } = await import('../../services/api');
            await deleteSession(sessionToDelete, token);

            setSessions(prev => prev.filter(s => s.id !== sessionToDelete));

            if (currentSessionId === sessionToDelete) {
                setCurrentSessionId(null);
                setMessages([]);
                localStorage.removeItem('currentSessionId');
            }
        } catch (error) {
            console.error("Failed to delete session", error);
        } finally {
            setSessionToDelete(null);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans relative">
            {/* Delete Confirmation Modal */}
            {sessionToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete Conversation?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                This action cannot be undone. This conversation will be permanently removed from your history.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSessionToDelete(null)}
                                className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteSession}
                                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Sidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={setSessionToDelete}
                isOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 h-full w-full">
                <ChatInterface
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    models={models}
                    selectedModel={selectedModel}
                    onModelChange={(modelId) => {
                        setSelectedModel(modelId);
                        localStorage.setItem('selectedModel', modelId);
                    }}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </main>
        </div>
    );
}
