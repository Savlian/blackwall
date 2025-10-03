import classNames from 'classnames';
import { as } from 'folds';
import React from 'react';
import * as css from './Sidebar.css';

export const Sidebar = as<'div'>(({ as: AsSidebar = 'div', className, children, ...props }, ref) => (
  <AsSidebar className={classNames(css.Sidebar, className)} {...props} ref={ref}>
    <div className={css.SidebarWeatherOverlay} aria-hidden />
    {children}
  </AsSidebar>
));
