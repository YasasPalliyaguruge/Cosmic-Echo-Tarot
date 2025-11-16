import React from 'react';
import { JournalEntry, Theme, CardBack } from '../types';
import SpreadLayout from './SpreadLayout';

declare global {
  interface Window { marked: { parse: (markdown: string) => string }; }
}

interface JournalEntryDetailProps {
  entry: JournalEntry;
  onBack: () => void;
  theme: Theme;
  cardBack: CardBack;
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({ entry, onBack, theme, cardBack }) => {
  const { classNames: themeClasses } = theme;

  return (
    <div className="flex flex-col items-center">
        <button onClick={onBack} className={`mb-8 text-sm font-medium ${themeClasses.textAccent} hover:text-indigo-200 transition-colors`}>
            &larr; Back to Journal
        </button>

        <div className={`p-6 md:p-8 ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-2xl max-w-5xl w-full`}>
            <div className="border-b border-slate-700/50 pb-4 mb-6">
                <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.textAccent}`}>{entry.title}</h2>
                <p className={`${themeClasses.textSecondary} mt-1`}>{new Date(entry.date).toLocaleString()} &bull; {entry.spread.name}</p>
            </div>
            
            {entry.notes && (
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold ${themeClasses.textPrimary} mb-2`}>Your Reflections</h3>
                    <p className={`whitespace-pre-wrap ${themeClasses.textSecondary}`}>{entry.notes}</p>
                </div>
            )}

            <div className="mb-10 w-full flex flex-col items-center">
              <h3 className={`text-xl font-semibold ${themeClasses.textPrimary} mb-6`}>Cards Drawn</h3>
              <SpreadLayout
                spread={entry.spread}
                drawnCards={entry.drawnCards}
                theme={theme}
                cardBack={cardBack}
                isJournalView={true}
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <h3 className={`text-2xl md:text-3xl font-semibold ${themeClasses.textAccent} mb-4`}>Original Reading</h3>
                <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-p:${themeClasses.textSecondary} prose-strong:${themeClasses.textPrimary} prose-headings:font-['Cormorant_Garamond'] prose-headings:${themeClasses.textAccent} prose-h3:text-3xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8 prose-h3:pb-2 prose-h3:border-b prose-h3:border-slate-700/50 prose-h3:first-of-type:mt-0 prose-ul:my-4 prose-li:my-2 prose-li:marker:${themeClasses.textAccent}`}
                    dangerouslySetInnerHTML={{ __html: window.marked.parse(entry.reading) }} 
                />
            </div>
        </div>
    </div>
  );
};

export default JournalEntryDetail;