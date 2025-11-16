import React from 'react';
import { Spread, DrawnCard, Theme, CardBack } from '../types';
import TarotCard from './TarotCard';

interface SpreadLayoutProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  theme: Theme;
  cardBack: CardBack;
  isJournalView?: boolean;
}

const CardPosition: React.FC<{
  drawnCard: DrawnCard;
  position: string;
  theme: Theme;
  cardBack: CardBack;
  animationDelay?: string;
  isJournalView?: boolean;
  isRotated?: boolean;
}> = ({ drawnCard, position, theme, cardBack, animationDelay = '0ms', isJournalView = false, isRotated = false }) => {
  const { classNames: themeClasses } = theme;
  return (
    <div
      className={`flex flex-col items-center text-center ${!isJournalView ? 'opacity-0 animate-fade-in-up' : ''}`}
      style={{ animationDelay }}
    >
      <h4 className={`text-base font-semibold ${themeClasses.textAccent} mb-2 h-12 flex items-center text-center`}>{position}</h4>
      <div className={isRotated ? 'transform md:rotate-90' : ''}>
        <TarotCard card={drawnCard.card} isReversed={drawnCard.isReversed} isFaceUp={true} cardBack={cardBack} theme={theme} />
      </div>
      <p className={`text-lg font-bold mt-2 ${themeClasses.textPrimary}`}>{drawnCard.card.name}</p>
      <p className={`text-sm ${themeClasses.textSecondary}`}>{drawnCard.isReversed ? 'Reversed' : 'Upright'}</p>
    </div>
  );
};


const SpreadLayout: React.FC<SpreadLayoutProps> = ({ spread, drawnCards, theme, cardBack, isJournalView }) => {
  if (spread.name === 'Celtic Cross' && drawnCards.length === 10) {
    const cardElements = drawnCards.map((dc, i) => (
        <CardPosition
          key={i}
          drawnCard={dc}
          position={spread.positions[i]}
          theme={theme}
          cardBack={cardBack}
          animationDelay={`${i * 150}ms`}
          isJournalView={isJournalView}
        />
    ));
    // Special rotated card for position 2
    const rotatedCardElement = (
        <CardPosition
            key={1}
            drawnCard={drawnCards[1]}
            position={spread.positions[1]}
            theme={theme}
            cardBack={cardBack}
            animationDelay={`${1 * 150}ms`}
            isJournalView={isJournalView}
            isRotated={true}
        />
    )

    return (
      <>
        {/* Desktop Layout */}
        <div className="w-full max-w-5xl mx-auto hidden md:grid md:grid-cols-[1fr_1fr_1fr_0.7fr_1fr] md:grid-rows-4 gap-x-2 gap-y-4 items-center">
            {/* Card 5 - Above */}
            <div style={{ gridColumn: 2, gridRow: 1 }} className="flex justify-center">{cardElements[4]}</div>
            {/* Card 3 - Left */}
            <div style={{ gridColumn: 1, gridRow: '2 / span 2' }} className="flex justify-center items-center">{cardElements[2]}</div>
            {/* Card 1 & 2 - Center */}
            <div style={{ gridColumn: 2, gridRow: '2 / span 2' }} className="relative flex justify-center items-center">
                {cardElements[0]}
                <div className="absolute">{rotatedCardElement}</div>
            </div>
            {/* Card 4 - Right */}
            <div style={{ gridColumn: 3, gridRow: '2 / span 2' }} className="flex justify-center items-center">{cardElements[3]}</div>
            {/* Card 6 - Below */}
            <div style={{ gridColumn: 2, gridRow: 4 }} className="flex justify-center">{cardElements[5]}</div>
    
            {/* Staff - Cards 7, 8, 9, 10 */}
            <div style={{ gridColumn: 5, gridRow: 4 }} className="flex justify-center">{cardElements[6]}</div>
            <div style={{ gridColumn: 5, gridRow: 3 }} className="flex justify-center">{cardElements[7]}</div>
            <div style={{ gridColumn: 5, gridRow: 2 }} className="flex justify-center">{cardElements[8]}</div>
            <div style={{ gridColumn: 5, gridRow: 1 }} className="flex justify-center">{cardElements[9]}</div>
        </div>

        {/* Mobile Layout */}
        <div className="w-full flex flex-col items-center gap-8 md:hidden">
          {cardElements}
        </div>
      </>
    );
  }

  // Default layout for 1, 3, and 5 card spreads
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start justify-center gap-8">
      {drawnCards.map((drawnCard, index) => (
        <CardPosition
          key={index}
          drawnCard={drawnCard}
          position={spread.positions[index]}
          theme={theme}
          cardBack={cardBack}
          animationDelay={`${index * 200}ms`}
          isJournalView={isJournalView}
        />
      ))}
    </div>
  );
};

export default SpreadLayout;