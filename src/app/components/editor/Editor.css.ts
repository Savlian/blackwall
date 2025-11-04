import { keyframes, style } from '@vanilla-extract/css';
import { config, DefaultReset, toRem } from 'folds';

const signalSweep = keyframes({
  '0%': { transform: 'translateX(-120%) skewX(-18deg)', opacity: 0 },
  '40%': { opacity: 0.35 },
  '100%': { transform: 'translateX(160%) skewX(-18deg)', opacity: 0 },
});

export const Editor = style([
  DefaultReset,
  {
    position: 'relative',
    background: 'var(--bw-panel-bg)',
    color: 'var(--bw-text)',
    boxShadow: '0 0 0 1px var(--bw-primary-medium)',
    borderRadius: config.radii.R500,
    overflow: 'hidden',
    isolation: 'isolate',
    backdropFilter: 'blur(6px)',
    transition: 'box-shadow 220ms ease, background-color 220ms ease',
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: '-18% -40%',
        background: `radial-gradient(circle at 18% 18%, var(--bw-neon-soft) 0%, transparent 55%),
          radial-gradient(circle at 82% 78%, color-mix(in srgb, var(--bw-primary) 20%, transparent) 0%, transparent 52%)`,
        opacity: 0.6,
        pointerEvents: 'none',
        filter: 'blur(26px)',
      },
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--bw-neon-glow) 52%, rgba(255, 255, 255, 0) 100%)',
        opacity: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        filter: 'blur(6px)',
        animationName: signalSweep,
        animationDuration: '11s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      },
      '&:focus-within': {
        background: 'color-mix(in srgb, var(--bw-primary) 18%, rgb(0 0 0 / 94%))',
        boxShadow: '0 0 26px var(--bw-neon-strong)',
      },
      '&:focus-within::after': {
        opacity: 0.85,
      },
      '&:hover::after': {
        opacity: 0.4,
      },
    },
  },
]);

export const EditorOptions = style([
  DefaultReset,
  {
    padding: config.space.S200,
    background: 'color-mix(in srgb, var(--bw-primary) 12%, rgb(0 0 0 / 46%))',
  },
]);

export const EditorTextareaScroll = style({
  background: 'transparent',
});

export const EditorTextarea = style([
  DefaultReset,
  {
    flexGrow: 1,
    height: '100%',
    padding: `${toRem(13)} ${toRem(1)}`,
    selectors: {
      [`${EditorTextareaScroll}:first-child &`]: {
        paddingLeft: toRem(13),
      },
      [`${EditorTextareaScroll}:last-child &`]: {
        paddingRight: toRem(13),
      },
      '&:focus': {
        outline: 'none',
      },
    },
  },
]);

export const EditorPlaceholderContainer = style([
  DefaultReset,
  {
    opacity: config.opacity.Placeholder,
    pointerEvents: 'none',
    userSelect: 'none',
  },
]);

export const EditorPlaceholderTextVisual = style([
  DefaultReset,
  {
    display: 'block',
    paddingTop: toRem(13),
    paddingLeft: toRem(1),
  },
]);

export const EditorToolbarBase = style({
  padding: `0 ${config.borderWidth.B300}`,
});

export const EditorToolbar = style({
  padding: config.space.S100,
});

export const MarkdownBtnBox = style({
  paddingRight: config.space.S100,
});
