import { style } from '@vanilla-extract/css';
import { config } from 'folds';

export const CreateRoomModal = style({
  position: 'relative',
});

export const CreateRoomModalHeader = style({
  padding: config.space.S200,
  paddingLeft: config.space.S400,
  borderBottomWidth: config.borderWidth.B300,
});

export const CreateRoomModalContent = style({
  padding: config.space.S400,
  paddingRight: config.space.S200,
});
