import React, { forwardRef } from 'react';
import { Box, config, Menu, MenuItem, Scroll, Text, toRem } from 'folds';
import { getPowers, PowerLevelTags } from '../../hooks/usePowerLevelTags';
import { PowerColorBadge } from './PowerColorBadge';

type PowerSelectorProps = {
  powerLevelTags: PowerLevelTags;
  value: number;
  onChange: (value: number) => void;
};
export const PowerSelector = forwardRef<HTMLDivElement, PowerSelectorProps>(
  ({ powerLevelTags, value, onChange }, ref) => (
    <Menu
      ref={ref}
      style={{
        maxHeight: '75vh',
        maxWidth: toRem(300),
        display: 'flex',
      }}
    >
      <Box grow="Yes">
        <Scroll size="0" hideTrack visibility="Hover">
          <div style={{ padding: config.space.S100 }}>
            {getPowers(powerLevelTags).map((power) => {
              const selected = value === power;
              const tag = powerLevelTags[power];

              return (
                <MenuItem
                  key={power}
                  aria-pressed={selected}
                  radii="300"
                  onClick={selected ? undefined : () => onChange(power)}
                  before={<PowerColorBadge color={tag.color} />}
                  after={<Text size="L400">{power}</Text>}
                >
                  <Text style={{ flexGrow: 1 }} size="B400" truncate>
                    {tag.name}
                  </Text>
                </MenuItem>
              );
            })}
          </div>
        </Scroll>
      </Box>
    </Menu>
  )
);
