
import React from 'react';
import { Theme, CardBack } from './types';

// --- THEME DEFINITIONS ---

export const THEMES: Theme[] = [
  {
    id: 'astral_void',
    name: 'Astral Void',
    previewClassName: 'bg-nebula',
    classNames: {
      background: 'bg-black',
      backgroundEffect: 'bg-nebula',
      textPrimary: 'text-indigo-100',
      textSecondary: 'text-indigo-300/70',
      textAccent: 'text-purple-400',
      cardBackground: 'bg-black/50 backdrop-blur-sm',
      cardBorder: 'border-purple-500/40',
      button: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-500',
    }
  },
  {
    id: 'moonlit_grove',
    name: 'Moonlit Grove',
    previewClassName: 'bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900',
    classNames: {
      background: 'bg-gray-900',
      backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] from-gray-900 to-cyan-950 bg-blend-multiply`,
      textPrimary: 'text-cyan-100',
      textSecondary: 'text-cyan-200/70',
      textAccent: 'text-cyan-400',
      cardBackground: 'bg-gray-800/60 backdrop-blur-sm',
      cardBorder: 'border-cyan-500/30',
      button: 'bg-cyan-700',
      buttonHover: 'hover:bg-cyan-600',
    }
  },
  {
    id: 'arcane_library',
    name: "Arcane Library",
    previewClassName: 'bg-gradient-to-br from-amber-900 via-yellow-950 to-stone-900',
    classNames: {
      background: 'bg-amber-950',
      backgroundEffect: 'bg-[url(https://www.transparenttextures.com/patterns/old-paper.png)] bg-stone-950',
      textPrimary: 'text-yellow-100',
      textSecondary: 'text-yellow-200/60',
      textAccent: 'text-yellow-400',
      cardBackground: 'bg-amber-900/40 backdrop-blur-sm',
      cardBorder: 'border-yellow-500/30',
      button: 'bg-yellow-700',
      buttonHover: 'hover:bg-yellow-600',
    }
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare',
    previewClassName: 'bg-gradient-to-br from-orange-700 via-red-800 to-yellow-700',
    classNames: {
        background: 'bg-slate-900',
        backgroundEffect: '[background:radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.5),rgba(255,255,255,0))]',
        textPrimary: 'text-orange-100',
        textSecondary: 'text-orange-200/70',
        textAccent: 'text-orange-400',
        cardBackground: 'bg-red-950/40 backdrop-blur-sm',
        cardBorder: 'border-orange-500/30',
        button: 'bg-orange-600',
        buttonHover: 'hover:bg-orange-500',
    }
  },
  {
    id: 'oceanic_depths',
    name: 'Oceanic Depths',
    previewClassName: 'bg-gradient-to-br from-blue-900 via-teal-900 to-indigo-950',
    classNames: {
        background: 'bg-blue-950',
        backgroundEffect: 'bg-[radial-gradient(60%_120%_at_50%_50%,hsla(210,40%,20%,1)_0%,hsla(210,40%,20%,0)_100%)] opacity-80',
        textPrimary: 'text-teal-100',
        textSecondary: 'text-teal-200/70',
        textAccent: 'text-teal-300',
        cardBackground: 'bg-blue-900/50 backdrop-blur-sm',
        cardBorder: 'border-teal-500/30',
        button: 'bg-teal-700',
        buttonHover: 'hover:bg-teal-600',
    }
  },
  {
    id: 'verdant_sanctuary',
    name: 'Verdant Sanctuary',
    previewClassName: 'bg-gradient-to-br from-green-900 via-lime-950 to-emerald-950',
    classNames: {
        background: 'bg-green-950',
        backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/forest.png')]`,
        textPrimary: 'text-lime-100',
        textSecondary: 'text-lime-200/70',
        textAccent: 'text-lime-400',
        cardBackground: 'bg-green-900/50 backdrop-blur-sm',
        cardBorder: 'border-lime-500/30',
        button: 'bg-lime-700',
        buttonHover: 'hover:bg-lime-600',
    }
  },
  {
    id: 'gilded_age',
    name: 'Gilded Age',
    previewClassName: 'bg-gradient-to-br from-gray-800 to-black',
    classNames: {
        background: 'bg-black',
        backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-70`,
        textPrimary: 'text-gray-200',
        textSecondary: 'text-gray-400',
        textAccent: 'text-amber-400',
        cardBackground: 'bg-gray-900/70 backdrop-blur-sm',
        cardBorder: 'border-amber-400/30',
        button: 'bg-amber-600',
        buttonHover: 'hover:bg-amber-500',
    }
  },
  {
    id: 'amethyst_haze',
    name: 'Amethyst Haze',
    previewClassName: 'bg-gradient-to-br from-purple-900 via-fuchsia-950 to-violet-900',
    classNames: {
        background: 'bg-purple-950',
        backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/stitched-wool.png')]`,
        textPrimary: 'text-fuchsia-100',
        textSecondary: 'text-fuchsia-200/70',
        textAccent: 'text-fuchsia-400',
        cardBackground: 'bg-purple-900/50 backdrop-blur-sm',
        cardBorder: 'border-fuchsia-500/30',
        button: 'bg-fuchsia-700',
        buttonHover: 'hover:bg-fuchsia-600',
    }
  },
  {
    id: 'starlit_night',
    name: 'Starlit Night',
    previewClassName: 'bg-black',
    classNames: {
        background: 'bg-black',
        backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]`,
        textPrimary: 'text-gray-200',
        textSecondary: 'text-gray-400',
        textAccent: 'text-blue-400',
        cardBackground: 'bg-gray-900/60 backdrop-blur-sm',
        cardBorder: 'border-blue-400/30',
        button: 'bg-blue-700',
        buttonHover: 'hover:bg-blue-600',
    }
  },
  {
    id: 'rose_petal',
    name: 'Rose Petal',
    previewClassName: 'bg-gradient-to-br from-rose-950 via-red-950 to-black',
    classNames: {
        background: 'bg-rose-950',
        backgroundEffect: `bg-[url('https://www.transparenttextures.com/patterns/congruent-outline.png')]`,
        textPrimary: 'text-rose-100',
        textSecondary: 'text-rose-200/70',
        textAccent: 'text-rose-300',
        cardBackground: 'bg-rose-900/50 backdrop-blur-sm',
        cardBorder: 'border-rose-400/30',
        button: 'bg-rose-700',
        buttonHover: 'hover:bg-rose-600',
    }
  }
];

// --- CARD BACK DEFINITIONS ---

// FIX: Convert card back components from JSX to React.createElement to resolve parsing errors in .ts file.
const RoyalMotif: React.FC = () => (
  React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
    React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', stroke: 'currentColor', strokeWidth: '1' }),
    React.createElement('rect', { x: '5', y: '5', width: '90', height: '140', rx: '2', stroke: 'currentColor', strokeWidth: '0.5' }),
    React.createElement('path', { d: 'M42 45 C 48 35, 52 35, 58 45 C 55 50, 50 55, 50 65 C 50 55, 45 50, 42 45 Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M42 105 C 48 115, 52 115, 58 105 C 55 100, 50 95, 50 85 C 50 95, 45 100, 42 105 Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M50 68 V 82', stroke: 'currentColor', strokeWidth: '1.5' }),
    React.createElement('path', { d: 'M45 75 H 55', stroke: 'currentColor', strokeWidth: '1.5' }),
    React.createElement('path', { d: 'M10 10 C 20 10, 10 20, 10 10 L 10 10', stroke: 'currentColor', strokeWidth: '1', fill: 'none', transform: 'translate(0,0) scale(1,1)' }),
    React.createElement('path', { d: 'M90 10 C 80 10, 90 20, 90 10 L 90 10', stroke: 'currentColor', strokeWidth: '1', fill: 'none', transform: 'translate(0,0) scale(1,1)' }),
    React.createElement('path', { d: 'M10 140 C 20 140, 10 130, 10 140 L 10 140', stroke: 'currentColor', strokeWidth: '1', fill: 'none', transform: 'translate(0,0) scale(1,1)' }),
    React.createElement('path', { d: 'M90 140 C 80 140, 90 130, 90 140 L 90 140', stroke: 'currentColor', strokeWidth: '1', fill: 'none', transform: 'translate(0,0) scale(1,1)' })
  )
);

const CelestialBalance: React.FC = () => (
  React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
    React.createElement('defs', null,
      React.createElement('path', { id: 'sun-ray', d: 'M -2 -20 L 2 -20 L 0 -2 Z' }),
      React.createElement('circle', { id: 'star', r: '1.5' })
    ),
    React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', stroke: 'currentColor', fill: 'none', strokeWidth: '1' }),
    React.createElement('g', { transform: 'translate(50 45)' },
      React.createElement('circle', { r: '20', fill: 'none', stroke: 'currentColor', strokeWidth: '1' }),
      React.createElement('path', { d: 'M 0 -20 A 20 20 0 0 1 0 20 Z' }),
      React.createElement('g', { transform: 'rotate(0)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(45)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(90)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(135)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(180)' },
        React.createElement('use', { href: '#sun-ray' })
      )
    ),
    React.createElement('g', { transform: 'translate(50 105) rotate(180)' },
      React.createElement('circle', { r: '20', fill: 'none', stroke: 'currentColor', strokeWidth: '1' }),
      React.createElement('path', { d: 'M 0 -20 A 20 20 0 0 1 0 20 Z' }),
      React.createElement('g', { transform: 'rotate(0)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(45)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(90)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(135)' },
        React.createElement('use', { href: '#sun-ray' })
      ),
      React.createElement('g', { transform: 'rotate(180)' },
        React.createElement('use', { href: '#sun-ray' })
      )
    ),
    React.createElement('use', { href: '#star', x: '20', y: '20' }),
    React.createElement('use', { href: '#star', x: '80', y: '20' }),
    React.createElement('use', { href: '#star', x: '20', y: '130' }),
    React.createElement('use', { href: '#star', x: '80', y: '130' }),
    React.createElement('use', { href: '#star', x: '50', y: '75' }),
    React.createElement('use', { href: '#star', x: '30', y: '75' }),
    React.createElement('use', { href: '#star', x: '70', y: '75' })
  )
);

const VerdantGrowth: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
      React.createElement('path', { d: 'M50 5 V 145', strokeWidth: '0.5' }),
      React.createElement('path', { d: 'M50 75 C 20 75, 20 40, 35 25', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 80 75, 80 40, 65 25', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 20 75, 20 110, 35 125', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 80 75, 80 110, 65 125', strokeWidth: '1.5' }),
      React.createElement('circle', { cx: '35', cy: '25', r: '5', fill: 'currentColor' }),
      React.createElement('circle', { cx: '65', cy: '25', r: '5', fill: 'currentColor' }),
      React.createElement('circle', { cx: '35', cy: '125', r: '5', fill: 'currentColor' }),
      React.createElement('circle', { cx: '65', cy: '125', r: '5', fill: 'currentColor' }),
      React.createElement('circle', { cx: '50', cy: '75', r: '8', fill: 'currentColor' })
    )
);

const CosmicYggdrasil: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
      React.createElement('path', { d: 'M50 20 V 130', strokeWidth: '2.5' }),
      React.createElement('path', { d: 'M50 75 C 30 70, 20 50, 30 30', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 70 70, 80 50, 70 30', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 30 80, 20 100, 30 120', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 75 C 70 80, 80 100, 70 120', strokeWidth: '1.5' }),
      React.createElement('path', { d: 'M50 50 C 40 50, 35 40, 40 30', strokeWidth: '1' }),
      React.createElement('path', { d: 'M50 50 C 60 50, 65 40, 60 30', strokeWidth: '1' }),
      React.createElement('path', { d: 'M50 100 C 40 100, 35 110, 40 120', strokeWidth: '1' }),
      React.createElement('path', { d: 'M50 100 C 60 100, 65 110, 60 120', strokeWidth: '1' }),
      React.createElement('circle', { cx: '50', cy: '75', r: '25', strokeWidth: '0.5' })
    )
);

const MetatronsMandala: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
      React.createElement('g', { transform: 'translate(50 75)' },
        React.createElement('circle', { cx: '0', cy: '0', r: '30', strokeWidth: '0.5' }),
        React.createElement('circle', { cx: '0', cy: '0', r: '15', strokeWidth: '0.5' }),
        React.createElement('path', { d: 'M0 -30 L 26 -15 L 26 15 L 0 30 L -26 15 L -26 -15 Z', strokeWidth: '1' }),
        React.createElement('path', { d: 'M0 -30 L 0 30 M-26 -15 L 26 15 M-26 15 L 26 -15', strokeWidth: '0.5' }),
        React.createElement('circle', { cx: '0', cy: '0', r: '3', fill: 'currentColor'})
      )
    )
);

const StellarPathways: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', stroke: 'currentColor', strokeWidth: '1', fill: 'none' }),
      React.createElement('circle', { cx: '50', cy: '75', r: '3' }),
      React.createElement('path', { d: 'M50 75 L 25 40 M50 75 L 75 40 M50 75 L 25 110 M50 75 L 75 110 M50 75 L 20 75 M50 75 L 80 75', stroke: 'currentColor', strokeWidth: '0.5', strokeDasharray: '2 2' }),
      React.createElement('circle', { cx: '25', cy: '40', r: '2' }),
      React.createElement('circle', { cx: '75', cy: '40', r: '2' }),
      React.createElement('circle', { cx: '25', cy: '110', r: '2' }),
      React.createElement('circle', { cx: '75', cy: '110', r: '2' }),
      React.createElement('circle', { cx: '20', cy: '75', r: '2' }),
      React.createElement('circle', { cx: '80', cy: '75', r: '2' })
    )
);

const MysticMaze: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
        React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
        React.createElement('path', { d: 'M20 20 H 80 V 130 H 20 V 20 Z', strokeWidth: '1.5'}),
        React.createElement('path', { d: 'M30 30 H 70 V 120 H 30 V 30 Z', strokeWidth: '1'}),
        React.createElement('path', { d: 'M40 40 H 60 V 110 H 40 V 40 Z', strokeWidth: '0.5'}),
        React.createElement('path', { d: 'M20 75 H 30 M70 75 H 80 M40 75 H 60 M50 20 V 40 M50 110 V 130 M50 60 V 90', strokeWidth: '1'})
    )
);

const CrystalLattice: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
      React.createElement('g', { strokeWidth: '0.75' },
        React.createElement('path', { d: 'M10 10 L50 40 L90 10' }),
        React.createElement('path', { d: 'M10 40 L50 70 L90 40' }),
        React.createElement('path', { d: 'M10 70 L50 100 L90 70' }),
        React.createElement('path', { d: 'M10 100 L50 130 L90 100' }),
        React.createElement('path', { d: 'M10 130 L50 160 L90 130' }),
        React.createElement('path', { d: 'M10 10 V 130' }),
        React.createElement('path', { d: 'M50 40 V 160' }),
        React.createElement('path', { d: 'M90 10 V 130' })
      )
    )
);

const EternalKnot: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
        React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1' }),
        React.createElement('path', { d: 'M30 45 a 15 15 0 1 1 0 60', strokeWidth: '2' }),
        React.createElement('path', { d: 'M70 45 a 15 15 0 1 0 0 60', strokeWidth: '2' }),
        React.createElement('path', { d: 'M30 45 H 70 M30 105 H 70', strokeWidth: '2' }),
        React.createElement('path', { d: 'M45 60 a 15 15 0 0 1 10 0 M45 90 a 15 15 0 0 0 10 0', strokeWidth: '2' }),
        React.createElement('rect', { x: '25', y: '40', width: '50', height: '70', rx: '20', strokeWidth: '0.5' })
    )
);

const GildedFrame: React.FC = () => (
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 100 150', fill: 'none', stroke: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' },
        React.createElement('rect', { x: '2', y: '2', width: '96', height: '146', rx: '4', strokeWidth: '1.5' }),
        React.createElement('path', { d: 'M15 15 C 20 10, 10 20, 15 15 L 25 15 C 20 10, 30 10, 25 15 L 15 25 C 10 20, 10 30, 15 25 Z', fill: 'currentColor' }),
        React.createElement('path', { d: 'M85 15 C 80 10, 90 20, 85 15 L 75 15 C 80 10, 70 10, 75 15 L 85 25 C 90 20, 90 30, 85 25 Z', fill: 'currentColor' }),
        React.createElement('path', { d: 'M15 135 C 20 140, 10 130, 15 135 L 25 135 C 20 140, 30 140, 25 135 L 15 125 C 10 130, 10 120, 15 125 Z', fill: 'currentColor' }),
        React.createElement('path', { d: 'M85 135 C 80 140, 90 130, 85 135 L 75 135 C 80 140, 70 140, 75 135 L 85 125 C 90 130, 90 120, 85 125 Z', fill: 'currentColor' })
    )
);

export const CARD_BACKS: CardBack[] = [
    { id: 'fleur_de_lis', name: 'Royal Motif', component: RoyalMotif, bgClassName: 'bg-indigo-900 text-indigo-300' },
    { id: 'sun_and_moon', name: 'Celestial Balance', component: CelestialBalance, bgClassName: 'bg-slate-800 text-slate-300' },
    { id: 'rose_vine', name: 'Verdant Growth', component: VerdantGrowth, bgClassName: 'bg-rose-950 text-rose-300' },
    { id: 'tree_of_life', name: 'Cosmic Yggdrasil', component: CosmicYggdrasil, bgClassName: 'bg-emerald-950 text-emerald-300' },
    { id: 'sacred_geometry', name: 'Metatron\'s Mandala', component: MetatronsMandala, bgClassName: 'bg-purple-950 text-purple-300' },
    { id: 'constellation_map', name: 'Stellar Pathways', component: StellarPathways, bgClassName: 'bg-gray-900 text-gray-300' },
    { id: 'labyrinth', name: 'Mystic Maze', component: MysticMaze, bgClassName: 'bg-amber-950 text-amber-300' },
    { id: 'diamond_pattern', name: 'Crystal Lattice', component: CrystalLattice, bgClassName: 'bg-cyan-950 text-cyan-300' },
    { id: 'celtic_knot', name: 'Eternal Knot', component: EternalKnot, bgClassName: 'bg-green-900 text-green-300' },
    { id: 'ornate_frame', name: 'Gilded Frame', component: GildedFrame, bgClassName: 'bg-stone-800 text-stone-300' },
];
