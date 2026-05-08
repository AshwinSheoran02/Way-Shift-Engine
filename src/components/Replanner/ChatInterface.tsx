import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/trip.types';
import { ChatMessage } from './ChatMessage';
import { DISRUPTION_EXAMPLES } from '../../constants/disruptions';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  loading: boolean;
  onSendMessage: (text: string) => void;
}

/**
 * Chat interface with message thread, typing indicator, suggestion chips, and send functionality.
 * Light-first design with dark: variants.
 */
export function ChatInterface({ messages, loading, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Return focus to input after replan completes
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || loading) return;
    onSendMessage(text);
    setInputValue('');
  }, [inputValue, loading, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleExampleClick = useCallback((example: string) => {
    setInputValue(example);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          💬 Tell me what changed
        </h3>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Describe any disruption and I&apos;ll adjust your plan
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              W
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">Analyzing disruption...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex flex-wrap gap-2">
            {DISRUPTION_EXAMPLES.slice(0, 4).map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 rounded-full px-3 py-1 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what changed in your trip..."
            aria-label="Describe what changed in your trip"
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              !inputValue.trim() || loading
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}
