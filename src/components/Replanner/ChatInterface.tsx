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
 * Chat interface with message thread, typing indicator, and send functionality.
 * Includes example disruption hints for first-time users.
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
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">
              Tell me what changed in your trip
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DISRUPTION_EXAMPLES.slice(0, 4).map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] text-xs hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] transition-colors border border-white/5"
                >
                  &ldquo;{example}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white shadow-md">
              W
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="text-xs text-[var(--color-text-muted)] ml-2">Analyzing disruption...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/5">
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
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] transition-colors text-sm disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              !inputValue.trim() || loading
                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
                : 'gradient-accent text-white shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-95'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
