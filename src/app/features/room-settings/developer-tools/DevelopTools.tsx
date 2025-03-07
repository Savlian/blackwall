import React from 'react';
import { Box, Text, IconButton, Icon, Icons, Scroll, Switch, Button, Chip } from 'folds';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';
import { useSetting } from '../../../state/hooks/settings';
import { settingsAtom } from '../../../state/settings';
import { copyToClipboard } from '../../../utils/dom';
import { useRoom } from '../../../hooks/useRoom';
import { useRoomState } from '../../../hooks/useRoomState';

type DeveloperToolsProps = {
  requestClose: () => void;
};
export function DeveloperTools({ requestClose }: DeveloperToolsProps) {
  const [developerTools, setDeveloperTools] = useSetting(settingsAtom, 'developerTools');
  const room = useRoom();

  const roomState = useRoomState(room);

  return (
    <Page>
      <PageHeader outlined={false}>
        <Box grow="Yes" gap="200">
          <Box grow="Yes" alignItems="Center" gap="200">
            <Text size="H3" truncate>
              Developer Tools
            </Text>
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
                <Text size="L400">Options</Text>
                <SequenceCard
                  className={SequenceCardStyle}
                  variant="SurfaceVariant"
                  direction="Column"
                  gap="400"
                >
                  <SettingTile
                    title="Enable Developer Tools"
                    after={
                      <Switch
                        variant="Primary"
                        value={developerTools}
                        onChange={setDeveloperTools}
                      />
                    }
                  />
                </SequenceCard>
                {developerTools && (
                  <SequenceCard
                    className={SequenceCardStyle}
                    variant="SurfaceVariant"
                    direction="Column"
                    gap="400"
                  >
                    <SettingTile
                      title="Room ID"
                      description={`Copy room ID to clipboard. ("${room.roomId}")`}
                      after={
                        <Button
                          onClick={() => copyToClipboard(room.roomId ?? '<NO_ROOM_ID_FOUND>')}
                          variant="Secondary"
                          fill="Soft"
                          size="300"
                          radii="300"
                          outlined
                        >
                          <Text size="B300">Copy</Text>
                        </Button>
                      }
                    />
                  </SequenceCard>
                )}
              </Box>
              <Box direction="Column" gap="100">
                <Text size="L400">Room State</Text>
                {Array.from(roomState.entries()).map(([eventType, stateKeyToEvents]) => (
                  <SequenceCard
                    key={eventType}
                    className={SequenceCardStyle}
                    variant="SurfaceVariant"
                    direction="Column"
                    gap="400"
                  >
                    <SettingTile title={eventType}>
                      <Box gap="200" wrap="Wrap">
                        {Array.from(stateKeyToEvents.keys()).map((stateKey) => (
                          <Chip
                            onClick={() => console.log(stateKeyToEvents.get(stateKey)?.event)}
                            key={stateKey}
                            variant="Secondary"
                            fill="Soft"
                            radii="Pill"
                          >
                            <Text size="T200" truncate>
                              {stateKey ? `"${stateKey}"` : 'Default'}
                            </Text>
                          </Chip>
                        ))}
                      </Box>
                    </SettingTile>
                  </SequenceCard>
                ))}
              </Box>
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
