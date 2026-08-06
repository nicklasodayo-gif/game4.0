/**
 * Minimal theme contract shared across apps. Brand-specific config objects
 * (see apps/kiosk-player/src/config) satisfy this shape, so UI components in
 * this package stay decoupled from any one app's config module.
 */
export interface UITheme {
  primary: string;
  primaryDark?: string;
  secondary?: string;
  accent?: string;
  background: string;
  backgroundLight: string;
  surface: string;
  text: string;
  textDark?: string;
  success?: string;
  gold?: string;
  error?: string;
}

export interface UIFonts {
  display: string;
  body: string;
}

export interface ScoreEntry {
  id?: string | number;
  name?: string;
  time: number;
  moves: number;
}
