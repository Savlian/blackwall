import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { DefaultReset, color, config, toRem } from 'folds';

const neonMapShift = keyframes({
  '0%': { backgroundPosition: '0px 0px, 30px 22px, 0 0' },
  '50%': { backgroundPosition: '26px 18px, 54px 40px, 18px 12px' },
  '100%': { backgroundPosition: '52px 32px, 78px 58px, 36px 24px' },
});

export const PageNav = recipe({
  base: {
    position: 'relative',
    isolation: 'isolate',
    minHeight: '100%',
    background: 'rgba(18, 0, 2, 0.82)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 42, 42, 0.18)',
    overflow: 'hidden',
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: '-18% -30%',
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 22, 36, 0.18) 0%, rgba(36, 0, 2, 0.13) 45%, rgba(10, 0, 0, 0) 70%), linear-gradient(90deg, rgba(188, 0, 0, 0.16) 1px, transparent 1px), linear-gradient(0deg, rgba(255, 26, 26, 0.12) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 42px 42px, 42px 42px',
        mixBlendMode: 'screen',
        opacity: 0.36,
        pointerEvents: 'none',
        animationName: neonMapShift,
        animationDuration: '28s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      },
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(92% 120% at 50% 12%, rgba(255, 18, 34, 0.24) 0%, rgba(16, 0, 0, 0) 58%)',
        opacity: 0.26,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      },
    },
  },
  variants: {
    size: {
      '400': {
        width: toRem(256),
      },
      '300': {
        width: toRem(222),
      },
    },
  },
  defaultVariants: {
    size: '400',
  },
});
export type PageNavVariants = RecipeVariants<typeof PageNav>;

const pageNavBaseClass = PageNav({ size: '400' });
const pageNavSmallClass = PageNav({ size: '300' });

globalStyle(`${pageNavBaseClass}, ${pageNavSmallClass}`, {
  position: 'relative',
});

globalStyle(`${pageNavBaseClass} > *, ${pageNavSmallClass} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const PageNavHeader = recipe({
  base: {
    padding: `0 ${config.space.S200} 0 ${config.space.S300}`,
    flexShrink: 0,
    selectors: {
      'button&': {
        cursor: 'pointer',
      },
      'button&[aria-pressed=true]': {
        backgroundColor: color.Background.ContainerActive,
      },
      'button&:hover, button&:focus-visible': {
        backgroundColor: color.Background.ContainerHover,
      },
      'button&:active': {
        backgroundColor: color.Background.ContainerActive,
      },
    },
  },

  variants: {
    outlined: {
      true: {
        borderBottomWidth: 1,
      },
    },
  },
  defaultVariants: {
    outlined: true,
  },
});
export type PageNavHeaderVariants = RecipeVariants<typeof PageNavHeader>;

export const PageNavContent = style({
  minHeight: '100%',
  padding: config.space.S200,
  paddingRight: 0,
  paddingBottom: config.space.S700,
});

export const PageHeader = recipe({
  base: {
    paddingLeft: config.space.S400,
    paddingRight: config.space.S200,
  },
  variants: {
    balance: {
      true: {
        paddingLeft: config.space.S200,
      },
    },
    outlined: {
      true: {
        borderBottomWidth: config.borderWidth.B300,
      },
    },
  },
  defaultVariants: {
    outlined: true,
  },
});
export type PageHeaderVariants = RecipeVariants<typeof PageHeader>;

export const PageContent = style([
  DefaultReset,
  {
    paddingTop: config.space.S400,
    paddingLeft: config.space.S400,
    paddingRight: 0,
    paddingBottom: toRem(100),
  },
]);

export const PageHeroEmpty = style([
  DefaultReset,
  {
    padding: config.space.S400,
    borderRadius: config.radii.R400,
    minHeight: toRem(450),
  },
]);

export const PageHeroSection = style([
  DefaultReset,
  {
    padding: '40px 0',
    maxWidth: toRem(466),
    width: '100%',
    margin: 'auto',
  },
]);

export const PageContentCenter = style([
  DefaultReset,
  {
    maxWidth: toRem(964),
    width: '100%',
    margin: 'auto',
  },
]);
