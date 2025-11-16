
import React, { useState, useEffect } from 'react';
import { TarotCardData, CardBack, Theme } from '../types';
import { generateCardImage } from '../services/geminiService';

interface TarotCardProps {
  card: TarotCardData;
  isFaceUp: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  cardBack: CardBack;
  theme: Theme;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isFaceUp, isReversed = false, onClick, cardBack, theme }) => {
  const CardBackComponent = cardBack.component;
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      // Trigger generation only when the card is face up and we don't have an image or aren't already loading
      if (isFaceUp && !imageData && !isLoading) {
        setIsLoading(true);
        setError(null);
        try {
          const b64Data = await generateCardImage(card.generationPrompt);
          setImageData(`data:image/png;base64,${b64Data}`);
        } catch (e) {
          console.error("Failed to generate card image:", e);
          setError("Image generation failed.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    generate();
  }, [isFaceUp, imageData, isLoading, card.generationPrompt]);
  
  return (
    <div className="group [perspective:1000px]">
      <div
        className={`relative w-44 h-64 rounded-xl shadow-lg transition-transform duration-700 cursor-pointer [transform-style:preserve-3d] ${isFaceUp ? '[transform:rotateY(180deg)]' : ''} group-hover:scale-105`}
        onClick={onClick}
      >
        {/* Card Front */}
        <div className={`absolute w-full h-full rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${theme.classNames.cardBackground}`}>
          {imageData ? (
            <img
              src={imageData}
              alt={card.name}
              className={`w-full h-full object-cover rounded-xl ${isReversed ? 'rotate-180' : ''}`}
              role="img"
              aria-label={card.name}
            />
          ) : (
            <div className={`w-full h-full rounded-xl flex items-center justify-center text-center`}>
                {isLoading && (
                  <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-t-2 border-t-pink-400 border-slate-600 rounded-full animate-spin"></div>
                      <span className={`text-xs mt-2 ${theme.classNames.textSecondary}`}>Generating...</span>
                  </div>
                )}
                {error && (
                  <div className="text-red-400 text-sm p-2">{error}</div>
                )}
            </div>
          )}
        </div>
        
        {/* Card Back */}
        <div className={`absolute w-full h-full rounded-xl [backface-visibility:hidden] ${cardBack.bgClassName} p-2`}>
          <CardBackComponent />
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
