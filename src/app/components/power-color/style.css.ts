import { style } from '@vanilla-extract/css';
import { color, config, toRem } from 'folds';

export const PowerColorBadge = style({
  display: 'inline-block',
  width: toRem(16),
  height: toRem(16),
  backgroundColor: color.Surface.OnContainer,
  borderRadius: config.radii.Pill,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
});
