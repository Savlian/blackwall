import { style } from '@vanilla-extract/css';
import { color } from 'folds';

export const purpleGradientButton = style({
  background: 'linear-gradient(135deg, #6B46FF, #9D5EFF)',
  border: 'none',
  color: '#FFFFFF',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(107, 70, 255, 0.2)',
  
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    transition: 'left 0.5s ease',
  },
  
  ':hover': {
    background: 'linear-gradient(135deg, #5A3AE5, #8B4FE6)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(107, 70, 255, 0.4)',
  },
  
  ':hover::before': {
    left: '100%',
  },
  
  ':active': {
    transform: 'translateY(0)',
    background: 'linear-gradient(135deg, #4A2FD4, #7A40CC)',
  },
});

export const purpleGradientCard = style({
  background: 'linear-gradient(135deg, rgba(107, 70, 255, 0.1), rgba(157, 94, 255, 0.05))',
  border: '1px solid rgba(107, 70, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  
  ':hover': {
    background: 'linear-gradient(135deg, rgba(107, 70, 255, 0.15), rgba(157, 94, 255, 0.08))',
    border: '1px solid rgba(107, 70, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(107, 70, 255, 0.2)',
  },
});

export const purpleThemeColors = style({
  selectors: {
    '.purple-theme &': {
      '--accent-gradient': 'linear-gradient(135deg, #6B46FF, #9D5EFF)',
      '--accent-gradient-hover': 'linear-gradient(135deg, #5A3AE5, #8B4FE6)',
      '--accent-gradient-active': 'linear-gradient(135deg, #4A2FD4, #7A40CC)',
      '--surface-gradient': 'linear-gradient(135deg, rgba(107, 70, 255, 0.1), rgba(157, 94, 255, 0.05))',
      '--surface-gradient-hover': 'linear-gradient(135deg, rgba(107, 70, 255, 0.15), rgba(157, 94, 255, 0.08))',
      '--purple-glow': '0 10px 30px rgba(107, 70, 255, 0.2)',
      '--purple-glow-strong': '0 10px 30px rgba(107, 70, 255, 0.4)',
    },
  },
});