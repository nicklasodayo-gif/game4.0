// Kiosk-specific game components
export { Tile } from './Tile';
export { PuzzleBoard } from './PuzzleBoard';

// Kiosk-specific screens
export { AttractMode } from './AttractMode';
export { WinScreen } from './WinScreen';
export { LeadCapture } from './LeadCapture';
export type { LeadSubmitData } from './LeadCapture';
export { GameTimer } from './GameTimer';
export { IdleTimer } from './IdleTimer';
export { ResetManager, useGameReset } from './ResetManager';

// Shared UI components (re-exported from @red-giant/ui so existing
// `from './components'` imports across the app keep working unchanged)
export {
  LoadingScreen,
  GameHeader,
  GameFooter,
  MoveCounter,
  Leaderboard,
  SoundController,
  FullscreenButton,
  ConfettiEffect,
  ContinuousConfetti,
} from '@red-giant/ui';
