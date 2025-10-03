import React, { ReactNode } from 'react';
import { Box } from 'folds';

import { BlackwallHUD } from '../../components/blackwall/BlackwallHUD';
import * as css from './ClientLayout.css';

type ClientLayoutProps = {
  nav: ReactNode;
  children: ReactNode;
};
export function ClientLayout({ nav, children }: ClientLayoutProps) {
  return (
    <>
      <BlackwallHUD />
      <Box grow="Yes" className={css.ClientShell}>
        <Box shrink="No" className={css.LayerContent}>
          {nav}
        </Box>
        <Box grow="Yes" className={css.MainViewport}>
          {children}
        </Box>
      </Box>
    </>
  );
}
