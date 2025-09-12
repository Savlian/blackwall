import { style } from '@vanilla-extract/css';
import { toRem, color, config } from 'folds';

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
