
import React from 'react';
import { SPREADS } from '../constants';
import { Spread, Theme } from '../types';

interface SpreadSelectorProps {
  onSelect: (spread: Spread) => void;
  theme: Theme;
}

const SpreadSelector: React.FC<SpreadSelectorProps> = ({ onSelect, theme }) => {
  const { classNames: themeClasses } = theme;
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.textPrimary} mb-4 animate-fade-in-up`}>
        Seek Your Wisdom
      </h2>
      <p style={{ animationDelay: '150ms' }} className={`text-lg ${themeClasses.textSecondary} mb-12 max-w-2xl animate-fade-in-up`}>
        Choose a spread to begin your journey. Each layout offers a unique lens through which to explore your questions and unveil the path ahead.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {SPREADS.map((spread, index) => (
          <div
            key={spread.name}
            onClick={() => onSelect(spread)}
            className={`group relative cursor-pointer p-8 ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-500/10 hover:-translate-y-2 animate-fade-in-up active:scale-95`}
            style={{ animationDelay: `${250 + index * 100}ms` }}
          >
            <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className={`text-2xl font-semibold ${themeClasses.textPrimary} mb-3`}>{spread.name}</h3>
            <p className={`${themeClasses.textSecondary} mb-6`}>{spread.description}</p>
            <span
              className={`font-semibold ${themeClasses.textAccent} group-hover:text-pink-300 transition-colors duration-300`}
            >
              Begin Reading &rarr;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelector;