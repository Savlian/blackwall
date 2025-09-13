import { style } from '@vanilla-extract/css';
import { DefaultReset, color, config, toRem } from 'folds';

export const Base = style({
  maxWidth: toRem(432),
  width: `calc(100vw - 2 * ${config.space.S400})`,
  height: toRem(450),
  backgroundColor: color.Surface.Container,
  color: color.Surface.OnContainer,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  borderRadius: config.radii.R400,
  boxShadow: config.shadow.E200,
  overflow: 'hidden',
});

export const NativeEmojiSidebarStack = style({
  position: 'sticky',
  bottom: '-67%',
  zIndex: 1,
});

export const Header = style({
  padding: config.space.S300,
  paddingBottom: 0,
});

export const EmojiGroup = style({
  padding: `${config.space.S300} 0`,
});

export const EmojiGroupLabel = style({
  position: 'sticky',
  top: config.space.S200,
  zIndex: 1,

  margin: 'auto',
  padding: `${config.space.S100} ${config.space.S200}`,
  borderRadius: config.radii.Pill,
  backgroundColor: color.SurfaceVariant.Container,
  color: color.SurfaceVariant.OnContainer,
});

export const EmojiGroupContent = style([
  DefaultReset,
  {
    padding: `0 ${config.space.S200}`,
  },
]);
