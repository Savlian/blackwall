import { keyframes, style, globalStyle } from '@vanilla-extract/css';
import { config, toRem } from 'folds';

const neonMapShift = keyframes({
  '0%': { backgroundPosition: '0px 0px, 34px 26px, 0 0' },
  '50%': { backgroundPosition: '28px 18px, 60px 44px, 18px 12px' },
  '100%': { backgroundPosition: '56px 36px, 86px 62px, 36px 24px' },
});

export const MembersDrawer = style({
  width: toRem(266),
  position: 'relative',
  isolation: 'isolate',
  background: 'rgba(18, 0, 2, 0.82)',
  boxShadow: 'inset 0 0 0 1px rgba(255, 40, 40, 0.18)',
  overflow: 'hidden',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-18% -30%',
      backgroundImage:
        'linear-gradient(135deg, rgba(255, 22, 32, 0.18) 0%, rgba(26, 0, 0, 0.11) 45%, rgba(10, 0, 0, 0) 70%), linear-gradient(90deg, rgba(210, 0, 0, 0.14) 1px, transparent 1px), linear-gradient(0deg, rgba(255, 26, 26, 0.1) 1px, transparent 1px)',
      backgroundSize: '100% 100%, 44px 44px, 44px 44px',
      mixBlendMode: 'screen',
      opacity: 0.34,
      animationName: neonMapShift,
      animationDuration: '32s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(95% 130% at 50% 12%, rgba(255, 20, 20, 0.26) 0%, rgba(20, 0, 0, 0) 60%)',
      opacity: 0.26,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    },
  },
});

globalStyle(`${MembersDrawer} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const MembersDrawerHeader = style({
  flexShrink: 0,
  padding: `0 ${config.space.S200} 0 ${config.space.S300}`,
  borderBottomWidth: config.borderWidth.B300,
});

export const MemberDrawerContentBase = style({
  position: 'relative',
  overflow: 'hidden',
});

export const MemberDrawerContent = style({
  padding: `${config.space.S200} 0`,
});

const ScrollBtnAnime = keyframes({
  '0%': {
    transform: `translate(-50%, -100%) scale(0)`,
  },
  '100%': {
    transform: `translate(-50%, 0) scale(1)`,
  },
});

export const DrawerScrollTop = style({
  position: 'absolute',
  top: config.space.S200,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
  animation: `${ScrollBtnAnime} 100ms`,
});

export const DrawerGroup = style({
  paddingLeft: config.space.S200,
});

export const MembersGroup = style({
  paddingLeft: config.space.S200,
});
export const MembersGroupLabel = style({
  padding: config.space.S200,
  selectors: {
    '&:not(:first-child)': {
      paddingTop: config.space.S500,
    },
  },
});

export const DrawerVirtualItem = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
});
