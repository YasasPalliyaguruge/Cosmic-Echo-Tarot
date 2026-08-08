import React, { useEffect, useState } from 'react';
import type { CardBack, TarotCardData, Theme } from '../types';

interface TarotCardProps {
  card: TarotCardData;
  isFaceUp: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  cardBack: CardBack;
  theme: Theme;
}

const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isFaceUp,
  isReversed = false,
  onClick,
  cardBack,
  theme,
}) => {
  const CardBackComponent = cardBack.component;
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      if (!isFaceUp || imageData || isLoading || error) return;

      setIsLoading(true);
      try {
        const { generateCardImage } = await import('../services/geminiService');
        const b64Data = await generateCardImage(card.generationPrompt);
        setImageData(`data:image/png;base64,${b64Data}`);
      } catch (generationError) {
        console.error('Failed to generate card image:', generationError);
        setError('Image generation failed.');
      } finally {
        setIsLoading(false);
      }
    };

    void generate();
  }, [card.generationPrompt, error, imageData, isFaceUp, isLoading]);

  return (
    <div className="group [perspective:1000px]">
      <div
        className={`relative h-64 w-44 cursor-pointer rounded-xl shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${isFaceUp ? '[transform:rotateY(180deg)]' : ''} group-hover:scale-105`}
        onClick={onClick}
      >
        <div
          className={`absolute h-full w-full rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${theme.classNames.cardBackground}`}
        >
          {imageData ? (
            <img
              src={imageData}
              alt={card.name}
              className={`h-full w-full rounded-xl object-cover ${isReversed ? 'rotate-180' : ''}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl text-center">
              {isLoading && (
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-pink-400" />
                  <span className={`mt-2 text-xs ${theme.classNames.textSecondary}`}>
                    Generating...
                  </span>
                </div>
              )}
              {error && <div className="p-2 text-sm text-red-400">{error}</div>}
            </div>
          )}
        </div>

        <div
          className={`absolute h-full w-full rounded-xl p-2 [backface-visibility:hidden] ${cardBack.bgClassName}`}
        >
          <CardBackComponent />
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
