import { keyframes, style, globalStyle } from '@vanilla-extract/css';

const latticeShift = keyframes({
  '0%': { backgroundPosition: '0px 0px, 18px 14px' },
  '50%': { backgroundPosition: '22px 18px, 40px 32px' },
  '100%': { backgroundPosition: '44px 36px, 62px 50px' },
});

const horizonSweep = keyframes({
  '0%': { transform: 'translateX(-48%) translateY(-6%) skewX(-12deg)' },
  '50%': { transform: 'translateX(-12%) translateY(4%) skewX(-9deg)' },
  '100%': { transform: 'translateX(42%) translateY(-6%) skewX(-12deg)' },
});

export const ClientShell = style({
  position: 'relative',
  minHeight: '100%',
  backgroundColor: '#040107',
  isolation: 'isolate',
  overflow: 'hidden',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage:
        'radial-gradient(circle, rgba(255, 36, 72, 0.16) 1px, transparent 1px), radial-gradient(circle, rgba(180, 18, 54, 0.08) 1px, transparent 1px)',
      backgroundSize: '28px 28px, 28px 28px',
      backgroundPosition: '0 0, 14px 14px',
      mixBlendMode: 'screen',
      opacity: 0.6,
      animationName: latticeShift,
      animationDuration: '28s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '-40% -55% -50% -55%',
      pointerEvents: 'none',
      background:
        'radial-gradient(120% 80% at 50% 45%, rgba(255, 30, 68, 0.24) 0%, rgba(20, 0, 24, 0) 74%)',
      mixBlendMode: 'screen',
      filter: 'blur(68px)',
      opacity: 0.32,
      animationName: horizonSweep,
      animationDuration: '34s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },
});

export const LayerContent = style({
  position: 'relative',
  zIndex: 1,
});

export const MainViewport = style([
  LayerContent,
  {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(4, 0, 10, 0.94)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 36, 72, 0.1)',
    backdropFilter: 'none',
  },
]);

globalStyle(`${MainViewport} > *`, {
  position: 'relative',
  zIndex: 2,
});

