import React from 'react';
import { as, Badge, color, Text } from 'folds';
import colorMXID from '../../../util/colorMXID';

export const ServerBadge = as<
  'div',
  {
    server: string;
    fill?: 'Solid' | 'None';
  }
>(({ as: AsServerBadge = 'div', fill, server, ...props }, ref) => (
  <Badge
    as={AsServerBadge}
    fill="Solid"
    radii="300"
    style={
      fill === 'None'
        ? {
            color: colorMXID(server),
            background: 'transparent',
          }
        : {
            background: colorMXID(server),
            color: color.Surface.Container,
          }
    }
    {...props}
    ref={ref}
  >
    <Text as="span" size="L400" truncate>
      {server}
    </Text>
  </Badge>
));
