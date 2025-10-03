import { style } from '@vanilla-extract/css';

const baseShell = {
  bottom: '1.25rem',
  pointerEvents: 'none' as const,
  mixBlendMode: 'screen' as const,
  zIndex: 30,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.4rem',
  fontFamily: "'Consolas', 'Fira Code', 'Courier New', monospace",
  '@media': {
    '(max-width: 960px)': {
      display: 'none',
    },
  },
};

export const rightShell = style({
  ...baseShell,
  position: 'fixed',
  right: '3rem',
  alignItems: 'flex-end',
});

export const block = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  minWidth: '11rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  background: 'rgba(8, 0, 0, 0.68)',
  border: '1px solid rgba(255, 26, 26, 0.45)',
  borderRadius: '12px',
  padding: '0.45rem 0.9rem 0.4rem',
  boxShadow: '0 0 18px rgba(255, 26, 26, 0.45)',
  color: '#ffdede',
});

export const label = style({
  fontSize: '0.55rem',
  opacity: 0.65,
  letterSpacing: '0.26em',
});

export const value = style({
  fontSize: '0.9rem',
  letterSpacing: '0.12em',
  color: '#ffffff',
  textShadow: '0 0 10px rgba(255, 26, 26, 0.55)',
  lineHeight: 1.1,
});

export const subValue = style({
  fontSize: '0.58rem',
  opacity: 0.75,
  letterSpacing: '0.2em',
});

