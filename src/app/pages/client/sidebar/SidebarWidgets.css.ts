import { keyframes, style } from '@vanilla-extract/css';
import { color, config, toRem } from 'folds';

export const widgetCluster = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S200,
  padding: `${config.space.S200} 0`,
  marginTop: "auto",
});

const whisperSweep = keyframes({
  '0%': {
    transform: 'translateX(-40%)',
  },
  '50%': {
    transform: 'translateX(0)',
  },
  '100%': {
    transform: 'translateX(60%)',
  },
});

const whisperPulse = keyframes({
  '0%': { opacity: 0.25 },
  '50%': { opacity: 0.6 },
  '100%': { opacity: 0.25 },
});

const weatherFlow = keyframes({
  '0%': { backgroundPosition: '0% 0%, 0 0' },
  '50%': { backgroundPosition: '120% 60%, 40px 24px' },
  '100%': { backgroundPosition: '240% 120%, 0 0' },
});

export const whisperSection = style({
  position: 'relative',
  margin: 0,
  padding: `${config.space.S200} ${config.space.S300}`,
  borderRadius: config.radii.R500,
  background:
    'linear-gradient(135deg, rgba(255, 48, 84, 0.12) 0%, rgba(26, 0, 32, 0.48) 55%, rgba(8, 0, 12, 0.86) 100%)',
  border: `${config.borderWidth.B300} solid rgba(255, 48, 84, 0.28)`,
  boxShadow: '0 0 28px rgba(255, 40, 84, 0.2)',
  overflow: 'hidden',
});

export const whisperBackdrop = style({
  position: 'absolute',
  inset: '-55% -35% 5% -35%',
  background:
    'radial-gradient(50% 60% at 50% 50%, rgba(255, 38, 102, 0.24) 0%, rgba(12, 0, 18, 0.02) 70%)',
  filter: 'blur(28px)',
  pointerEvents: 'none',
  opacity: 0.6,
});

export const whisperHeader = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: config.space.S200,
  marginBottom: config.space.S150,
});

export const whisperGlyph = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: config.space.S050,
  letterSpacing: toRem(1),
  textTransform: 'uppercase',
});

export const whisperTicker = style({
  fontSize: toRem(10),
  letterSpacing: toRem(1.5),
  textTransform: 'uppercase',
  color: 'rgba(255, 186, 224, 0.66)',
});

export const whisperList = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S125,
});

export const whisperItem = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S050,
  padding: `${config.space.S125} ${config.space.S150} ${config.space.S150} ${config.space.S300}`,
  borderRadius: config.radii.R400,
  background:
    'linear-gradient(110deg, rgba(255, 70, 120, 0.18) 0%, rgba(24, 0, 32, 0.42) 100%)',
  border: `${config.borderWidth.B200} solid rgba(255, 58, 120, 0.22)`,
  boxShadow: '0 0 14px rgba(255, 48, 112, 0.18)',
  overflow: 'hidden',
  transition: 'transform 160ms ease, border-color 160ms ease',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      left: toRem(10),
      top: toRem(8),
      bottom: toRem(8),
      width: toRem(2),
      background:
        'linear-gradient(180deg, rgba(255, 128, 170, 0.85) 0%, rgba(255, 48, 84, 0.25) 60%, rgba(255, 200, 220, 0.05) 100%)',
      boxShadow: '0 0 8px rgba(255, 60, 124, 0.55)',
      animation: `${whisperPulse} 2.8s ease-in-out infinite`,
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(120deg, rgba(255, 120, 160, 0.16) 0%, rgba(10, 0, 12, 0) 60%)',
      opacity: 0,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      transition: 'opacity 180ms ease',
    },
    '&:hover::after': {
      opacity: 0.55,
    },
    '&:hover': {
      transform: 'translateX(2px)',
      borderColor: 'rgba(255, 128, 180, 0.35)',
    },
  },
});

export const whisperRoom = style({
  fontSize: toRem(13),
  letterSpacing: toRem(0.6),
  textTransform: 'uppercase',
});

export const whisperSnippet = style({
  fontSize: toRem(11),
  color: 'rgba(255, 202, 216, 0.72)',
});

