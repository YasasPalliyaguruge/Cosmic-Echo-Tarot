import React, { useEffect, useRef, useState } from 'react';
import type { Chat } from '@google/genai';
import { ChatMessage, Theme } from '../types';
import { renderSafeMarkdown } from '../utils/safeMarkdown';

interface ChatViewProps {
  onClose: () => void;
  initialContext?: string;
  theme: Theme;
}

const MAX_CHAT_MESSAGE_LENGTH = 1000;

const configurationMessage = (error: unknown): string => {
  if (
    error instanceof Error &&
    error.message.startsWith('Gemini is not configured')
  ) {
    return error.message;
  }

  return 'Could not connect with Aura. Please check your connection and try again.';
};

const ChatView: React.FC<ChatViewProps> = ({
  onClose,
  initialContext,
  theme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { classNames: themeClasses } = theme;

  useEffect(() => {
    let isCurrent = true;

    const initializeChat = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { createAuraChat } = await import('../services/geminiService');
        const chat = createAuraChat();
        chatRef.current = chat;

        let firstMessage = 'Hello! How can I help you explore your path today?';
        if (initialContext) {
          const response = await chat.sendMessage({ message: initialContext });
          firstMessage = response.text?.trim() || firstMessage;
        }

        if (isCurrent) {
          setMessages([{ role: 'model', text: firstMessage }]);
        }
      } catch (initializationError) {
        if (isCurrent) {
          chatRef.current = null;
          setError(configurationMessage(initializationError));
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void initializeChat();
    return () => {
      isCurrent = false;
      chatRef.current = null;
    };
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const messageText = input.trim();

    if (!messageText || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({
        message: messageText,
      });
      const responseText = response.text?.trim();

      if (!responseText) {
        throw new Error('Gemini returned an empty response.');
      }

      setMessages((current) => [
        ...current,
        { role: 'model', text: responseText },
      ]);
    } catch (sendError) {
      setError(
        sendError instanceof Error &&
          sendError.message.startsWith('Gemini is not configured')
          ? sendError.message
          : 'Aura is currently unavailable. Please try again in a moment.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aura-chat-title"
    >
      <div
        className={`flex h-[80vh] w-full max-w-lg flex-col rounded-2xl border ${themeClasses.cardBackground} ${themeClasses.cardBorder} shadow-2xl`}
      >
        <header
          className={`flex items-center justify-between border-b p-4 ${themeClasses.cardBorder}`}
        >
          <h2
            id="aura-chat-title"
            className={`text-xl font-bold ${themeClasses.textAccent}`}
          >
            Chat with Aura
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close Aura chat"
          >
            &times;
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.role === 'user'
                    ? `${themeClasses.button} rounded-br-none text-white`
                    : `rounded-bl-none bg-slate-700 ${themeClasses.textPrimary}`
                }`}
              >
                {message.role === 'model' ? (
                  <div
                    className="prose prose-sm prose-invert max-w-none text-sm prose-p:my-0"
                    dangerouslySetInnerHTML={{
                      __html: renderSafeMarkdown(message.text),
                    }}
                  />
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start" aria-label="Aura is responding">
              <div className="flex max-w-[80%] items-center space-x-2 rounded-2xl rounded-bl-none bg-slate-700 p-3">
                <span className="block h-2 w-2 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.3s]" />
                <span className="block h-2 w-2 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.15s]" />
                <span className="block h-2 w-2 animate-bounce rounded-full bg-indigo-300" />
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className={`border-t p-4 ${themeClasses.cardBorder}`}
        >
          <div className="flex items-center rounded-lg bg-slate-700">
            <label htmlFor="aura-chat-input" className="sr-only">
              Ask Aura about your reading
            </label>
            <input
              id="aura-chat-input"
              type="text"
              value={input}
              maxLength={MAX_CHAT_MESSAGE_LENGTH}
              onChange={(event) => setInput(event.target.value.slice(0, MAX_CHAT_MESSAGE_LENGTH))}
              placeholder="Ask about your reading..."
              className="w-full bg-transparent p-3 focus:outline-none"
              disabled={isLoading || !chatRef.current}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !chatRef.current}
              className="p-3 text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 disabled:opacity-50"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-right text-xs text-slate-400">
            {input.length}/{MAX_CHAT_MESSAGE_LENGTH}
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
