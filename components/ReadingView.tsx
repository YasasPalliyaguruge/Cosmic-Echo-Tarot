import React, { useCallback, useEffect, useState } from 'react';
import {
  CardBack,
  DrawnCard,
  JournalEntry,
  Spread,
  TarotCardData,
  Theme,
} from '../types';
import { tarotDeck } from '../data/tarotDeck';
import { renderSafeMarkdown } from '../utils/safeMarkdown';
import AudioPlayer from './AudioPlayer';
import SaveJournalModal from './SaveJournalModal';
import SpreadLayout from './SpreadLayout';
import TarotCard from './TarotCard';

interface ReadingViewProps {
  spread: Spread;
  onDiscuss: (readingText: string) => void;
  onSaveToJournal: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  theme: Theme;
  cardBack: CardBack;
}

const ReadingView: React.FC<ReadingViewProps> = ({
  spread,
  onDiscuss,
  onSaveToJournal,
  theme,
  cardBack,
}) => {
  const [shuffledDeck, setShuffledDeck] = useState<TarotCardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    setShuffledDeck([...tarotDeck].sort(() => Math.random() - 0.5));
    setDrawnCards([]);
    setReading('');
    setError('');
    setIsLoading(false);
    setAudioData(null);
    setIsGeneratingAudio(false);
    setIsSaveModalOpen(false);
  }, [spread]);

  const handleCardDraw = (card: TarotCardData) => {
    if (drawnCards.length >= spread.cardCount) return;

    const isReversed = Math.random() < 0.3;
    setDrawnCards((current) => [...current, { card, isReversed }]);
    setShuffledDeck((current) =>
      current.filter((deckCard) => deckCard.name !== card.name),
    );
  };

  const generateAndSetAudio = async (text: string) => {
    if (!text.trim()) return;

    setIsGeneratingAudio(true);
    try {
      const { generateSpeech } = await import('../services/geminiService');
      setAudioData(await generateSpeech(text));
    } catch {
      setAudioData(null);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGetReading = useCallback(async () => {
    if (drawnCards.length !== spread.cardCount) return;

    setIsLoading(true);
    setError('');

    try {
      const { getTarotReading } = await import('../services/geminiService');
      const result = await getTarotReading(spread, drawnCards);
      setReading(result);
      void generateAndSetAudio(result);
    } catch (readingError) {
      setReading('');
      setError(
        readingError instanceof Error
          ? readingError.message
          : 'Failed to generate the reading. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [drawnCards, spread]);

  const handleSave = (title: string, notes: string) => {
    onSaveToJournal({ title, notes, spread, drawnCards, reading });
    setIsSaveModalOpen(false);
  };

  const allCardsDrawn = drawnCards.length === spread.cardCount;
  const { classNames: themeClasses } = theme;

  const renderInstruction = () => {
    if (isLoading) return 'The cosmos is aligning...';
    if (reading) return 'Your reading has arrived.';
    if (allCardsDrawn) return 'Your cards are drawn. Unveil your reading.';

    const remaining = spread.cardCount - drawnCards.length;
    return `Choose ${remaining} more card${remaining > 1 ? 's' : ''}.`;
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="mb-2 text-3xl font-semibold md:text-4xl">
          {spread.name}
        </h2>
        <p className={`${themeClasses.textSecondary} mb-8`}>
          {renderInstruction()}
        </p>

        <div className="mb-10 flex min-h-[300px] w-full flex-col items-center justify-center">
          {allCardsDrawn ? (
            <SpreadLayout
              spread={spread}
              drawnCards={drawnCards}
              theme={theme}
              cardBack={cardBack}
            />
          ) : (
            <div className="relative h-64 w-44">
              {shuffledDeck.slice(0, 10).map((card, index) => (
                <div
                  key={card.name}
                  className="absolute left-0 top-0 h-full w-full transition-transform duration-500 ease-in-out hover:-translate-y-4"
                  style={{
                    transform: `translateX(${index * 2}px) translateY(${index * 2}px)`,
                  }}
                >
                  <TarotCard
                    card={card}
                    isFaceUp={false}
                    onClick={() => handleCardDraw(card)}
                    cardBack={cardBack}
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {allCardsDrawn && !reading && !isLoading && (
          <button
            type="button"
            onClick={() => void handleGetReading()}
            className={`rounded-lg px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-600/30 transition-all duration-300 hover:scale-105 ${themeClasses.button} ${themeClasses.buttonHover}`}
          >
            Get My Reading
          </button>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-600 border-t-pink-400" />
            <p className={themeClasses.textSecondary}>
              Consulting the digital ether...
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-400" role="alert">
            {error}
          </p>
        )}

        {reading && (
          <div
            className={`mt-12 w-full max-w-4xl animate-fade-in-up rounded-2xl border p-6 md:p-8 ${themeClasses.cardBackground} ${themeClasses.cardBorder}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className={`text-2xl font-semibold md:text-3xl ${themeClasses.textAccent}`}
              >
                Your Cosmic Reading
              </h3>
              <AudioPlayer
                audioData={audioData}
                isGeneratingAudio={isGeneratingAudio}
              />
            </div>
            <div
              className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-p:${themeClasses.textSecondary} prose-strong:${themeClasses.textPrimary} prose-headings:font-['Cormorant_Garamond'] prose-headings:${themeClasses.textAccent}`}
              dangerouslySetInnerHTML={{
                __html: renderSafeMarkdown(reading),
              }}
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-slate-700/50 pt-6 text-center sm:flex-row">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(true)}
                className={`rounded-lg border border-slate-500/20 bg-slate-500/10 px-6 py-3 text-md font-bold transition-all duration-300 hover:bg-slate-500/20 ${themeClasses.textPrimary}`}
              >
                Save to Journal
              </button>
              <button
                type="button"
                onClick={() => onDiscuss(reading)}
                className={`rounded-lg px-6 py-3 text-md font-bold text-white shadow-lg shadow-pink-600/20 transition-all duration-300 hover:scale-105 ${themeClasses.button} ${themeClasses.buttonHover}`}
              >
                Discuss with Aura
              </button>
            </div>
          </div>
        )}
      </div>

      {isSaveModalOpen && (
        <SaveJournalModal
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSave}
          theme={theme}
        />
      )}
    </>
  );
};

export default ReadingView;
