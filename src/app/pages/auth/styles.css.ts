import { keyframes, style, globalStyle } from '@vanilla-extract/css';
import { DefaultReset, config, toRem } from 'folds';

const cardPulse = keyframes({
  '0%': { boxShadow: '0 0 18px rgba(255, 26, 26, 0.35)' },
  '50%': { boxShadow: '0 0 26px rgba(255, 26, 26, 0.45)' },
  '100%': { boxShadow: '0 0 18px rgba(255, 26, 26, 0.35)' },
});

const glowSweep = keyframes({
  '0%': { transform: 'translateX(-120%) skewX(-15deg)', opacity: 0 },
  '40%': { opacity: 0.55 },
  '100%': { transform: 'translateX(200%) skewX(-15deg)', opacity: 0 },
});

const dotDrift = keyframes({
  '0%': { backgroundPosition: '0px 0px, 10px 10px' },
  '50%': { backgroundPosition: '12px 8px, 22px 18px' },
  '100%': { backgroundPosition: '24px 0px, 34px 10px' },
});

const waveMotion = keyframes({
  '0%': { transform: 'translateX(-36%) translateY(0) skewX(-12deg)' },
  '50%': { transform: 'translateX(-8%) translateY(-6%) skewX(-8deg)' },
  '100%': { transform: 'translateX(38%) translateY(0) skewX(-12deg)' },
});

export const AuthLayout = style({
  minHeight: '100%',
  width: '100%',
  padding: `${config.space.S600} ${config.space.S400} ${config.space.S400}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S600,
  color: '#ffeaea',
  backgroundColor: '#050005',
  position: 'relative',
  isolation: 'isolate',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'radial-gradient(circle, rgba(255, 72, 72, 0.28) 1px, transparent 1px), radial-gradient(circle, rgba(255, 24, 24, 0.18) 1px, transparent 1px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      mixBlendMode: 'screen',
      opacity: 0.75,
      pointerEvents: 'none',
      animationName: dotDrift,
      animationDuration: '18s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '-25% -40% -35% -40%',
      background:
        'radial-gradient(120% 80% at 50% 40%, rgba(255, 32, 68, 0.26) 0%, rgba(255, 32, 68, 0) 74%)',
      mixBlendMode: 'screen',
      filter: 'blur(42px)',
      opacity: 0.6,
      pointerEvents: 'none',
      animationName: waveMotion,
      animationDuration: '13s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },
});

export const AuthCard = style({
  marginTop: '2vh',
  maxWidth: toRem(480),
  width: 'min(32rem, 100%)',
  background: 'rgba(8, 0, 0, 0.92)',
  backgroundImage:
    'linear-gradient(145deg, rgba(255, 26, 26, 0.18) 0%, rgba(10, 0, 0, 0.9) 55%, rgba(0, 0, 0, 0.96) 100%)',
  borderRadius: config.radii.R500,
  border: '1px solid rgba(255, 26, 26, 0.35)',
  boxShadow: '0 0 22px rgba(255, 26, 26, 0.35)',
  overflow: 'hidden',
  position: 'relative',
  animationName: cardPulse,
  animationDuration: '6s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderTop: '1px solid rgba(255, 90, 90, 0.6)',
      opacity: 0.4,
      pointerEvents: 'none',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-28%',
      width: '38%',
      background:
        'linear-gradient(90deg, rgba(255, 230, 230, 0) 0%, rgba(255, 230, 230, 0.35) 50%, rgba(255, 230, 230, 0) 100%)',
      filter: 'blur(12px)',
      opacity: 0,
      animationName: glowSweep,
      animationDuration: '8.2s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
});

export const AuthLogo = style([
  DefaultReset,
  {
    width: toRem(28),
    height: toRem(28),
    borderRadius: '50%',
    filter: 'drop-shadow(0 0 6px rgba(255, 26, 26, 0.55))',
  },
]);

export const AuthHeader = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `0 ${config.space.S400}`,
  borderBottom: '1px solid rgba(255, 26, 26, 0.32)',
  background: 'linear-gradient(90deg, rgba(255, 26, 26, 0.45) 0%, rgba(0, 0, 0, 0) 65%)',
  boxShadow: '0 0 12px rgba(255, 26, 26, 0.35)',
});

export const AuthCardContent = style({
  maxWidth: toRem(402),
  width: '100%',
  margin: 'auto',
  padding: config.space.S500,
  paddingTop: config.space.S700,
  paddingBottom: toRem(44),
  gap: config.space.S600,
});

export const AuthFooter = style({
  padding: config.space.S300,
  color: '#ffbdbd',
});


export const AuthField = style({
  position: 'relative',
  display: 'inline-flex',
  width: '100%',
  alignItems: 'center',
  borderRadius: '14px',
  background: 'rgba(10, 0, 12, 0.82)',
  overflow: 'hidden',
  isolation: 'isolate',
  backdropFilter: 'blur(10px)',
  transition: 'background-color 180ms ease, box-shadow 180ms ease',
  boxShadow: '0 0 0 1px rgba(255, 48, 78, 0.45)',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      boxShadow: '0 0 18px rgba(255, 42, 72, 0.24)',
      opacity: 0,
      transition: 'opacity 220ms ease',
      pointerEvents: 'none',
      zIndex: -1,
    },
    '&:focus-within': {
      background: 'rgba(12, 0, 14, 0.94)',
      boxShadow: '0 0 0 1px rgba(255, 96, 124, 0.82), 0 0 20px rgba(255, 72, 102, 0.28)',
    },
    '&:focus-within::before': {
      opacity: 1,
    },
  },
});


const buttonSelector = `${AuthCard} button` as const;

globalStyle(buttonSelector, {
  background: 'rgba(12, 0, 0, 0.78)',
  border: '1px solid rgba(255, 26, 26, 0.35)',
  color: '#ffeaea',
  borderRadius: '12px',
  transition: 'background-color 180ms ease, box-shadow 180ms ease, transform 120ms ease',
});

globalStyle(`${buttonSelector}:hover`, {
  background: 'rgba(24, 0, 0, 0.88)',
  boxShadow: '0 0 16px rgba(255, 26, 26, 0.4)',
});

globalStyle(`${buttonSelector}:focus-visible`, {
  outline: 'none',
  boxShadow: '0 0 18px rgba(255, 26, 26, 0.6)',
});

globalStyle(`${buttonSelector}:active`, {
  transform: 'translateY(1px)',
});

globalStyle(`${AuthCard} a`, {
  color: '#ff7070',
  textDecoration: 'none',
  transition: 'color 160ms ease',
});

globalStyle(`${AuthCard} a:hover`, {
  color: '#ff9a9a',
});

globalStyle(`${AuthCard} input, ${AuthCard} select`, {
  background: 'transparent',
  border: 'none',
  color: '#ffeaea',
  borderRadius: 0,
  outline: 'none',
  boxShadow: 'none',
  transition: 'color 160ms ease',
});

globalStyle(`${AuthCard} input:focus-visible, ${AuthCard} select:focus-visible`, {
  outline: 'none',
  boxShadow: 'none',
});

globalStyle(`${AuthField} input, ${AuthField} select`, {
  width: '100%',
  background: 'transparent',
  border: 'none',
  color: '#ffeaea',
  position: 'relative',
  zIndex: 1,
});

globalStyle(`${AuthField} button`, {
  position: 'relative',
  zIndex: 1,
});
