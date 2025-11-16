
import React from 'react';
import { JournalEntry, Theme } from '../types';

interface JournalViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  theme: Theme;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onSelectEntry, theme }) => {
  const { classNames: themeClasses } = theme;

  return (
    <div className="flex flex-col items-center">
      <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.textPrimary} mb-4 animate-fade-in-up`}>
        Your Journal
      </h2>
      <p style={{ animationDelay: '150ms' }} className={`text-lg ${themeClasses.textSecondary} mb-12 max-w-2xl text-center animate-fade-in-up`}>
        Reflect on your journey. Here are your saved readings, a timeline of your cosmic echoes.
      </p>

      <div className="w-full max-w-3xl space-y-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`group cursor-pointer p-6 ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-lg animate-fade-in-up`}
              style={{ animationDelay: `${250 + index * 100}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-xl font-semibold ${themeClasses.textAccent} group-hover:text-pink-200 transition-colors`}>{entry.title}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <p className={`text-sm ${themeClasses.textSecondary} italic mb-3`}>
                {entry.spread.name}
              </p>
              <p className={`text-sm ${themeClasses.textPrimary} line-clamp-2`}>
                {entry.notes || "No notes for this entry."}
              </p>
            </div>
          ))
        ) : (
          <div className={`text-center p-8 ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-xl animate-fade-in-up`} style={{ animationDelay: '250ms' }}>
            <p className={`${themeClasses.textPrimary}`}>Your journal is empty.</p>
            <p className={`${themeClasses.textSecondary} mt-2`}>Complete a new reading to start your collection of insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
