import { style } from '@vanilla-extract/css';
import { toRem, color, config, DefaultReset } from 'folds';

export const Sidebar = style({
  width: toRem(54),
  backgroundColor: color.Surface.Container,
  color: color.Surface.OnContainer,
  position: 'relative',
});

export const SidebarContent = style({
  padding: `${config.space.S200} 0`,
});

export const SidebarStack = style({
  width: '100%',
  backgroundColor: color.Surface.Container,
});

export const SidebarDivider = style({
  width: toRem(18),
});

export const Preview = style({
  padding: config.space.S200,
  margin: config.space.S300,
  marginTop: 0,
  minHeight: toRem(40),

  borderRadius: config.radii.R400,
  backgroundColor: color.SurfaceVariant.Container,
  color: color.SurfaceVariant.OnContainer,
});

export const PreviewEmoji = style([
  DefaultReset,
  {
    width: toRem(32),
    height: toRem(32),
    fontSize: toRem(32),
    lineHeight: toRem(32),
  },
]);
export const PreviewImg = style([
  DefaultReset,
  {
    width: toRem(32),
    height: toRem(32),
    objectFit: 'contain',
  },
]);
