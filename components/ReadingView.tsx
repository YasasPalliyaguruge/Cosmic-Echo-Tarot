import React, { useState, useEffect, useCallback } from 'react';
import { DrawnCard, Spread, TarotCardData, Theme, CardBack, JournalEntry } from '../types';
import { tarotDeck } from '../data/tarotDeck';
import { getTarotReading, generateSpeech } from '../services/geminiService';
import TarotCard from './TarotCard';
import AudioPlayer from './AudioPlayer';
import SaveJournalModal from './SaveJournalModal';
import SpreadLayout from './SpreadLayout';

// Make 'marked' available globally for TypeScript
declare global {
  interface Window { marked: { parse: (markdown: string) => string }; }
}
interface ReadingViewProps {
  spread: Spread;
  onDiscuss: (readingText: string) => void;
  onSaveToJournal: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  theme: Theme;
  cardBack: CardBack;
}

const ReadingView: React.FC<ReadingViewProps> = ({ spread, onDiscuss, onSaveToJournal, theme, cardBack }) => {
  const [shuffledDeck, setShuffledDeck] = useState<TarotCardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    const shuffle = (deck: TarotCardData[]): TarotCardData[] => {
      return [...deck].sort(() => Math.random() - 0.5);
    };
    setShuffledDeck(shuffle(tarotDeck));
    setDrawnCards([]);
    setReading('');
    setError('');
    setIsLoading(false);
    setAudioData(null);
    setIsGeneratingAudio(false);
    setIsSaveModalOpen(false);
  }, [spread]);

  const handleCardDraw = (card: TarotCardData) => {
    if (drawnCards.length < spread.cardCount) {
      const isReversed = Math.random() < 0.3; // 30% chance of being reversed
      setDrawnCards([...drawnCards, { card, isReversed }]);
      setShuffledDeck(shuffledDeck.filter(c => c.name !== card.name));
    }
  };
  
  const generateAndSetAudio = async (text: string) => {
      if (!text || text.trim().length === 0) return;
      setIsGeneratingAudio(true);
      try {
          const base64Audio = await generateSpeech(text);
          setAudioData(base64Audio);
      } catch (error) {
          console.error("Background audio generation failed:", error);
      } finally {
          setIsGeneratingAudio(false);
      }
  };

  const handleGetReading = useCallback(async () => {
    if (drawnCards.length === spread.cardCount) {
      setIsLoading(true);
      setError('');
      try {
        const result = await getTarotReading(spread, drawnCards);
        setReading(result);
        generateAndSetAudio(result);
      } catch (err) {
        setError('Failed to get reading. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [drawnCards, spread]);

  const handleSave = (title: string, notes: string) => {
    onSaveToJournal({ title, notes, spread, drawnCards, reading });
    setIsSaveModalOpen(false);
  };

  const allCardsDrawn = drawnCards.length === spread.cardCount;
  const { classNames: themeClasses } = theme;


  const renderInstruction = () => {
    if (isLoading) {
      return 'The cosmos is aligning...';
    }
    if (reading) {
      return 'Your reading has arrived.';
    }
    if (allCardsDrawn) {
      return 'Your cards are drawn. Unveil your reading.';
    }
    const remaining = spread.cardCount - drawnCards.length;
    return `Choose ${remaining} more card${remaining > 1 ? 's' : ''}.`;
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2">{spread.name}</h2>
        <p className={`${themeClasses.textSecondary} mb-8`}>{renderInstruction()}</p>

        <div className="mb-10 w-full flex flex-col items-center min-h-[300px] justify-center">
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
                        className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out hover:-translate-y-4"
                        style={{ transform: `translateX(${index * 2}px) translateY(${index * 2}px)` }}
                    >
                        <TarotCard card={card} isFaceUp={false} onClick={() => handleCardDraw(card)} cardBack={cardBack} theme={theme} />
                    </div>
                ))}
              </div>
            )}
        </div>

        {allCardsDrawn && !reading && !isLoading && (
          <button
            onClick={handleGetReading}
            className={`px-8 py-4 text-lg font-bold text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-lg shadow-lg shadow-pink-600/30 transition-all duration-300 transform hover:scale-105`}
          >
            Get My Reading
          </button>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-t-4 border-t-pink-400 border-slate-600 rounded-full animate-spin"></div>
              <p className={`${themeClasses.textSecondary}`}>Consulting the digital ether...</p>
          </div>
        )}
        
        {error && <p className="text-red-400 mt-4">{error}</p>}
        
        {reading && (
          <div className={`mt-12 p-6 md:p-8 ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-2xl max-w-4xl w-full animate-fade-in-up`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-2xl md:text-3xl font-semibold ${themeClasses.textAccent}`}>Your Cosmic Reading</h3>
                <AudioPlayer audioData={audioData} isGeneratingAudio={isGeneratingAudio} />
            </div>
            <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-p:${themeClasses.textSecondary} prose-strong:${themeClasses.textPrimary} prose-headings:font-['Cormorant_Garamond'] prose-headings:${themeClasses.textAccent} prose-h3:text-3xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8 prose-h3:pb-2 prose-h3:border-b prose-h3:border-slate-700/50 prose-h3:first-of-type:mt-0 prose-ul:my-4 prose-li:my-2 prose-li:marker:${themeClasses.textAccent}`}
                dangerouslySetInnerHTML={{ __html: window.marked.parse(reading) }} 
            />
            <div className="text-center mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className={`px-6 py-3 text-md font-bold ${themeClasses.textPrimary} bg-slate-500/10 rounded-lg border border-slate-500/20 hover:bg-slate-500/20 transition-all duration-300`}
              >
                  Save to Journal
              </button>
              <button
                  onClick={() => onDiscuss(reading)}
                  className={`px-6 py-3 text-md font-bold text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-lg shadow-lg shadow-pink-600/20 transition-all duration-300 transform hover:scale-105`}
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