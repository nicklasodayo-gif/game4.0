import type { ReactNode } from 'react';
import { useIdleDetection } from '@red-giant/game-engine';
import config from '../config';

export interface IdleTimerProps {
  children: ReactNode;
  isActive?: boolean;
  onIdle: () => void;
  timeout?: number;
}

/** Wrapper component that fires `onIdle` after a period of no touch/mouse activity. */
export function IdleTimer({ children, isActive = true, onIdle, timeout = config.settings.idleTimeout * 1000 }: IdleTimerProps) {
  useIdleDetection({
    timeout,
    enabled: isActive,
    onIdle,
  });

  return <>{children}</>;
}

export default IdleTimer;
