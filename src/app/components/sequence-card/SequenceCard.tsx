import React, { ComponentProps } from 'react';
import { Box, as } from 'folds';
import classNames from 'classnames';
import { ContainerColor, ContainerColorVariants } from '../../styles/ContainerColor.css';
import * as css from './style.css';

export const SequenceCard = as<
  'div',
  ComponentProps<typeof Box> & ContainerColorVariants & css.SequenceCardVariants
>(
  (
    { as: AsSequenceCard = 'div', className, variant, firstChild, lastChild, outlined, ...props },
    ref
  ) => (
    <Box
      as={AsSequenceCard}
      className={classNames(css.SequenceCard({ outlined }), ContainerColor({ variant }), className)}
      data-first-child={firstChild}
      data-last-child={lastChild}
      {...props}
      ref={ref}
    />
  )
);
