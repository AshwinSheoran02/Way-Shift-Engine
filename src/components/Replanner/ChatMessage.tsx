import type { ChatMessage as ChatMessageType } from '../../types/trip.types';
import { DiffView } from './DiffView';
import { ExplainPanel } from './ExplainPanel';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Renders a single chat message bubble.
 * User messages are right-aligned, assistant messages are left-aligned.
 * If the message has a replanResult, renders DiffView + ExplainPanel below.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        isUser
          ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'
          : 'gradient-accent text-white shadow-md'
      }`}>
        {isUser ? 'You' : 'W'}
      </div>

      {/* Message content */}
      <div className={`max-w-[85%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--color-accent-mid)]/20 text-[var(--color-text-primary)] rounded-tr-md'
            : 'glass rounded-tl-md text-[var(--color-text-primary)]'
        }`}>
          {message.content}
        </div>

        {/* Replan result display */}
        {message.replanResult && (
          <div className="space-y-3 w-full">
            <DiffView replanResult={message.replanResult} />
            <ExplainPanel replanResult={message.replanResult} />
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] text-[var(--color-text-muted)] px-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
