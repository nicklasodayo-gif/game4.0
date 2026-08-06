import type { UITheme, UIFonts } from '@red-giant/ui';

export interface BrandConfig {
  client: string;
  clientSlug: string;
  theme: UITheme & { purple?: string };
  fonts: UIFonts;
  logo: string;
  logoWhite: string;
  logoAlt: string;
  game: {
    title: string;
    subtitle: string;
    instruction: string;
    instructionAlt?: string;
    prize: string;
    prizeDetails?: string;
    howToPlay?: string;
  };
  buttons: {
    play: string;
    retry: string;
    claim: string;
    continue: string;
    skip: string;
    submit: string;
  };
  attract: {
    title: string;
    subtitle: string;
    instruction: string;
    tagline: string;
  };
  win: {
    title: string;
    subtitle: string;
    message: string;
    perfectTime: string;
    messageAlt?: string;
  };
  lead: {
    title: string;
    subtitle: string;
    consentText: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    companyPlaceholder: string;
    consentLabel?: string;
    successTitle: string;
    successMessage: string;
  };
  labels: {
    moves: string;
    time: string;
    best?: string;
    target: string;
    score?: string;
  };
  settings: {
    gridSize: number;
    targetTime: number;
    maxTime: number;
    idleTimeout: number;
    shuffleMoves: number;
  };
  difficulty?: Record<'easy' | 'normal' | 'hard', { gridSize: number; targetTime: number }>;
  sounds: {
    enabled: boolean;
    volume: number;
    move: string;
    win: string;
    click: string;
    attract: string;
    countdown: string;
  };
  visuals: {
    backgroundPattern?: string;
    particles: { enabled: boolean; colors: string[] };
    confettiColors: string[];
    animations: { tileMove: number; screenTransition: number; attractFloat: number };
  };
  touch: { scale: number; opacity: number; duration: number };
  social?: { shareText: string; shareUrl: string; hashtag: string };
}

export type BrandId = 'cocacola' | 'redgiant' | 'demo';
