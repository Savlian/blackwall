import { style } from '@vanilla-extract/css';
import { config, toRem } from 'folds';

export const RoomInputPlaceholder = style({
  minHeight: toRem(48),
  background: 'var(--bw-panel-bg)',
  color: 'var(--bw-text)',
  boxShadow: `inset 0 0 0 ${config.borderWidth.B300} var(--bw-primary-medium)`,
  borderRadius: config.radii.R400,
  position: 'relative',
  overflow: 'hidden',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-14% -28%',
      background: `radial-gradient(90% 120% at 18% 22%, var(--bw-neon-soft) 0%, transparent 60%),
        radial-gradient(120% 120% at 82% 78%, color-mix(in srgb, var(--bw-primary) 22%, transparent) 0%, transparent 65%)`,
      pointerEvents: 'none',
      opacity: 0.42,
      filter: 'blur(18px)',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(90deg, var(--bw-neon-soft) 0%, transparent 45%, transparent 55%, var(--bw-neon-soft) 100%)',
      opacity: 0.08,
    },
  },
});
