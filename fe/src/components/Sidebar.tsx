import { UserButton, useUser } from "@clerk/nextjs";
import React from 'react';
import Image from 'next/image';
import { ChatSession } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onExportChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onCloseMobile,
  onExportChat
}) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  const stripMarkdown = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/#{1,6}\s*/g, '')          // Remove headings (# ## ### etc)
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold **text**
      .replace(/\*([^*]+)\*/g, '$1')      // Remove italic *text*
      .replace(/__([^_]+)__/g, '$1')      // Remove bold __text__
      .replace(/_([^_]+)_/g, '$1')        // Remove italic _text_
      .replace(/`([^`]+)`/g, '$1')        // Remove inline code `text`
      .replace(/```[\s\S]*?```/g, '')     // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
      .replace(/^\s*[-*+]\s+/gm, '')      // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '')      // Remove numbered list markers
      .replace(/>\s*/g, '')               // Remove blockquotes
      .replace(/\n{2,}/g, ' ')            // Replace multiple newlines with space
      .replace(/\n/g, ' ')                // Replace single newlines with space
      .trim();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar Content */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Madlen AI"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Madlen AI</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button onClick={onCloseMobile} className="md:hidden text-slate-500 dark:text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-madlen-300 hover:bg-slate-800 dark:hover:bg-madlen-400 text-white dark:text-slate-900 py-3 px-4 rounded-xl transition-colors shadow-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Chat
          </button>

          {currentSessionId && onExportChat && (
            <button
              onClick={onExportChat}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Chat
            </button>
          )}
        </div>


        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <h2 className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">History</h2>
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-center w-full rounded-lg transition-all duration-200
                  ${currentSessionId === session.id
                    ? 'bg-madlen-50 dark:bg-madlen-900/30 text-madlen-900 dark:text-madlen-300 ring-1 ring-madlen-200 dark:ring-madlen-700'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <button
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  className="flex-1 text-left p-3 pr-8 min-w-0"
                >
                  <div className="font-medium truncate">{stripMarkdown(session.title)}</div>
                  <div className="text-xs opacity-70 truncate">{stripMarkdown(session.preview)}</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-all"
                  title="Delete Chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                No history yet.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <UserButton showName={false} />
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{user?.fullName || user?.username || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
            </div>
          </div>
        </div>
      </aside >
    </>
  );
};

export default Sidebar;