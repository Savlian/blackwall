import { createTheme } from '@vanilla-extract/css';
import { color } from 'folds';

const blackwallPrimaryRed = {
  Main: '#7A0000',
  MainHover: '#8C0505',
  MainActive: '#9B0909',
  MainLine: '#FF1A1A',
  OnMain: '#FFFFFF',
  Container: 'rgba(122, 0, 0, 0.2)',
  ContainerHover: 'rgba(168, 0, 0, 0.24)',
  ContainerActive: 'rgba(255, 26, 26, 0.28)',
  ContainerLine: 'rgba(255, 80, 80, 0.45)',
  OnContainer: '#FFEAEA',
};

const blackwallBase = {
  Background: {
    Container: 'rgba(6, 6, 6, 0.96)',
    ContainerHover: 'rgba(10, 10, 10, 0.94)',
    ContainerActive: 'rgba(14, 14, 14, 0.92)',
    ContainerLine: 'rgba(255, 255, 255, 0.05)',
    OnContainer: '#F4F0F0',
  },
  Surface: {
    Container: 'rgba(10, 10, 10, 0.94)',
    ContainerHover: 'rgba(14, 14, 14, 0.92)',
    ContainerActive: 'rgba(18, 18, 18, 0.9)',
    ContainerLine: 'rgba(255, 255, 255, 0.05)',
    OnContainer: '#F6F1F1',
  },
  SurfaceVariant: {
    Container: 'rgba(12, 12, 12, 0.88)',
    ContainerHover: 'rgba(18, 18, 18, 0.86)',
    ContainerActive: 'rgba(22, 22, 22, 0.84)',
    ContainerLine: 'rgba(255, 255, 255, 0.06)',
    OnContainer: '#FBEEEE',
  },
  Primary: blackwallPrimaryRed,
  Secondary: {
    Main: 'rgba(255, 255, 255, 0.86)',
    MainHover: 'rgba(255, 255, 255, 0.9)',
    MainActive: '#FFFFFF',
    MainLine: 'rgba(255, 255, 255, 0.12)',
    OnMain: '#060606',
    Container: 'rgba(26, 26, 26, 0.92)',
    ContainerHover: 'rgba(36, 36, 36, 0.9)',
    ContainerActive: 'rgba(46, 46, 46, 0.88)',
    ContainerLine: 'rgba(255, 255, 255, 0.12)',
    OnContainer: '#FDF4F4',
  },
  Success: {
    Main: '#85E0BA',
    MainHover: '#70DBAF',
    MainActive: '#66D9A9',
    MainLine: '#5CD6A3',
    OnMain: '#0F3D2A',
    Container: '#175C3F',
    ContainerHover: '#1A6646',
    ContainerActive: '#1C704D',
    ContainerLine: '#1F7A54',
    OnContainer: '#CCF2E2',
  },
  Warning: {
    Main: '#E3BA91',
    MainHover: '#DFAF7E',
    MainActive: '#DDA975',
    MainLine: '#DAA36C',
    OnMain: '#3F2A15',
    Container: '#5E3F20',
    ContainerHover: '#694624',
    ContainerActive: '#734D27',
    ContainerLine: '#7D542B',
    OnContainer: '#F3E2D1',
  },
  Critical: {
    Main: '#E85C5C',
    MainHover: '#E04A4A',
    MainActive: '#D63F3F',
    MainLine: '#FF6F6F',
    OnMain: '#2C0909',
    Container: '#5A1A1A',
    ContainerHover: '#651F1F',
    ContainerActive: '#702424',
    ContainerLine: '#7A2828',
    OnContainer: '#FBD7D7',
  },
  Other: {
    FocusRing: 'rgba(255, 255, 255, 0.35)',
    Shadow: 'rgba(0, 0, 0, 0.85)',
    Overlay: 'rgba(0, 0, 0, 0.78)',
  },
};

type PrimaryPalette = typeof blackwallPrimaryRed;

const createAccentTheme = (primary: PrimaryPalette) =>
  createTheme(color, {
    ...blackwallBase,
    Primary: primary,
  });

const blackwallPrimaryPink: PrimaryPalette = {
  Main: '#C2187B',
  MainHover: '#D11F85',
  MainActive: '#DE2890',
  MainLine: '#FF5DB1',
  OnMain: '#FFFFFF',
  Container: 'rgba(194, 24, 123, 0.2)',
  ContainerHover: 'rgba(219, 39, 143, 0.24)',
  ContainerActive: 'rgba(255, 93, 177, 0.28)',
  ContainerLine: 'rgba(255, 153, 204, 0.45)',
  OnContainer: '#FFE4F2',
};

const blackwallPrimaryPurple: PrimaryPalette = {
  Main: '#6A0DAD',
  MainHover: '#7515BE',
  MainActive: '#801ED0',
  MainLine: '#B066FF',
  OnMain: '#FFFFFF',
  Container: 'rgba(106, 13, 173, 0.2)',
  ContainerHover: 'rgba(132, 38, 199, 0.24)',
  ContainerActive: 'rgba(176, 102, 255, 0.28)',
  ContainerLine: 'rgba(200, 140, 255, 0.45)',
  OnContainer: '#F1E6FF',
};

const blackwallPrimaryGreen: PrimaryPalette = {
  Main: '#0F9D58',
  MainHover: '#12AD61',
  MainActive: '#15BD6A',
  MainLine: '#5FE39F',
  OnMain: '#FFFFFF',
  Container: 'rgba(15, 157, 88, 0.2)',
  ContainerHover: 'rgba(28, 189, 108, 0.24)',
  ContainerActive: 'rgba(95, 227, 159, 0.28)',
  ContainerLine: 'rgba(128, 240, 186, 0.45)',
  OnContainer: '#DFF6EB',
};

const blackwallPrimaryBlue: PrimaryPalette = {
  Main: '#1555FF',
  MainHover: '#1E65FF',
  MainActive: '#2572FF',
  MainLine: '#4E8CFF',
  OnMain: '#FFFFFF',
  Container: 'rgba(21, 85, 255, 0.2)',
  ContainerHover: 'rgba(46, 106, 255, 0.24)',
  ContainerActive: 'rgba(78, 140, 255, 0.28)',
  ContainerLine: 'rgba(120, 168, 255, 0.45)',
  OnContainer: '#E2E9FF',
};

export const blackwallAccentThemes = {
  red: createAccentTheme(blackwallPrimaryRed),
  pink: createAccentTheme(blackwallPrimaryPink),
  purple: createAccentTheme(blackwallPrimaryPurple),
  green: createAccentTheme(blackwallPrimaryGreen),
  blue: createAccentTheme(blackwallPrimaryBlue),
} as const;

export type BlackwallAccentKey = keyof typeof blackwallAccentThemes;
