import React, { ReactNode } from 'react';
import { Box, Scroll, Line, as, TooltipProvider, Tooltip, Text, IconButton } from 'folds';
import classNames from 'classnames';
import * as css from './styles.css';

export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <Box className={css.Sidebar} shrink="No">
      <Scroll size="0">
        <Box className={css.SidebarContent} direction="Column" alignItems="Center" gap="100">
          {children}
        </Box>
      </Scroll>
    </Box>
  );
}

export const SidebarStack = as<'div'>(({ className, children, ...props }, ref) => (
  <Box
    className={classNames(css.SidebarStack, className)}
    direction="Column"
    alignItems="Center"
    gap="100"
    {...props}
    ref={ref}
  >
    {children}
  </Box>
));
export function SidebarDivider() {
  return <Line className={css.SidebarDivider} size="300" variant="Surface" />;
}

export function SidebarBtn<T extends string>({
  active,
  label,
  id,
  onItemClick,
  children,
}: {
  active?: boolean;
  label: string;
  id: T;
  onItemClick: (id: T) => void;
  children: ReactNode;
}) {
  return (
    <TooltipProvider
      delay={500}
      position="Left"
      tooltip={
        <Tooltip id={`SidebarStackItem-${id}-label`}>
          <Text size="T300">{label}</Text>
        </Tooltip>
      }
    >
      {(ref) => (
        <IconButton
          aria-pressed={active}
          aria-labelledby={`SidebarStackItem-${id}-label`}
          ref={ref}
          onClick={() => onItemClick(id)}
          size="400"
          radii="300"
          variant="Surface"
        >
          {children}
        </IconButton>
      )}
    </TooltipProvider>
  );
}
