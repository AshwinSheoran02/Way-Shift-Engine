import type { ChatMessage as ChatMessageType } from '../../types/trip.types';
import { DiffView } from './DiffView';
import { ExplainPanel } from './ExplainPanel';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
          W
        </div>
      )}

      <div className={`space-y-3 ${isUser ? 'max-w-[80%] ml-auto' : 'max-w-[90%]'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#4285F4] text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm'
        }`}>
          {message.content}
        </div>

        {message.replanResult && (
          <div className="space-y-3 w-full">
            <DiffView replanResult={message.replanResult} />
            <ExplainPanel replanResult={message.replanResult} />
          </div>
        )}

        <p className={`text-[10px] text-gray-400 px-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
