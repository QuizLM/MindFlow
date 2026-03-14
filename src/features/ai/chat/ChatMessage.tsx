import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { AIChatMessage } from '../../../lib/db';

interface ChatMessageProps {
    message: AIChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={cn(
            "flex w-full px-4 py-6",
            isUser ? "bg-transparent" : "bg-gray-50 dark:bg-gray-800/50"
        )}>
            <div className="mx-auto flex w-full max-w-3xl gap-4">
                <div className="flex-shrink-0">
                    {isUser ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-indigo-600">
                            <User className="h-5 w-5 text-white" />
                        </div>
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-emerald-600">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1 space-y-2 overflow-hidden prose dark:prose-invert prose-sm md:prose-base max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
