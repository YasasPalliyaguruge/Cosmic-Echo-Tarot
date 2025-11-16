
import React from 'react';

export interface TarotCardData {
  name: string;
  number: number;
  arcana: string;
  suit: string;
  generationPrompt: string;
  fortune_telling: string[];
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
}

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
}

export interface Spread {
  name: string;
  cardCount: number;
  positions: string[];
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Theme {
  id: string;
  name: string;
  previewClassName: string;
  classNames: {
    background: string;
    backgroundEffect: string;
    textPrimary: string;
    textSecondary: string;
    textAccent: string;
    cardBackground: string;
    cardBorder: string;
    button: string;
    buttonHover: string;
  };
}

export interface CardBack {
  id: string;
  name: string;
  component: React.FC;
  bgClassName: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  notes: string;
  spread: Spread;
  drawnCards: DrawnCard[];
  reading: string;
}
