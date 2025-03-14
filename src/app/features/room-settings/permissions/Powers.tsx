import React from 'react';
import { Box, Button, Chip, Text } from 'folds';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { getPowers, usePowerLevelTags } from '../../../hooks/usePowerLevelTags';
import { SettingTile } from '../../../components/setting-tile';
import { IPowerLevels } from '../../../hooks/usePowerLevels';
import { useRoom } from '../../../hooks/useRoom';
import { PowerColorBadge } from '../../../components/power';

type PowersProps = {
  powerLevels: IPowerLevels;
  onEdit?: () => void;
  onView: (power: number) => void;
};
export function Powers({ powerLevels, onEdit, onView }: PowersProps) {
  const room = useRoom();
  const [powerLevelTags] = usePowerLevelTags(room, powerLevels);

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Powers</Text>
      <SequenceCard
        variant="SurfaceVariant"
        className={SequenceCardStyle}
        direction="Column"
        gap="400"
      >
        <SettingTile
          title="Power Levels"
          description="Manage and customize incremental power levels for users."
          after={
            onEdit && (
              <Box gap="200">
                <Button
                  variant="Secondary"
                  fill="Soft"
                  size="300"
                  radii="300"
                  outlined
                  onClick={onEdit}
                >
                  <Text size="B300">Edit</Text>
                </Button>
              </Box>
            )
          }
        />
        <SettingTile>
          <Text size="L400">Levels</Text>
          <Box gap="200" wrap="Wrap">
            {getPowers(powerLevelTags).map((power) => {
              const tag = powerLevelTags[power];

              return (
                <Chip
                  key={power}
                  onClick={() => onView(power)}
                  variant="Secondary"
                  radii="300"
                  before={<PowerColorBadge color={tag.color} />}
                  after={
                    <Text size="T200" priority="300">
                      ({power})
                    </Text>
                  }
                >
                  <Text size="T300" truncate>
                    <b>{tag.name}</b>
                  </Text>
                </Chip>
              );
            })}
          </Box>
        </SettingTile>
      </SequenceCard>
    </Box>
  );
}
