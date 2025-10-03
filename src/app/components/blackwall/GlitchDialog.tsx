import classNames from 'classnames';
import React from 'react';
import { Dialog } from 'folds';

import * as css from '../../styles/Modal.css';

type GlitchDialogProps = React.ComponentProps<typeof Dialog>;

export function GlitchDialog({ className, ...props }: GlitchDialogProps) {
  return <Dialog {...props} className={classNames(css.GlitchedDialog, className)} />;
}
