import React from 'react';
import { Theme, CardBack } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  themes: Theme[];
  cardBacks: CardBack[];
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  selectedCardBack: CardBack;
  onCardBackChange: (cardBack: CardBack) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  themes,
  cardBacks,
  selectedTheme,
  onThemeChange,
  selectedCardBack,
  onCardBackChange,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-300">Customize Appearance</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-2xl leading-none">&times;</button>
        </header>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
          {/* Theme Selection */}
          <div>
            <h3 className="font-semibold mb-3">Themes</h3>
            <div className="grid grid-cols-3 gap-4">
              {themes.map(theme => (
                <div key={theme.id} onClick={() => onThemeChange(theme)} className="cursor-pointer group">
                  <div className={`w-full h-16 rounded-lg ${theme.previewClassName} flex items-center justify-center ring-2 transition-all duration-200 ${selectedTheme.id === theme.id ? 'ring-indigo-400' : 'ring-transparent group-hover:ring-slate-500'}`}>
                    {selectedTheme.id === theme.id && (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                    )}
                  </div>
                  <p className={`text-center text-sm mt-2 transition-colors ${selectedTheme.id === theme.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{theme.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Back Selection */}
          <div>
            <h3 className="font-semibold mb-3">Card Backs</h3>
            <div className="grid grid-cols-3 gap-4">
              {cardBacks.map(cb => (
                <div key={cb.id} onClick={() => onCardBackChange(cb)} className="cursor-pointer group">
                    <div className={`relative w-full h-24 rounded-md p-1 ring-2 transition-all duration-200 ${selectedCardBack.id === cb.id ? 'ring-indigo-400' : 'ring-transparent group-hover:ring-slate-500'} ${cb.bgClassName}`}>
                        <cb.component />
                    </div>
                    <p className={`text-center text-sm mt-2 transition-colors ${selectedCardBack.id === cb.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{cb.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;