import React, { useMemo, useState } from 'react';
import { Box, Text, Chip, Icon, Icons, IconButton, Scroll, Button, toRem, Input } from 'folds';
import { HexColorPicker } from 'react-colorful';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { IPowerLevels } from '../../../hooks/usePowerLevels';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';
import {
  getPowers,
  getUsedPowers,
  PowerLevelTag,
  usePowerLevelTags,
} from '../../../hooks/usePowerLevelTags';
import { useRoom } from '../../../hooks/useRoom';
import { HexColorPickerPopOut } from '../../../components/HexColorPickerPopOut';
import { PowerColorBadge } from '../../../components/power-color';

type EditPowerProps = {
  maxPower: number;
  tag?: PowerLevelTag;
  // onSave: (tag: PowerLevelTag) => void;
  // onCancel: () => void;
};
function EditPower({ maxPower, tag }: EditPowerProps) {
  const [tagColor, setTagColor] = useState<string>();

  return (
    <Box direction="Column" gap="400">
      <Box direction="Column" gap="300">
        <Box gap="200">
          <Box shrink="No" direction="Column" gap="100">
            <Text size="L400">Color</Text>
            <Box gap="200">
              <HexColorPickerPopOut
                picker={<HexColorPicker color={tagColor ?? tag?.color} onChange={setTagColor} />}
                onRemove={() => setTagColor(undefined)}
              >
                {(openPicker, opened) => (
                  <Button
                    aria-pressed={opened}
                    onClick={openPicker}
                    size="300"
                    variant="Secondary"
                    fill="Soft"
                    radii="300"
                    outlined
                    before={<PowerColorBadge color={tagColor ?? tag?.color} />}
                  >
                    <Text size="B300">Pick</Text>
                  </Button>
                )}
              </HexColorPickerPopOut>
            </Box>
          </Box>
          <Box grow="Yes" direction="Column" gap="100">
            <Text size="L400">Name</Text>
            <Input defaultValue={tag?.name} size="300" variant="Secondary" outlined radii="300" />
          </Box>
          <Box grow="Yes" style={{ maxWidth: toRem(100) }} direction="Column" gap="100">
            <Text size="L400">Power</Text>
            <Input
              max={maxPower}
              type="number"
              size="300"
              variant="Secondary"
              outlined
              radii="300"
            />
          </Box>
        </Box>
      </Box>
      <Box gap="200" justifyContent="End">
        <Button size="300" variant="Success" radii="300">
          <Text size="B300">Save</Text>
        </Button>
        <Button size="300" variant="Secondary" fill="Soft" radii="300">
          <Text size="B300">Cancel</Text>
        </Button>
      </Box>
    </Box>
  );
}

type PowersEditorProps = {
  powerLevels: IPowerLevels;
  requestClose: () => void;
};
export function PowersEditor({ powerLevels, requestClose }: PowersEditorProps) {
  const room = useRoom();
  const [usedPowers, maxPower] = useMemo(() => {
    const up = getUsedPowers(powerLevels);
    return [up, Math.max(...Array.from(up))];
  }, [powerLevels]);

  const [powerLevelTags] = usePowerLevelTags(room, powerLevels);

  return (
    <Page>
      <PageHeader outlined={false} balance>
        <Box alignItems="Center" grow="Yes" gap="200">
          <Box alignItems="Inherit" grow="Yes" gap="200">
            <Chip
              size="500"
              radii="Pill"
              onClick={requestClose}
              before={<Icon size="100" src={Icons.ArrowLeft} />}
            >
              <Text size="T300">Permissions</Text>
            </Chip>
          </Box>
          <Box shrink="No">
            <IconButton onClick={requestClose} variant="Surface">
              <Icon src={Icons.Cross} />
            </IconButton>
          </Box>
        </Box>
      </PageHeader>
      <Box grow="Yes">
        <Scroll hideTrack visibility="Hover">
          <PageContent>
            <Box direction="Column" gap="700">
              <Box direction="Column" gap="100">
                <Text size="L400">Powers Editor</Text>
                <SequenceCard
                  variant="SurfaceVariant"
                  className={SequenceCardStyle}
                  direction="Column"
                  gap="400"
                >
                  <SettingTile
                    title="New Power Level"
                    description="Create a new power level."
                    after={
                      <Box gap="200">
                        <Button variant="Secondary" fill="Soft" size="300" radii="300" outlined>
                          <Text size="B300">Create</Text>
                        </Button>
                      </Box>
                    }
                  />
                  <EditPower maxPower={maxPower} />
                </SequenceCard>
                {getPowers(powerLevelTags).map((power) => {
                  const tag = powerLevelTags[power];

                  return (
                    <SequenceCard
                      key={power}
                      variant="SurfaceVariant"
                      className={SequenceCardStyle}
                      direction="Column"
                      gap="400"
                    >
                      <SettingTile
                        before={<PowerColorBadge color={tag.color} />}
                        title={
                          <Box as="span" gap="100" alignItems="Center">
                            <b>{tag.name}</b>
                            <Text as="span" size="T200" priority="300">
                              ({power})
                            </Text>
                          </Box>
                        }
                        after={
                          <Chip variant="Secondary" radii="Pill">
                            <Text size="B300">Edit</Text>
                          </Chip>
                        }
                      />
                    </SequenceCard>
                  );
                })}
              </Box>
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
