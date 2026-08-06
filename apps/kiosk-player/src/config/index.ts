import cocacolaConfig from './cocaCola';
import redGiantConfig from './redGiant';
import demoConfig from './demoBrand';
import type { BrandConfig, BrandId } from './types';
import type { CSSProperties } from 'react';

export const configs: Record<BrandId, BrandConfig> = {
  cocacola: cocacolaConfig,
  redgiant: redGiantConfig,
  demo: demoConfig,
};

export const BRANDS: { id: BrandId; name: string }[] = [
  { id: 'cocacola', name: 'Coca-Cola' },
  { id: 'redgiant', name: 'Red Giant' },
  { id: 'demo', name: 'Demo Brand' },
];

export function getConfig(brand: string = 'redgiant'): BrandConfig {
  return configs[brand as BrandId] || redGiantConfig;
}

export default getConfig();

export function getCSSVariables(config: BrandConfig): CSSProperties {
  return {
    '--color-primary': config.theme.primary,
    '--color-primary-dark': config.theme.primaryDark,
    '--color-secondary': config.theme.secondary,
    '--color-accent': config.theme.accent,
    '--color-background': config.theme.background,
    '--color-background-light': config.theme.backgroundLight,
    '--color-surface': config.theme.surface,
    '--color-text': config.theme.text,
    '--color-text-dark': config.theme.textDark,
    '--color-success': config.theme.success,
    '--color-gold': config.theme.gold,
    '--color-error': config.theme.error,
  } as CSSProperties;
}

export function getDifficultySettings(config: BrandConfig, difficulty: 'easy' | 'normal' | 'hard' = 'normal') {
  const diff = config.difficulty?.[difficulty] ?? config.settings;
  return {
    gridSize: diff.gridSize ?? 3,
    targetTime: diff.targetTime ?? 60,
    maxTime: config.settings.maxTime ?? 180,
  };
}

export { cocacolaConfig, redGiantConfig, demoConfig };
export type { BrandConfig, BrandId };
