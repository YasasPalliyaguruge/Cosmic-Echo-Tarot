
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, Theme } from '../types';

// Make 'marked' available globally for TypeScript
declare global {
  interface Window { marked: { parse: (markdown: string) => string }; }
}
interface ChatViewProps {
  onClose: () => void;
  initialContext?: string;
  theme: Theme;
}

const ChatView: React.FC<ChatViewProps> = ({ onClose, initialContext, theme }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { classNames: themeClasses } = theme;

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = 'You are Aura, a wise, empathetic, and modern tarot guide. Your goal is to help users explore their tarot readings and questions with insight and clarity. Be supportive and thoughtful. Keep responses concise and easy to understand. Format your responses in simple Markdown.';
        
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });

        let firstMessage = "Hello! How can I help you explore your path today?";
        if (initialContext) {
            const response = await chatRef.current.sendMessage({ message: initialContext });
            firstMessage = response.text;
        }

        setMessages([{ role: 'model', text: firstMessage }]);
      } catch (e) {
        console.error("Chat initialization failed:", e);
        setError("Could not connect with Aura. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeChat();
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
        console.error("Failed to send message:", e);
        setError("Aura is currently unavailable. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-lg h-[80vh] ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-2xl shadow-2xl flex flex-col`}>
        <header className={`p-4 border-b ${themeClasses.cardBorder} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${themeClasses.textAccent}`}>Chat with Aura</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&times;</button>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? `${themeClasses.button} text-white rounded-br-none` : `bg-slate-700 ${themeClasses.textPrimary} rounded-bl-none`}`}>
                        {msg.role === 'model' ? (
                             <div 
                                className="text-sm prose prose-sm prose-invert max-w-none prose-p:my-0" 
                                dangerouslySetInnerHTML={{ __html: window.marked.parse(msg.text) }}
                            />
                        ) : (
                            <p className="text-sm">{msg.text}</p>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700 rounded-bl-none flex items-center space-x-2">
                        <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
                    </div>
                </div>
            )}
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className={`p-4 border-t ${themeClasses.cardBorder}`}>
            <div className="flex items-center bg-slate-700 rounded-lg">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your reading..."
                    className="w-full bg-transparent p-3 focus:outline-none"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="p-3 text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;