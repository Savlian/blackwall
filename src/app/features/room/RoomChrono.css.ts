import { style } from '@vanilla-extract/css';

export const chrono = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '0.1rem',
  marginLeft: '1.2rem',
  marginRight: '1.2rem',
  padding: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  pointerEvents: 'none',
  fontFamily: "'Consolas', 'Fira Code', 'Courier New', monospace",
  color: 'color-mix(in srgb, var(--bw-neon) 18%, #ffffff)',
});

export const label = style({
  fontSize: '0.55rem',
  opacity: 0.65,
  letterSpacing: '0.26em',
  lineHeight: 1,
});

export const value = style({
  fontSize: '0.95rem',
  letterSpacing: '0.14em',
  color: 'color-mix(in srgb, var(--bw-neon) 10%, #ffffff)',
  textShadow: '0 0 10px var(--bw-neon-medium)',
  lineHeight: 1.05,
});

export const subValue = style({
  fontSize: '0.6rem',
  opacity: 0.78,
  letterSpacing: '0.22em',
  lineHeight: 1,
});
