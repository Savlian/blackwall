import { keyframes, style } from '@vanilla-extract/css';
import { config } from 'folds';

const pulse = keyframes({
  '0%': {
    boxShadow: '0 0 12px var(--bw-neon-medium)',
    opacity: 0.9,
  },
  '45%': {
    boxShadow: '0 0 22px var(--bw-neon-strong)',
    opacity: 1,
  },
  '70%': {
    boxShadow: '0 0 16px var(--bw-neon-glow)',
    opacity: 0.92,
  },
  '100%': {
    boxShadow: '0 0 12px var(--bw-neon-medium)',
    opacity: 0.9,
  },
});

const sweep = keyframes({
  '0%': {
    transform: 'translateX(-120%) skewX(-12deg)',
    opacity: 0,
  },
  '35%': {
    opacity: 0.6,
  },
  '70%': {
    opacity: 0,
  },
  '100%': {
    transform: 'translateX(220%) skewX(-12deg)',
    opacity: 0,
  },
});

export const connecting = style({
  padding: `${config.space.S100} 0`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background:
    'linear-gradient(90deg, color-mix(in srgb, var(--bw-neon) 65%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 50%, transparent) 50%, color-mix(in srgb, var(--bw-neon) 65%, transparent) 100%)',
  color: 'color-mix(in srgb, var(--bw-neon) 16%, #ffffff)',
  textTransform: 'uppercase',
  letterSpacing: '0.26em',
  fontFamily: "'Consolas', 'Fira Code', 'Courier New', monospace",
  animationName: pulse,
  animationDuration: '2.8s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-40%',
      width: '35%',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
      filter: 'blur(4px)',
      animationName: sweep,
      animationDuration: '3.6s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      willChange: 'transform, opacity',
    },
  },
});

export const connectingLine = style({
  height: config.borderWidth.B300,
  background:
    'linear-gradient(90deg, color-mix(in srgb, var(--bw-neon) 85%, transparent) 0%, color-mix(in srgb, var(--bw-neon) 40%, transparent) 35%, color-mix(in srgb, var(--bw-neon) 85%, transparent) 100%)',
  boxShadow: '0 0 14px var(--bw-neon-glow)',
});

