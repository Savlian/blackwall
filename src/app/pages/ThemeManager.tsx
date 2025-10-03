import React, { ReactNode, useEffect } from 'react';
import { configClass, varsClass } from 'folds';
import {
  BlackwallTheme,
  ThemeContextProvider,
  useActiveTheme,
} from '../hooks/useTheme';

export function UnAuthRouteThemeManager() {
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(configClass, varsClass, ...BlackwallTheme.classNames);
  }, []);

  return null;
}

export function AuthRouteThemeManager({ children }: { children: ReactNode }) {
  const activeTheme = useActiveTheme();

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(configClass, varsClass);

    document.body.classList.add(...activeTheme.classNames);
  }, [activeTheme]);

  return <ThemeContextProvider value={activeTheme}>{children}</ThemeContextProvider>;
}
