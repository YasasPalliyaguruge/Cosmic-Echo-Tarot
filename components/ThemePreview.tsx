import React from 'react';
import { Theme, CardBack } from '../types';

interface ThemePreviewProps {
    theme: Theme;
    cardBack: CardBack;
    onOpenSettings: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, cardBack, onOpenSettings }) => {
    const CardBackComponent = cardBack.component;
    return (
        <div 
            onClick={onOpenSettings}
            className="fixed bottom-6 left-6 z-40 group cursor-pointer"
        >
            <div className="relative w-28 h-20 rounded-lg shadow-xl flex items-center justify-center bg-slate-800/80 backdrop-blur-sm border border-slate-700 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <div className={`absolute inset-0 ${theme.previewClassName} opacity-50`}></div>
                <div className="relative w-10 h-14 rounded-sm transform -rotate-12">
                    <div className={`${cardBack.bgClassName} w-full h-full rounded-sm p-0.5`}>
                        <CardBackComponent />
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <span className="absolute bottom-1.5 text-xs font-bold text-white">Appearance</span>
            </div>
        </div>
    );
};

export default ThemePreview;
