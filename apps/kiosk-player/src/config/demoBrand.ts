import type { BrandConfig } from './types';

const demoConfig: BrandConfig = {
  client: 'Demo Brand',
  clientSlug: 'demo',

  theme: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    secondary: '#FFFFFF',
    accent: '#10B981',
    background: '#0F172A',
    backgroundLight: '#1E293B',
    surface: '#334155',
    text: '#F8FAFC',
    textDark: '#0F172A',
    success: '#22C55E',
    gold: '#FBBF24',
    error: '#EF4444',
  },

  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },

  logo: '/logos/demo-logo.svg',
  logoWhite: '/logos/demo-logo-white.svg',
  logoAlt: '/logos/demo-logo-alt.svg',

  game: {
    title: 'Brand Puzzle Challenge',
    subtitle: 'Your Tagline Here',
    instruction: 'Tap tiles to slide them into order',
    instructionAlt: 'Complete before time runs out!',
    prize: 'Win Exciting Prizes!',
    prizeDetails: 'Complete the puzzle for your chance to win',
    howToPlay: 'Tap tiles to swap with empty space',
  },

  buttons: {
    play: 'PLAY',
    retry: 'RETRY',
    claim: 'CLAIM PRIZE',
    continue: 'CONTINUE',
    skip: 'Skip',
    submit: 'SUBMIT',
  },

  attract: {
    title: 'TAP TO PLAY',
    subtitle: 'Instructions here',
    instruction: 'Touch anywhere to start',
    tagline: 'Your Brand Tagline',
  },

  win: {
    title: 'CONGRATULATIONS!',
    subtitle: 'Puzzle Solved!',
    message: "You're entered to win",
    perfectTime: 'Amazing speed!',
    messageAlt: 'Well done!',
  },

  lead: {
    title: 'Enter Your Details',
    subtitle: 'to claim your prize',
    consentText: 'Your details will only be used for this competition.',
    namePlaceholder: 'Full Name',
    phonePlaceholder: 'Phone Number',
    emailPlaceholder: 'Email (optional)',
    companyPlaceholder: 'Company (optional)',
    consentLabel: 'I agree to the terms',
    successTitle: 'Entry Submitted!',
    successMessage: 'Good luck!',
  },

  labels: {
    moves: 'MOVES',
    time: 'TIME',
    best: 'BEST',
    target: 'TARGET',
    score: 'SCORE',
  },

  settings: {
    gridSize: 3,
    targetTime: 60,
    maxTime: 180,
    idleTimeout: 25,
    shuffleMoves: 50,
  },

  difficulty: {
    easy: { gridSize: 3, targetTime: 90 },
    normal: { gridSize: 3, targetTime: 60 },
    hard: { gridSize: 4, targetTime: 120 },
  },

  sounds: {
    enabled: true,
    volume: 0.6,
    move: '/sounds/tile-move.mp3',
    win: '/sounds/win.mp3',
    click: '/sounds/click.mp3',
    attract: '/sounds/attract.mp3',
    countdown: '/sounds/countdown.mp3',
  },

  visuals: {
    backgroundPattern: 'gradient',
    particles: {
      enabled: true,
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    },
    confettiColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#FFFFFF'],
    animations: {
      tileMove: 150,
      screenTransition: 300,
      attractFloat: 3000,
    },
  },

  touch: {
    scale: 0.95,
    opacity: 0.8,
    duration: 100,
  },

  social: {
    shareText: 'I just completed the puzzle challenge! 🎮',
    shareUrl: 'https://example.com/challenge',
    hashtag: '#PuzzleChallenge',
  },
};

export { demoConfig };
export default demoConfig;
