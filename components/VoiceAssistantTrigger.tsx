import React from 'react';
import { Theme } from '../types';

interface VoiceAssistantTriggerProps {
  onChat: () => void;
  theme: Theme;
}

const VoiceAssistantTrigger: React.FC<VoiceAssistantTriggerProps> = ({ onChat, theme }) => {
    const { button, buttonHover } = theme.classNames;
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={onChat}
                className={`w-16 h-16 rounded-full ${button} text-white shadow-xl flex items-center justify-center ${buttonHover} transition-all duration-300 transform hover:scale-110`}
                aria-label="Chat with Aura"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </button>
        </div>
    );
};

export default VoiceAssistantTrigger;