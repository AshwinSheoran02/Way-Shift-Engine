import type { ChatMessage as ChatMessageType } from '../../types/trip.types';
import { DiffView } from './DiffView';
import { ExplainPanel } from './ExplainPanel';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Renders a single chat message bubble.
 * User: indigo bubble right-aligned. Assistant: white border bubble left-aligned.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
          W
        </div>
      )}

      {/* Message content */}
      <div className={`space-y-3 ${isUser ? 'max-w-[80%] ml-auto' : 'max-w-[90%]'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
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
        <p className={`text-[10px] text-slate-400 dark:text-slate-500 px-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
