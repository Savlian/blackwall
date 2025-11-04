import { createVar, keyframes, style, globalStyle } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { color, config, DefaultReset, Disabled, FocusOutline, toRem } from 'folds';
import { ContainerColor } from '../../styles/ContainerColor.css';

const neonGridShift = keyframes({
  '0%': { backgroundPosition: '0px 0px, 28px 18px, 0px 0px' },
  '50%': { backgroundPosition: '26px 12px, 54px 34px, 18px 12px' },
  '100%': { backgroundPosition: '52px 24px, 80px 50px, 36px 24px' },
});

const avatarPulse = keyframes({
  '0%': { transform: 'scale(0.96)', opacity: 0.16 },
  '40%': { transform: 'scale(1.02)', opacity: 0.24 },
  '70%': { transform: 'scale(0.98)', opacity: 0.18 },
  '100%': { transform: 'scale(0.96)', opacity: 0.16 },
});

const glitchSweep = keyframes({
  '0%': { transform: 'translateY(-50%) translateX(-4px)', opacity: 0 },
  '30%': { opacity: 0.4 },
  '50%': { transform: 'translateY(-50%) translateX(4px)', opacity: 0.55 },
  '80%': { opacity: 0.2 },
  '100%': { transform: 'translateY(-50%) translateX(0)', opacity: 0 },
});

const circuitTrace = keyframes({
  '0%': { backgroundPosition: 'center, 0% 0%, 0 0, 0 0' },
  '50%': { backgroundPosition: 'center, 45% 55%, 18px 24px, -12px -18px' },
  '100%': { backgroundPosition: 'center, 90% 110%, 0 0, 0 0' },
});

const weatherPulse = keyframes({
  '0%': { transform: 'scale(1) rotate(0deg)', opacity: 0.4 },
  '50%': { transform: 'scale(1.06) rotate(3deg)', opacity: 0.62 },
  '100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.4 },
});

export const Sidebar = style([
  DefaultReset,
  {
    width: toRem(66),
    backgroundColor: 'var(--bw-panel-bg)',
    borderRight: `${config.borderWidth.B300} solid color-mix(in srgb, var(--bw-neon) 30%, transparent)`,

    display: 'flex',
    flexDirection: 'column',
    color: color.Background.OnContainer,
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    boxShadow: '0 0 22px color-mix(in srgb, var(--bw-neon) 18%, transparent)',
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: '-12% -40%',
        backgroundImage: [
          'linear-gradient(115deg, color-mix(in srgb, var(--bw-neon) 16%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 10%, transparent) 45%, transparent 70%)',
          'linear-gradient(90deg, color-mix(in srgb, var(--bw-primary-2) 14%, transparent) 1px, transparent 1px)',
          'linear-gradient(0deg, color-mix(in srgb, var(--bw-neon) 12%, transparent) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '100% 100%, 42px 42px, 42px 42px',
        mixBlendMode: 'screen',
        opacity: 0.35,
        animationName: neonGridShift,
        animationDuration: '32s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        pointerEvents: 'none',
        zIndex: -3,
      },
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        backgroundImage: [
          'radial-gradient(90% 120% at 50% 20%, color-mix(in srgb, var(--bw-neon) 24%, transparent) 0%, transparent 70%)',
          'linear-gradient(125deg, color-mix(in srgb, var(--bw-neon) 18%, transparent) 0%, transparent 60%)',
          'repeating-linear-gradient(90deg, color-mix(in srgb, var(--bw-neon) 22%, transparent) 0 1px, transparent 1px 8px)',
          'repeating-linear-gradient(0deg, color-mix(in srgb, var(--bw-neon) 16%, transparent) 0 1px, transparent 1px 12px)',
        ].join(', '),
        backgroundSize: '100% 100%, 180% 160%, 60px 60px, 110px 110px',
        backgroundPosition: 'center, 0 0, 0 0, 0 0',
        pointerEvents: 'none',
        opacity: 0.32,
        mixBlendMode: 'screen',
        animationName: circuitTrace,
        animationDuration: '28s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        zIndex: -2,
      },
    },
  },
]);

