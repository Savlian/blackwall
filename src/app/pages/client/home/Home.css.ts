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
        'linear-gradient(135deg, rgba(255, 26, 26, 0.35) 0%, rgba(122, 0, 0, 0.2) 28%, rgba(8, 0, 0, 0.05) 70%)',
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
        'linear-gradient(90deg, rgba(255, 26, 26, 0.85) 0%, rgba(255, 120, 120, 0.35) 50%, rgba(255, 26, 26, 0.85) 100%)',
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
  filter: 'drop-shadow(0 0 0 rgba(255, 26, 26, 0))',
  willChange: 'transform, filter',
});

globalStyle(`${quickAction} button:hover`, {
  filter: 'drop-shadow(0 0 8px rgba(255, 26, 26, 0.6))',
});

globalStyle(`${quickAction} button:focus-visible`, {
  filter: 'drop-shadow(0 0 10px rgba(255, 26, 26, 0.75))',
});

globalStyle(`${quickAction} button:active`, {
  animation: 'bw-glitch 140ms steps(2, end) 1',
});
