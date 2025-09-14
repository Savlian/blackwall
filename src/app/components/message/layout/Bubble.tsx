import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Box, as } from 'folds';
import * as css from './layout.css';

type BubbleLayoutProps = {
  self?: boolean;
  before?: ReactNode;
};

export const BubbleLayout = as<'div', BubbleLayoutProps>(
  ({ self, before, children, ...props }, ref) => (
    <Box direction={self ? 'RowReverse' : 'Row'} gap="300" {...props} ref={ref}>
      <Box className={css.BubbleBefore} shrink="No">
        {before}
      </Box>
      <Box
        className={classNames(
          css.BubbleContent,
          before ? css.BubbleContentArrow : undefined,
          before && self ? css.BubbleContentArrowRight : undefined,
          before && !self ? css.BubbleContentArrowLeft : undefined
        )}
        direction="Column"
      >
        {children}
      </Box>
    </Box>
  )
);
