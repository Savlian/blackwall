import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { Dialog } from 'folds';

import * as css from '../../styles/Modal.css';

type GlitchDialogProps = React.ComponentProps<typeof Dialog>;

export const GlitchDialog = forwardRef<HTMLElement, GlitchDialogProps>(
  ({ className, ...props }, ref) => (
    <Dialog {...props} ref={ref} className={classNames(css.GlitchedDialog, className)} />
  )
);

GlitchDialog.displayName = 'GlitchDialog';

