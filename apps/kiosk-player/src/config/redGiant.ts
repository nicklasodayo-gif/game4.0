import type { BrandConfig } from './types';

const redGiantConfig: BrandConfig = {
  client: 'Red Giant',
  clientSlug: 'redgiant',

  theme: {
    primary: '#FF6B35',
    primaryDark: '#D45A2A',
    secondary: '#1E1E2E',
    accent: '#FFD93D',
    background: '#0F0F1A',
    backgroundLight: '#2A2A3E',
    surface: '#363654',
    text: '#FFFFFF',
    textDark: '#1E1E2E',
    success: '#6BCB77',
    gold: '#FFD93D',
    error: '#FF6B6B',
    purple: '#6C5CE7',
  },

  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },

  logo: '/logos/red-giant-logo.svg',
  logoWhite: '/logos/red-giant-logo-white.svg',
  logoAlt: '/logos/red-giant-logo-alt.svg',

  game: {
    title: 'Red Giant Challenge',
    subtitle: 'Think Fast, Solve Fast',
    instruction: 'Slide tiles to complete the puzzle',
    instructionAlt: 'Beat the clock and win prizes!',
    prize: 'Win Exclusive Red Giant Merch!',
    prizeDetails: 'Complete the puzzle for your chance to win',
    howToPlay: 'Tap adjacent tiles to swap positions',
  },

  buttons: {
    play: 'START GAME',
    retry: 'PLAY AGAIN',
    claim: 'CLAIM PRIZE',
    continue: 'PLAY AGAIN',
    skip: 'Maybe Later',
    submit: 'ENTER COMPETITION',
  },

  attract: {
    title: 'TOUCH TO START',
    subtitle: 'Can you beat the clock?',
    instruction: 'Tap anywhere to begin',
    tagline: 'Think Big, Win Big',
  },

  win: {
    title: 'AMAZING!',
    subtitle: 'Puzzle Complete!',
    message: "You're now in the draw",
    perfectTime: 'Lightning fast! Under target!',
    messageAlt: 'Incredible speed!',
  },

  lead: {
    title: 'Enter to Win',
    subtitle: 'Complete your details below',
    consentText:
      'Your information will only be used for this competition. We respect your privacy and will not share your details.',
    namePlaceholder: 'Your Name',
    phonePlaceholder: 'Mobile Number',
    emailPlaceholder: 'Email (optional)',
    companyPlaceholder: 'Company (optional)',
    consentLabel: 'I accept the competition terms',
    successTitle: "You're In!",
    successMessage: 'Good luck! Check your phone for updates.',
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
    targetTime: 45,
    maxTime: 150,
    idleTimeout: 20,
    shuffleMoves: 40,
  },

  difficulty: {
    easy: { gridSize: 3, targetTime: 75 },
    normal: { gridSize: 3, targetTime: 45 },
    hard: { gridSize: 4, targetTime: 90 },
  },

  sounds: {
    enabled: true,
    volume: 0.6,
    move: '/sounds/tile-move.mp3',
    win: '/sounds/giants-win.mp3',
    click: '/sounds/click.mp3',
    attract: '/sounds/giants-attract.mp3',
    countdown: '/sounds/countdown.mp3',
  },

  visuals: {
    backgroundPattern: 'particles',
    particles: {
      enabled: true,
      colors: ['#FF6B35', '#FFD93D', '#6C5CE7', '#6BCB77'],
    },
    confettiColors: ['#FF6B35', '#FFD93D', '#6C5CE7', '#6BCB77', '#FFFFFF'],
    animations: {
      tileMove: 120,
      screenTransition: 250,
      attractFloat: 2500,
    },
  },

  touch: {
    scale: 0.97,
    opacity: 0.9,
    duration: 80,
  },

  social: {
    shareText: 'I just crushed the Red Giant Challenge! 🔥',
    shareUrl: 'https://redgiant.co.ke/challenge',
    hashtag: '#RedGiantChallenge',
  },
};

export { redGiantConfig };
export default redGiantConfig;
