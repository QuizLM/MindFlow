import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSubmit,
    isLoading,
    disabled
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isLoading && !disabled) {
                onSubmit();
            }
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
            <div className="relative flex w-full items-end gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask MindFlow AI anything..."
                    className="max-h-[200px] min-h-[44px] w-full resize-none border-0 bg-transparent p-3 py-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 dark:text-white dark:placeholder:text-gray-400 sm:text-sm"
                    rows={1}
                    disabled={isLoading || disabled}
                />
                <button
                    onClick={onSubmit}
                    disabled={!value.trim() || isLoading || disabled}
                    className={cn(
                        "mb-1 mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                        value.trim() && !isLoading && !disabled
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </button>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                AI can make mistakes. Verify important information.
            </div>
        </div>
    );
};
