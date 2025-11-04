import { style, globalStyle } from '@vanilla-extract/css';
import { config } from 'folds';

export const quickAction = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-2px',
      background:
        'linear-gradient(135deg, color-mix(in srgb, var(--bw-neon) 35%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 20%, transparent) 28%, color-mix(in srgb, var(--bw-primary) 5%, transparent) 70%)',
      mixBlendMode: 'screen',
      opacity: 0.4,
      transition: 'opacity 240ms ease, transform 320ms ease',
      willChange: 'opacity, transform',
      zIndex: 0,
    },
    '&::after': {
      content: '',
      position: 'absolute',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      height: '3px',
      background:
        'linear-gradient(90deg, color-mix(in srgb, var(--bw-neon) 85%, transparent) 0%, color-mix(in srgb, var(--bw-neon) 35%, transparent) 50%, color-mix(in srgb, var(--bw-neon) 85%, transparent) 100%)',
      filter: 'blur(0.5px)',
      opacity: 0.65,
      transition: 'opacity 220ms ease',
      zIndex: 0,
    },
    '&:hover::before, &:focus-within::before': {
      opacity: 0.75,
      transform: 'translateY(-2px)',
    },
    '&:hover::after, &:focus-within::after': {
      opacity: 1,
    },
  },
});

export const roomsHeader = style({
  paddingRight: config.space.S300,
});


globalStyle(`${quickAction} > *`, {
  position: 'relative',
  zIndex: 1,
});


globalStyle(`${quickAction} button`, {
  transition: 'transform 160ms ease, filter 160ms ease',
  filter: 'drop-shadow(0 0 0 rgba(0, 0, 0, 0))',
  willChange: 'transform, filter',
});

globalStyle(`${quickAction} button:hover`, {
  filter: 'drop-shadow(0 0 8px var(--bw-neon-strong))',
});

globalStyle(`${quickAction} button:focus-visible`, {
  filter: 'drop-shadow(0 0 10px var(--bw-neon-flare))',
});

globalStyle(`${quickAction} button:active`, {
  animation: 'bw-glitch 140ms steps(2, end) 1',
});
