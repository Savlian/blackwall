import { style } from '@vanilla-extract/css';
import { DefaultReset, config } from 'folds';

export const EditorContent = style([
  DefaultReset,
  {
    padding: config.space.S400,
  },
]);

export const EditorTextArea = style({
  fontFamily: 'monospace',
});
