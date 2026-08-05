import React, { useCallback, useEffect, useState } from 'react';
import ChatView from './components/ChatView';
import Header from './components/Header';
import JournalEntryDetail from './components/JournalEntryDetail';
import JournalView from './components/JournalView';
import ReadingView from './components/ReadingView';
import SettingsModal from './components/SettingsModal';
import SpreadSelector from './components/SpreadSelector';
import ThemePreview from './components/ThemePreview';
import VoiceAssistantTrigger from './components/VoiceAssistantTrigger';
import { CARD_BACKS, THEMES } from './themes';
import { CardBack, JournalEntry, Spread, Theme } from './types';

const JOURNAL_STORAGE_KEY = 'cosmic-echo-journal';
const THEME_STORAGE_KEY = 'cosmic-echo-theme';
const CARD_BACK_STORAGE_KEY = 'cosmic-echo-card-back';

const readLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The app remains usable when storage is blocked or full; persistence is
    // simply unavailable for the current browser session.
  }
};

const readJournalEntries = (): JournalEntry[] => {
  const savedEntries = readLocalStorage(JOURNAL_STORAGE_KEY);
  if (!savedEntries) return [];

  try {
    const parsedEntries: unknown = JSON.parse(savedEntries);
    return Array.isArray(parsedEntries) ? (parsedEntries as JournalEntry[]) : [];
  } catch {
    return [];
  }
};

const createJournalId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const App: React.FC = () => {
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [activeView, setActiveView] = useState<
    'tarot' | 'chat' | 'journal' | 'journalDetail'
  >('tarot');
  const [chatContext, setChatContext] = useState<string>();

  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentCardBack, setCurrentCardBack] = useState<CardBack>(CARD_BACKS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedJournalEntry, setSelectedJournalEntry] =
    useState<JournalEntry | null>(null);

  useEffect(() => {
    const savedThemeId = readLocalStorage(THEME_STORAGE_KEY);
    const savedCardBackId = readLocalStorage(CARD_BACK_STORAGE_KEY);

    setCurrentTheme(
      THEMES.find((theme) => theme.id === savedThemeId) || THEMES[0],
    );
    setCurrentCardBack(
      CARD_BACKS.find((cardBack) => cardBack.id === savedCardBackId) ||
        CARD_BACKS[0],
    );
    setJournalEntries(readJournalEntries());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    writeLocalStorage(THEME_STORAGE_KEY, theme.id);
  };

  const handleCardBackChange = (cardBack: CardBack) => {
    setCurrentCardBack(cardBack);
    writeLocalStorage(CARD_BACK_STORAGE_KEY, cardBack.id);
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
    const previousView = selectedSpread
      ? 'tarot'
      : selectedJournalEntry
        ? 'journalDetail'
        : 'journal';
    setActiveView(previousView);
    setChatContext(undefined);
  }, [selectedSpread, selectedJournalEntry]);

  const handleShowJournal = () => {
    setSelectedSpread(null);
    setActiveView('journal');
  };

  const handleViewJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    setActiveView('journalDetail');
  };

  const handleAddJournalEntry = (
    entry: Omit<JournalEntry, 'id' | 'date'>,
  ) => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: createJournalId(),
      date: now,
    };

    setJournalEntries((currentEntries) => {
      const updatedEntries = [newEntry, ...currentEntries];
      writeLocalStorage(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    });
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'journal':
        return (
          <JournalView
            entries={journalEntries}
            onSelectEntry={handleViewJournalEntry}
            theme={currentTheme}
          />
        );
      case 'journalDetail':
        return selectedJournalEntry ? (
          <JournalEntryDetail
            entry={selectedJournalEntry}
            onBack={handleShowJournal}
            theme={currentTheme}
            cardBack={currentCardBack}
          />
        ) : (
          <JournalView
            entries={journalEntries}
            onSelectEntry={handleViewJournalEntry}
            theme={currentTheme}
          />
        );
      case 'tarot':
      default:
        return selectedSpread ? (
          <ReadingView
            spread={selectedSpread}
            onDiscuss={(readingText) =>
              handleStartChat(
                `My tarot reading is as follows:\n\n${readingText}\n\nCould you help me understand this better?`,
              )
            }
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
    <div
      className={`min-h-screen ${themeClasses.background} ${themeClasses.textPrimary} antialiased transition-colors duration-500`}
    >
      <div
        className={`absolute inset-0 -z-10 h-full w-full ${themeClasses.backgroundEffect} opacity-50`}
        aria-hidden="true"
      />

      <Header
        onNewReading={handleReset}
        onShowJournal={handleShowJournal}
        showNewReadingButton={
          Boolean(selectedSpread) ||
          activeView === 'journal' ||
          activeView === 'journalDetail'
        }
        theme={currentTheme}
      />

      <main className="container mx-auto px-4 py-8">{renderMainContent()}</main>

      <ThemePreview
        theme={currentTheme}
        cardBack={currentCardBack}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {activeView !== 'chat' && (
        <VoiceAssistantTrigger
          onChat={() => handleStartChat()}
          theme={currentTheme}
        />
      )}

      {activeView === 'chat' && (
        <ChatView
          initialContext={chatContext}
          onClose={handleCloseFeature}
          theme={currentTheme}
        />
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
