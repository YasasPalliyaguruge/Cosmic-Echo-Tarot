import React, { useState } from 'react';
import { Theme } from '../types';

interface SaveJournalModalProps {
  onClose: () => void;
  onSave: (title: string, notes: string) => void;
  theme: Theme;
}

const SaveJournalModal: React.FC<SaveJournalModalProps> = ({ onClose, onSave, theme }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const { classNames: themeClasses } = theme;

  const handleSaveClick = () => {
    onSave(title || "Journal Entry", notes);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-lg ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-2xl shadow-2xl flex flex-col ${themeClasses.textPrimary}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={`p-4 border-b ${themeClasses.cardBorder} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${themeClasses.textAccent}`}>Save to Journal</h2>
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-slate-700 transition-colors text-2xl leading-none`}>&times;</button>
        </header>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'Reflection on my career path'"
              className={`w-full bg-slate-700/50 border ${themeClasses.cardBorder} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
          </div>
          <div>
            <label htmlFor="notes" className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Notes & Reflections</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was on your mind? What questions did you have? What feelings did the cards bring up?"
              rows={5}
              className={`w-full bg-slate-700/50 border ${themeClasses.cardBorder} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
          </div>
        </div>

        <footer className={`p-4 border-t ${themeClasses.cardBorder} flex justify-end`}>
          <button 
            onClick={handleSaveClick}
            className={`px-6 py-2 font-bold text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-300`}
          >
            Save Entry
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SaveJournalModal;
