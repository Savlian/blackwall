import { createContext, useContext, useMemo } from 'react';
import { onDarkFontWeight } from '../../config.css';
import { blackwallAccentThemes, BlackwallAccentKey } from '../../colors.css';
import { settingsAtom } from '../state/settings';
import { useSetting } from '../state/hooks/settings';

export enum ThemeKind {
  Dark = 'dark',
}

export type Theme = {
  id: string;
  kind: ThemeKind;
  classNames: string[];
  label: string;
  previewColor: string;
};

type AccentMeta = {
  key: BlackwallAccentKey;
  label: string;
  previewColor: string;
  accentClass: string;
};

const accentOrder: AccentMeta[] = [
  { key: 'red', label: 'Red', previewColor: '#FF1A1A', accentClass: 'blackwall-accent-red' },
  { key: 'green', label: 'Green', previewColor: '#5FE39F', accentClass: 'blackwall-accent-green' },
  { key: 'blue', label: 'Blue', previewColor: '#4E8CFF', accentClass: 'blackwall-accent-blue' },
  { key: 'purple', label: 'Purple', previewColor: '#B066FF', accentClass: 'blackwall-accent-purple' },
  { key: 'pink', label: 'Pink', previewColor: '#FF5DB1', accentClass: 'blackwall-accent-pink' },
];

const createThemeForAccent = ({ key, label, previewColor, accentClass }: AccentMeta): Theme => ({
  id: 'blackwall-' + key,
  kind: ThemeKind.Dark,
  classNames: ['blackwall-theme', accentClass, blackwallAccentThemes[key], onDarkFontWeight, 'prism-dark'],
  label,
  previewColor,
});

const themes = accentOrder.map(createThemeForAccent);
const themeById = new Map(themes.map((theme) => [theme.id, theme]));

export const BlackwallTheme = themes[0];

export const useThemes = (): Theme[] => themes;

export const useThemeNames = (): Record<string, string> =>
  useMemo(
    () => Object.fromEntries(themes.map((theme) => [theme.id, theme.label])),
    []
  );

export const useThemePreviews = (): Record<string, string> =>
  useMemo(
    () => Object.fromEntries(themes.map((theme) => [theme.id, theme.previewColor])),
    []
  );

export const useActiveTheme = (): Theme => {
  const [themeId] = useSetting(settingsAtom, 'themeId');
  return themeById.get(themeId ?? BlackwallTheme.id) ?? BlackwallTheme;
};

const ThemeContext = createContext<Theme | null>(null);
export const ThemeContextProvider = ThemeContext.Provider;

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('No theme provided!');
  }

  return theme;
};



