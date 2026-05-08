import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/trip.types';
import { ChatMessage } from './ChatMessage';
import { DISRUPTION_EXAMPLES } from '../../constants/disruptions';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  loading: boolean;
  onSendMessage: (text: string) => void;
}

export function ChatInterface({ messages, loading, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          💬 Tell me what changed
        </h3>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-500 text-sm mb-4">
              Describe any disruption and I&apos;ll adjust your plan
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-xs font-bold text-white shadow-md">
              W
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="text-xs text-gray-400 ml-2">Analyzing disruption...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 border-t border-gray-200 pt-3 bg-white">
          <div className="flex flex-wrap gap-2">
            {DISRUPTION_EXAMPLES.slice(0, 4).map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="bg-white border border-gray-200 text-sm text-gray-600 rounded-full px-3 py-1 hover:border-[#4285F4] hover:text-[#4285F4] transition-all"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
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
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4285F4] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              !inputValue.trim() || loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#4285F4] hover:bg-[#3367D6] text-white'
            }`}
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}
