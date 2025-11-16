
import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
    onNewReading: () => void;
    onShowJournal: () => void;
    showNewReadingButton: boolean;
    theme: Theme;
}

const Header: React.FC<HeaderProps> = ({ onNewReading, onShowJournal, showNewReadingButton, theme }) => {
  const { textPrimary, textAccent } = theme.classNames;
  
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewReading}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-pink-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z"/>
            <path d="M12 15a3 3 0 0 1 3-3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1 3 3z"/>
        </svg>
        <h1 className={`text-2xl md:text-3xl font-bold tracking-wider ${textPrimary}`}>
            Cosmic Echo Tarot
        </h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button
          onClick={onShowJournal}
          className={`px-4 py-2 text-sm font-medium ${textPrimary} bg-slate-500/10 rounded-lg border border-slate-500/20 hover:bg-slate-500/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50`}
        >
          Journal
        </button>
        {showNewReadingButton && (
          <button
            onClick={onNewReading}
            className={`px-4 py-2 text-sm font-medium ${textAccent} bg-pink-500/10 rounded-lg border border-pink-500/20 hover:bg-pink-500/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50`}
          >
            New Reading
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
