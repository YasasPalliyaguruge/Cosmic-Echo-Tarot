
import React, { useState, useCallback, useEffect } from 'react';
import SpreadSelector from './components/SpreadSelector';
import ReadingView from './components/ReadingView';
import Header from './components/Header';
import ChatView from './components/ChatView';
import VoiceAssistantTrigger from './components/VoiceAssistantTrigger';
import SettingsModal from './components/SettingsModal';
import JournalView from './components/JournalView';
import JournalEntryDetail from './components/JournalEntryDetail';
import { Spread, Theme, CardBack, JournalEntry } from './types';
import { THEMES, CARD_BACKS } from './themes';
import ThemePreview from './components/ThemePreview';


const App: React.FC = () => {
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [activeView, setActiveView] = useState<'tarot' | 'chat' | 'journal' | 'journalDetail'>('tarot');
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentCardBack, setCurrentCardBack] = useState<CardBack>(CARD_BACKS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);


  useEffect(() => {
    const savedThemeId = localStorage.getItem('cosmic-echo-theme');
    const savedCardBackId = localStorage.getItem('cosmic-echo-card-back');
    const savedJournalEntries = localStorage.getItem('cosmic-echo-journal');

    const initialTheme = THEMES.find(t => t.id === savedThemeId) || THEMES[0];
    const initialCardBack = CARD_BACKS.find(cb => cb.id === savedCardBackId) || CARD_BACKS[0];
    
    setCurrentTheme(initialTheme);
    setCurrentCardBack(initialCardBack);
    if (savedJournalEntries) {
      setJournalEntries(JSON.parse(savedJournalEntries));
    }

  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('cosmic-echo-theme', theme.id);
  };
  
  const handleCardBackChange = (cardBack: CardBack) => {
    setCurrentCardBack(cardBack);
    localStorage.setItem('cosmic-echo-card-back', cardBack.id);
  };

  const handleSpreadSelect = useCallback((spread: Spread) => {
    setSelectedSpread(spread);
    setActiveView('tarot');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSpread(null);
    setActiveView('tarot');
    setSelectedJournalEntry(null);
  }, []);

  const handleStartChat = useCallback((context?: string) => {
    setChatContext(context);
    setActiveView('chat');
  }, []);
  
  const handleCloseFeature = useCallback(() => {
    const previousView = selectedSpread ? 'tarot' : (selectedJournalEntry ? 'journalDetail' : 'journal');
    setActiveView(previousView);
    setChatContext(undefined);
  }, [selectedSpread, selectedJournalEntry]);

  const handleShowJournal = () => {
    setSelectedSpread(null);
    setActiveView('journal');
  }

  const handleViewJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    setActiveView('journalDetail');
  }

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem('cosmic-echo-journal', JSON.stringify(updatedEntries));
  };
  
  const renderMainContent = () => {
    switch (activeView) {
      case 'journal':
        return <JournalView entries={journalEntries} onSelectEntry={handleViewJournalEntry} theme={currentTheme} />;
      case 'journalDetail':
        return selectedJournalEntry ? <JournalEntryDetail entry={selectedJournalEntry} onBack={handleShowJournal} theme={currentTheme} cardBack={currentCardBack} /> : <JournalView entries={journalEntries} onSelectEntry={handleViewJournalEntry} theme={currentTheme} />;
      case 'tarot':
      default:
        return selectedSpread ? (
          <ReadingView 
            spread={selectedSpread} 
            onDiscuss={(readingText: string) => handleStartChat(`My tarot reading is as follows:\n\n${readingText}\n\nCould you help me understand this better?`)}
            onSaveToJournal={handleAddJournalEntry}
            theme={currentTheme}
            cardBack={currentCardBack}
          />
        ) : (
          <SpreadSelector onSelect={handleSpreadSelect} theme={currentTheme} />
        );
    }
  };


  const { classNames: themeClasses } = currentTheme;

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.textPrimary} antialiased transition-colors duration-500`}>
      <div className={`absolute inset-0 -z-10 h-full w-full ${themeClasses.backgroundEffect} opacity-50`}></div>
      
      <Header 
        onNewReading={handleReset} 
        onShowJournal={handleShowJournal}
        showNewReadingButton={!!selectedSpread || activeView === 'journal' || activeView === 'journalDetail'} 
        theme={currentTheme}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderMainContent()}
      </main>

      <ThemePreview
        theme={currentTheme}
        cardBack={currentCardBack}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {activeView !== 'chat' && <VoiceAssistantTrigger onChat={() => handleStartChat()} theme={currentTheme}/>}
        
      {activeView === 'chat' && (
          <ChatView initialContext={chatContext} onClose={handleCloseFeature} theme={currentTheme} />
      )}

      {isSettingsOpen && (
        <SettingsModal 
            onClose={() => setIsSettingsOpen(false)}
            themes={THEMES}
            cardBacks={CARD_BACKS}
            selectedTheme={currentTheme}
            onThemeChange={handleThemeChange}
            selectedCardBack={currentCardBack}
            onCardBackChange={handleCardBackChange}
        />
      )}

    </div>
  );
};

export default App;