globalStyle(`${Sidebar} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const SidebarWeatherOverlay = style({
  position: 'absolute',
  inset: '-18% -30%',
  background: [
    'radial-gradient(80% 140% at 50% 10%, color-mix(in srgb, var(--bw-neon) 28%, transparent) 0%, transparent 70%)',
    'radial-gradient(60% 80% at 30% 120%, color-mix(in srgb, var(--bw-primary-2) 22%, transparent) 0%, transparent 65%)',
  ].join(', '),
  mixBlendMode: 'screen',
  filter: 'blur(32px)',
  opacity: 0.5,
  pointerEvents: 'none',
  animationName: weatherPulse,
  animationDuration: '24s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  zIndex: -1,
});

export const SidebarStack = style([
  DefaultReset,
  {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: config.space.S300,
    padding: `${config.space.S300} 0`,
  },
]);

const DropLineDist = createVar();
export const DropTarget = style({
  vars: {
    [DropLineDist]: toRem(-8),
  },

  selectors: {
    '&[data-inside-folder=true]': {
      vars: {
        [DropLineDist]: toRem(-6),
      },
    },
    '&[data-drop-child=true]': {
      outline: `${config.borderWidth.B700} solid ${color.Success.Main}`,
      borderRadius: config.radii.R400,
    },
    '&[data-drop-above=true]::after, &[data-drop-below=true]::after': {
      content: '',
      display: 'block',
      position: 'absolute',
      left: toRem(0),
      width: '100%',
      height: config.borderWidth.B700,
      backgroundColor: color.Success.Main,
    },
    '&[data-drop-above=true]::after': {
      top: DropLineDist,
    },
    '&[data-drop-below=true]::after': {
      bottom: DropLineDist,
    },
  },
});

const PUSH_X = 2;
export const SidebarItem = recipe({
  base: [
    DefaultReset,
    {
      minWidth: toRem(42),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'transform 200ms cubic-bezier(0, 0.8, 0.67, 0.97)',

      selectors: {
        '&:hover': {
          transform: `translateX(${toRem(PUSH_X)})`,
        },
        '&::before': {
          content: '',
          display: 'none',
          position: 'absolute',
          left: toRem(-11.5 - PUSH_X),
          width: toRem(3 + PUSH_X),
          height: toRem(16),
          borderRadius: `0 ${toRem(4)} ${toRem(4)} 0`,
          background: 'CurrentColor',
          transition: 'height 200ms linear',
        },
        '&::after': {
          content: '',
          position: 'absolute',
          left: toRem(-12),
          top: '50%',
          width: toRem(8),
          height: toRem(22),
          transform: 'translateY(-50%)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--bw-neon) 60%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 10%, transparent) 70%, color-mix(in srgb, var(--bw-neon) 45%, transparent) 100%)',
          filter: 'blur(1.2px)',
          opacity: 0,
          pointerEvents: 'none',
        },
        '&:hover::before': {
          display: 'block',
          width: toRem(3),
        },
        '&:hover::after, &[aria-pressed=true]::after': {
          opacity: 0.28,
          animation: `${glitchSweep} 520ms steps(2, end) infinite`,
        },
        '&[data-activity="true"]::after': {
          opacity: 0.2,
          animation: `${glitchSweep} 920ms steps(3, end) infinite`,
        },
        '&[data-alert="true"]::after': {
          opacity: 0.44,
          animation: `${glitchSweep} 420ms steps(2, end) infinite`,
        },
        '&[data-alert="true"]::before': {
          display: 'block',
          height: toRem(20),
        },
      },
    },
    Disabled,
    DropTarget,
  ],
  variants: {
    active: {
      true: {
        selectors: {
          '&::before': {
            display: 'block',
            height: toRem(24),
          },
          '&:hover::before': {
            width: toRem(3 + PUSH_X),
          },
        },
      },
    },
  },
});
export type SidebarItemVariants = RecipeVariants<typeof SidebarItem>;

export const SidebarItemBadge = recipe({
  base: [
    DefaultReset,
    {
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: 1,
      lineHeight: 0,
    },
  ],
  variants: {
    hasCount: {
      true: {
        top: toRem(-6),
        left: toRem(-6),
      },
      false: {
        top: toRem(-2),
        left: toRem(-2),
      },
    },
  },
  defaultVariants: {
    hasCount: false,
  },
});
export type SidebarItemBadgeVariants = RecipeVariants<typeof SidebarItemBadge>;

export const SidebarAvatar = recipe({
  base: [
    {
      position: 'relative',
      isolation: 'isolate',
      selectors: {
        'button&': {
          cursor: 'pointer',
        },
        '&::after': {
          content: '',
          position: 'absolute',
          inset: '-6px',
          borderRadius: 'inherit',
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--bw-neon) 26%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 4%, transparent) 70%)',
          filter: 'blur(6px)',
          opacity: 0.14,
          transition: 'opacity 220ms ease, transform 220ms ease',
          animation: `${avatarPulse} 6.4s ease-in-out infinite`,
          pointerEvents: 'none',
        },
        '&[aria-pressed=true]::after': {
          opacity: 0.26,
        },
        '&[data-activity="true"]::after': {
          opacity: 0.24,
          animationDuration: '4.4s',
        },
        '&[data-alert="true"]::after': {
          opacity: 0.38,
          animationDuration: '3.2s',
        },
      },
    },
  ],
  variants: {
    size: {
      '200': {
        width: toRem(16),
        height: toRem(16),
        fontSize: toRem(10),
        lineHeight: config.lineHeight.T200,
        letterSpacing: config.letterSpacing.T200,
      },
      '300': {
        width: toRem(34),
        height: toRem(34),
      },
      '400': {
        width: toRem(42),
        height: toRem(42),
      },
    },
    outlined: {
      true: {
        border: `${config.borderWidth.B300} solid ${color.Background.ContainerLine}`,
      },
    },
  },
  defaultVariants: {
    size: '400',
  },
});
export type SidebarAvatarVariants = RecipeVariants<typeof SidebarAvatar>;

const sidebarAvatarLarge = SidebarAvatar({ size: '400' });
const sidebarAvatarMedium = SidebarAvatar({ size: '300' });
const sidebarAvatarSmall = SidebarAvatar({ size: '200' });

globalStyle(`${sidebarAvatarLarge} > *, ${sidebarAvatarMedium} > *, ${sidebarAvatarSmall} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const SidebarFolder = recipe({
  base: [
    ContainerColor({ variant: 'Background' }),
    {
      padding: config.space.S100,
      width: toRem(42),
      minHeight: toRem(42),
      display: 'flex',
      flexWrap: 'wrap',
      outline: `${config.borderWidth.B300} solid ${color.Background.ContainerLine}`,
      position: 'relative',

      selectors: {
        'button&': {
          cursor: 'pointer',
        },
        '&::after': {
          content: '',
          position: 'absolute',
          inset: '-8px',
          borderRadius: 'inherit',
          background:
            'radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--bw-neon) 28%, transparent) 0%, color-mix(in srgb, var(--bw-primary) 8%, transparent) 70%)',
          filter: 'blur(8px)',
          opacity: 0,
          transition: 'opacity 220ms ease, transform 220ms ease',
          pointerEvents: 'none',
        },
        '&:hover::after, &:focus-visible::after': {
          opacity: 0.24,
        },
        '&[data-activity="true"]::after': {
          opacity: 0.2,
        },
        '&[data-alert="true"]::after': {
          opacity: 0.34,
        },
      },
    },
    FocusOutline,
    DropTarget,
  ],
  variants: {
    state: {
      Close: {
        gap: toRem(2),
        borderRadius: config.radii.R400,
      },
      Open: {
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'column',
        alignItems: 'center',
        gap: config.space.S200,
        borderRadius: config.radii.R500,
      },
    },
  },
  defaultVariants: {
    state: 'Close',
  },
});
export type SidebarFolderVariants = RecipeVariants<typeof SidebarFolder>;

export const SidebarFolderDropTarget = recipe({
  base: {
    width: '100%',
    height: toRem(8),
    position: 'absolute',
    left: 0,
  },
  variants: {
    position: {
      Top: {
        top: toRem(-4),
      },
      Bottom: {
        bottom: toRem(-4),
      },
    },
  },
});
export type SidebarFolderDropTargetVariants = RecipeVariants<typeof SidebarFolderDropTarget>;