export const whisperMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S125,
  color: 'rgba(255, 164, 200, 0.62)',
  fontSize: toRem(10),
  letterSpacing: toRem(1),
  textTransform: 'uppercase',
});

export const whisperSignal = style({
  display: 'inline-flex',
  gap: toRem(2),
  alignItems: 'flex-end',
});

const whisperSignalPulse = style({
  display: 'inline-block',
  width: toRem(2),
  background: 'rgba(255, 164, 200, 0.7)',
  animation: `${whisperPulse} 2s ease-in-out infinite`,
});

export const whisperSignalBarLow = style([
  whisperSignalPulse,
  { height: toRem(5), animationDelay: '0ms' },
]);

export const whisperSignalBarMid = style([
  whisperSignalPulse,
  { height: toRem(8), animationDelay: '120ms' },
]);

export const whisperSignalBarHigh = style([
  whisperSignalPulse,
  { height: toRem(11), animationDelay: '220ms' },
]);

export const whisperEmpty = style({
  padding: `${config.space.S125} ${config.space.S150}`,
  borderRadius: config.radii.R400,
  border: `${config.borderWidth.B200} dashed rgba(255, 76, 128, 0.3)`,
  color: 'rgba(255, 188, 220, 0.6)',
  fontSize: toRem(11),
  letterSpacing: toRem(1),
  textTransform: 'uppercase',
});

export const weatherPanel = style({
  position: 'relative',
  margin: 0,
  padding: `${config.space.S175} ${config.space.S250}`,
  borderRadius: config.radii.R500,
  background:
    'linear-gradient(160deg, rgba(12, 0, 24, 0.78) 0%, rgba(48, 0, 64, 0.58) 45%, rgba(10, 0, 18, 0.9) 100%)',
  border: `${config.borderWidth.B300} solid rgba(140, 60, 255, 0.28)`,
  boxShadow: '0 0 26px rgba(120, 60, 255, 0.18)',
  overflow: 'hidden',
});

export const weatherBackdrop = style({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(115deg, rgba(88, 0, 160, 0.35) 0%, rgba(16, 0, 40, 0.1) 60%, rgba(0, 0, 0, 0.45) 100%), repeating-linear-gradient(135deg, rgba(140, 60, 255, 0.28) 0 2px, transparent 2px 12px)',
  backgroundSize: '160% 160%, 280px 280px',
  mixBlendMode: 'screen',
  animation: `${weatherFlow} 18s linear infinite`,
  opacity: 0.55,
  pointerEvents: 'none',
});

export const weatherHeader = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: config.space.S200,
  marginBottom: config.space.S150,
});

export const weatherTitle = style({
  fontSize: toRem(11.5),
  textTransform: 'uppercase',
  letterSpacing: toRem(1.2),
});

export const weatherStatus = style({
  fontSize: toRem(10),
  textTransform: 'uppercase',
  letterSpacing: toRem(1.6),
  color: 'rgba(173, 204, 255, 0.7)',
});

export const weatherGrid = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: config.space.S150,
});

export const weatherMetric = style({
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S050,
  padding: `${config.space.S100} ${config.space.S125}`,
  borderRadius: config.radii.R300,
  background: 'linear-gradient(140deg, rgba(32, 0, 48, 0.65) 0%, rgba(6, 0, 18, 0.85) 90%)',
  border: `${config.borderWidth.B200} solid rgba(144, 96, 255, 0.32)`,
  boxShadow: '0 0 12px rgba(120, 60, 255, 0.2)',
});

export const metricLabel = style({
  fontSize: toRem(10),
  textTransform: 'uppercase',
  letterSpacing: toRem(1.2),
  color: 'rgba(180, 192, 255, 0.68)',
});

export const metricValue = style({
  fontSize: toRem(14),
  fontWeight: 600,
  letterSpacing: toRem(0.6),
  color: color.Primary.Main,
});

export const metricAccent = style({
  fontSize: toRem(10),
  letterSpacing: toRem(1.4),
  textTransform: 'uppercase',
  color: 'rgba(206, 212, 255, 0.52)',
});

