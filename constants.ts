import { Spread } from './types';

export const SPREADS: Spread[] = [
  {
    name: "Single Card Draw",
    cardCount: 1,
    positions: ["Guidance for the Day"],
    description: "A quick draw for a daily dose of insight and focus."
  },
  {
    name: "Past, Present, Future",
    cardCount: 3,
    positions: ["The Past", "The Present", "The Future"],
    description: "A classic spread to understand the flow of events in your life."
  },
  {
    name: "Mind, Body, Spirit",
    cardCount: 3,
    positions: ["Mind", "Body", "Spirit"],
    description: "A holistic look at your internal state and well-being."
  },
  {
    name: "Relationship Spread",
    cardCount: 5,
    positions: ["You", "The Other Person", "The Connection", "The Challenge", "The Potential"],
    description: "Explore the dynamics of a relationship and its potential future."
  },
  {
    name: "Career Path Spread",
    cardCount: 5,
    positions: ["Your Current Role", "Your Strengths", "Your Challenges", "Action to Take", "Long-Term Potential"],
    description: "Gain clarity on your professional life and next steps."
  },
  {
    name: "Celtic Cross",
    cardCount: 10,
    positions: [
        "1. The Heart of the Matter", 
        "2. The Obstacle", 
        "3. The Root Cause (Past)", 
        "4. The Recent Past", 
        "5. The Potential Outcome (Conscious)", 
        "6. The Near Future",
        "7. Your Attitude",
        "8. External Environment",
        "9. Hopes and Fears",
        "10. The Final Outcome"
    ],
    description: "A deep, comprehensive spread for exploring a situation from all angles."
  }
];