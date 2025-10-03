import { keyframes, style } from '@vanilla-extract/css';

export const ModalWide = style({
  minWidth: '85vw',
  minHeight: '90vh',
});

const glitchIn = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translate3d(0, 28px, 0) scaleY(0.94)',
    filter: 'blur(6px)',
  },
  '18%': {
    opacity: 1,
    transform: 'translate3d(-3px, -6px, 0) scaleY(1.02)',
    filter: 'blur(0px)',
  },
  '40%': {
    transform: 'translate3d(2px, 4px, 0)',
  },
  '62%': {
    transform: 'translate3d(-1px, -2px, 0)',
  },
  '100%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
});

const scanSweep = keyframes({
  '0%': {
    opacity: 0.35,
    transform: 'translateY(-120%)',
  },
  '70%': {
    opacity: 0.08,
  },
  '100%': {
    opacity: 0,
    transform: 'translateY(140%)',
  },
});

export const GlitchDialog = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  background: 'rgba(10, 0, 18, 0.94)',
  boxShadow: '0 32px 60px rgba(6, 0, 18, 0.6), 0 0 24px rgba(255, 48, 96, 0.4)',
  animation: `${glitchIn} 360ms cubic-bezier(0.19, 1, 0.22, 1)`,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-20% -15%',
      background:
        'linear-gradient(120deg, rgba(255, 60, 124, 0.2) 0%, rgba(10, 0, 18, 0) 70%)',
      opacity: 0.55,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      filter: 'blur(38px)',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '-60% -10%',
      background:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 65%, rgba(255, 255, 255, 0.35) 100%)',
      opacity: 0,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      animation: `${scanSweep} 1.6s cubic-bezier(0.37, 0, 0.63, 1)`,
      animationDelay: '120ms',
      animationIterationCount: 'infinite',
    },
  },
});
