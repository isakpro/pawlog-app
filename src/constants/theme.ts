/**
 * Pawlog's colors, the same palette as the design tokens in the webapp.
 * The dark variant keeps the warm tones so the app feels the same in both modes.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2e2018',
    textSecondary: '#7a6a5d',
    background: '#fbf6f0',
    surface: '#ffffff',
    border: '#ecdfd2',
    accent: '#d9722f',
    accentSoft: '#fbe4d2',
    success: '#3f7d54',
    danger: '#b3261e',
    dangerSoft: '#fdecea',
  },
  dark: {
    text: '#f5ebe3',
    textSecondary: '#b8a697',
    background: '#1c1512',
    surface: '#2a211c',
    border: '#3d3029',
    accent: '#e8894a',
    accentSoft: '#4a2f1d',
    success: '#7fc496',
    danger: '#f2b8b5',
    dangerSoft: '#4a1f1c',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 600;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
} as const;
