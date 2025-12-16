import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Message, AIModel } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, image?: File) => void;
  models: AIModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onToggleSidebar: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  models,
  selectedModel,
  onModelChange,
  onToggleSidebar
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    onSendMessage(input, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[100dvh] bg-white dark:bg-slate-900 relative">
      {/* Header */}
      <header className="h-14 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-4 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Chat</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
            Connected
          </span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-24 h-24 mb-6">
              <Image
                src="/logo.png"
                alt="Madlen AI"
                width={96}
                height={96}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to Madlen AI</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Start a conversation with various AI models via OpenRouter.
              Select a model from the top left and type your message below.
            </p>
          </div>
        ) : (
          messages.filter(msg => msg && msg.role).map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm text-sm sm:text-base leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-slate-800 dark:bg-madlen-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'
                  }
                `}
              >
                {/* Image Display */}
                {msg.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                    <img src={msg.imageUrl} alt="Uploaded content" className="max-w-full max-h-64 object-cover" />
                  </div>
                )}

                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none 
                    prose-headings:text-slate-800 dark:prose-headings:text-slate-200 
                    prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
                    prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                    prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:my-2
                    prose-strong:text-slate-800 dark:prose-strong:text-slate-200
                    prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                    prose-pre:bg-slate-800 prose-pre:text-slate-50 prose-pre:rounded-xl prose-pre:my-3 prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-slate-700
                    prose-code:text-emerald-400 prose-code:font-mono prose-code:text-sm
                    prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0 prose-pre:prose-code:text-slate-50
                    [&_pre_code]:text-slate-50 [&_pre]:text-slate-50
                    prose-code:bg-slate-100 dark:prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-code:before:content-none prose-code:after:content-none
                    prose-a:text-madlen-500 prose-a:no-underline hover:prose-a:underline
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                )}

                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-madlen-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-madlen-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-madlen-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Modern Design */}
      <div className="p-4 bg-gradient-to-t from-slate-50 dark:from-slate-800 to-white dark:to-slate-900 border-t border-slate-100 dark:border-slate-700">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-madlen-200 dark:focus-within:ring-madlen-500/30 focus-within:border-madlen-300 dark:focus-within:border-madlen-500">

            {/* Quick Action Pills */}
            <div className="flex items-center gap-1.5 px-3 pt-2 pb-1.5 border-b border-slate-100 dark:border-slate-700 overflow-x-auto scrollbar-hide">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-madlen-50 dark:hover:bg-madlen-900/30 hover:text-madlen-600 dark:hover:text-madlen-400 border border-slate-200 dark:border-slate-600 hover:border-madlen-200 dark:hover:border-madlen-500 rounded-full transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("Write code for: ");
                  document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-madlen-50 dark:hover:bg-madlen-900/30 hover:text-madlen-600 dark:hover:text-madlen-400 border border-slate-200 dark:border-slate-600 hover:border-madlen-200 dark:hover:border-madlen-500 rounded-full transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("Explain this in simple terms: ");
                  document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-madlen-50 dark:hover:bg-madlen-900/30 hover:text-madlen-600 dark:hover:text-madlen-400 border border-slate-200 dark:border-slate-600 hover:border-madlen-200 dark:hover:border-madlen-500 rounded-full transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Explain
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("Write a professional text about: ");
                  document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-madlen-50 dark:hover:bg-madlen-900/30 hover:text-madlen-600 dark:hover:text-madlen-400 border border-slate-200 dark:border-slate-600 hover:border-madlen-200 dark:hover:border-madlen-500 rounded-full transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Write
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("Translate the following text to English: ");
                  document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-madlen-50 dark:hover:bg-madlen-900/30 hover:text-madlen-600 dark:hover:text-madlen-400 border border-slate-200 dark:border-slate-600 hover:border-madlen-200 dark:hover:border-madlen-500 rounded-full transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                Translate
              </button>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-4 pt-3">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 dark:border-slate-600" />
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Textarea */}
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Start a new message..."
                className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none resize-none px-4 py-2 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />

              {/* Bottom Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50">
                <div className="flex items-center gap-1">
                  {/* Model Selector */}
                  <div className="relative">
                    <select
                      value={selectedModel}
                      onChange={(e) => onModelChange(e.target.value)}
                      className="appearance-none bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium pl-2 pr-6 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-madlen-300 dark:focus:ring-madlen-500 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                    >
                      {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1"></div>

                  {/* Attach */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className={`
                    p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                    ${(!input.trim() && !selectedImage) || isLoading
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-madlen-500 dark:bg-madlen-300 hover:bg-madlen-600 dark:hover:bg-madlen-400 text-white dark:text-slate-900 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            AI generated content may be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;