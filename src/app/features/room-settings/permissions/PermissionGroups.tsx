/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, Chip, Text } from 'folds';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';
import { IPowerLevels } from '../../../hooks/usePowerLevels';
import { usePermissionGroups } from './usePermissionItems';

type PermissionGroupsProps = {
  powerLevels: IPowerLevels;
};
export function PermissionGroups({ powerLevels }: PermissionGroupsProps) {
  console.log(powerLevels);
  const permissionGroups = usePermissionGroups();

  return permissionGroups.map((group, groupIndex) => (
    <Box key={groupIndex} direction="Column" gap="100">
      <Text size="L400">{group.name}</Text>
      {group.items.map((item, itemIndex) => (
        <SequenceCard
          key={itemIndex}
          variant="SurfaceVariant"
          className={SequenceCardStyle}
          direction="Column"
          gap="400"
        >
          <SettingTile
            title={item.name}
            description={item.description}
            after={
              <Chip variant="Secondary" fill="Soft" radii="300">
                <Text size="B300">Change</Text>
              </Chip>
            }
          />
        </SequenceCard>
      ))}
    </Box>
  ));
}
