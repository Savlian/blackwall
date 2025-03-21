import { createVar, style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { color, config, DefaultReset, toRem } from 'folds';

export const PowerColorBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: toRem(16),
  height: toRem(16),
  borderRadius: config.radii.Pill,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  position: 'relative',
});

export const PowerColorBadgeNone = style({
  borderColor: color.Secondary.Main,
  selectors: {
    '&::before': {
      content: '',
      display: 'inline-block',
      width: '100%',
      height: config.borderWidth.B300,
      backgroundColor: color.Critical.Main,

      position: 'absolute',
      transform: `rotateZ(-45deg)`,
    },
  },
});

const PowerIconSize = createVar();
export const PowerIcon = recipe({
  base: [
    DefaultReset,
    {
      display: 'inline-flex',
      height: PowerIconSize,
      minWidth: PowerIconSize,
      fontSize: PowerIconSize,
      lineHeight: PowerIconSize,
      borderRadius: config.radii.R300,
      cursor: 'default',
    },
  ],
  variants: {
    size: {
      '50': {
        vars: {
          [PowerIconSize]: config.size.X50,
        },
      },
      '100': {
        vars: {
          [PowerIconSize]: config.size.X100,
        },
      },
      '200': {
        vars: {
          [PowerIconSize]: config.size.X200,
        },
      },
      '300': {
        vars: {
          [PowerIconSize]: config.size.X300,
        },
      },
      '400': {
        vars: {
          [PowerIconSize]: config.size.X400,
        },
      },
      '500': {
        vars: {
          [PowerIconSize]: config.size.X500,
        },
      },
      '600': {
        vars: {
          [PowerIconSize]: config.size.X600,
        },
      },
    },
  },
  defaultVariants: {
    size: '400',
  },
});

export type PowerIconVariants = RecipeVariants<typeof PowerIcon>;
