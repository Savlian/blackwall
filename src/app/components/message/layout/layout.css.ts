import { createVar, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { DefaultReset, color, config, toRem } from 'folds';

export const StickySection = style({
  position: 'sticky',
  top: config.space.S100,
});

const SpacingVar = createVar();
const SpacingVariant = styleVariants({
  '0': {
    vars: {
      [SpacingVar]: config.space.S0,
    },
  },
  '100': {
    vars: {
      [SpacingVar]: config.space.S100,
    },
  },
  '200': {
    vars: {
      [SpacingVar]: config.space.S200,
    },
  },
  '300': {
    vars: {
      [SpacingVar]: config.space.S300,
    },
  },
  '400': {
    vars: {
      [SpacingVar]: config.space.S400,
    },
  },
  '500': {
    vars: {
      [SpacingVar]: config.space.S500,
    },
  },
});

const highlightAnime = keyframes({
  '0%': {
    backgroundColor: color.Primary.Container,
  },
  '25%': {
    backgroundColor: color.Primary.ContainerActive,
  },
  '50%': {
    backgroundColor: color.Primary.Container,
  },
  '75%': {
    backgroundColor: color.Primary.ContainerActive,
  },
  '100%': {
    backgroundColor: color.Primary.Container,
  },
});
const HighlightVariant = styleVariants({
  true: {
    animation: `${highlightAnime} 2000ms ease-in-out`,
    animationIterationCount: 'infinite',
  },
});

const SelectedVariant = styleVariants({
  true: {
    backgroundColor: 'rgba(20, 0, 28, 0.62)',
    boxShadow: '0 0 32px rgba(255, 60, 110, 0.35)',
    selectors: {
      '&::before': {
        opacity: 0.85,
      },
      '&::after': {
        opacity: 0.42,
      },
    },
  },
});

const AutoCollapse = style({
  selectors: {
    [`&+&`]: {
      marginTop: 0,
    },
  },
});

export const MessageBase = recipe({
  base: [
    DefaultReset,
    {
      position: 'relative',
      zIndex: 0,
      marginTop: SpacingVar,
      padding: `${config.space.S100} ${config.space.S200} ${config.space.S100} ${config.space.S400}`,
      borderRadius: `0 ${config.radii.R400} ${config.radii.R400} 0`,
      overflow: 'hidden',
      transition: 'background-color 180ms ease, box-shadow 180ms ease',
      selectors: {
        '&::before': {
          content: '',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid rgba(255, 58, 94, 0.22)',
          opacity: 0,
          transition: 'opacity 220ms ease',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '',
          position: 'absolute',
          inset: '-40% -120%',
          background:
            'radial-gradient(40% 55% at 20% 50%, rgba(255, 32, 74, 0.28) 0%, rgba(12, 0, 18, 0) 90%), radial-gradient(50% 60% at 80% 50%, rgba(255, 24, 66, 0.2) 0%, rgba(12, 0, 18, 0) 90%)',
          filter: 'blur(42px)',
          opacity: 0,
          transition: 'opacity 320ms ease',
          pointerEvents: 'none',
        },
        '&:hover': {
          background: 'rgba(14, 0, 24, 0.46)',
          boxShadow: '0 0 24px rgba(255, 38, 86, 0.18)',
        },
        '&:hover::before': {
          opacity: 0.65,
        },
        '&:hover::after': {
          opacity: 0.28,
        },
        '&:focus-within': {
          background: 'rgba(18, 0, 28, 0.58)',
          boxShadow: '0 0 28px rgba(255, 58, 104, 0.32)',
        },
        '&:focus-within::before': {
          opacity: 0.85,
        },
        '&:focus-within::after': {
          opacity: 0.4,
        },
      },
    },
  ],
  variants: {
    space: SpacingVariant,
    collapse: {
      true: {
        marginTop: 0,
      },
    },
    autoCollapse: {
      true: AutoCollapse,
    },
    highlight: HighlightVariant,
    selected: SelectedVariant,
  },
  defaultVariants: {
    space: '400',
  },
});

export type MessageBaseVariants = RecipeVariants<typeof MessageBase>;

export const CompactHeader = style([
  DefaultReset,
  StickySection,
  {
    maxWidth: toRem(170),
    width: '100%',
  },
]);

export const AvatarBase = style({
  paddingTop: toRem(4),
  transition: 'transform 200ms cubic-bezier(0, 0.8, 0.67, 0.97)',
  alignSelf: 'start',

  selectors: {
    '&:hover': {
      transform: `translateY(${toRem(-2)})`,
    },
  },
});

export const ModernBefore = style({
  minWidth: toRem(36),
});

export const BubbleBefore = style([ModernBefore]);

export const BubbleContent = style({
  maxWidth: toRem(800),
  padding: config.space.S200,
  backgroundColor: color.SurfaceVariant.Container,
  color: color.SurfaceVariant.OnContainer,
  borderRadius: config.radii.R400,
});

export const Username = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  selectors: {
    'button&': {
      cursor: 'pointer',
    },
    'button&:hover, button&:focus-visible': {
      textDecoration: 'underline',
    },
  },
});

export const UsernameBold = style({
  fontWeight: 550,
});

export const MessageTextBody = recipe({
  base: {
    wordBreak: 'break-word',
  },
  variants: {
    preWrap: {
      true: {
        whiteSpace: 'pre-wrap',
      },
    },
    jumboEmoji: {
      true: {
        fontSize: '1.504em',
        lineHeight: '1.4962em',
      },
    },
    emote: {
      true: {
        color: color.Success.Main,
        fontStyle: 'italic',
      },
    },
  },
});

export type MessageTextBodyVariants = RecipeVariants<typeof MessageTextBody>;
