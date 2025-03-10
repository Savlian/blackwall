import React, { useCallback, useState } from 'react';
import { Box, Text, IconButton, Icon, Icons, Scroll, Switch, Button, MenuItem, Chip } from 'folds';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';
import { useSetting } from '../../../state/hooks/settings';
import { settingsAtom } from '../../../state/settings';
import { copyToClipboard } from '../../../utils/dom';
import { useRoom } from '../../../hooks/useRoom';
import { useRoomState } from '../../../hooks/useRoomState';
import { StateEventEditor, StateEventInfo } from './StateEventEditor';
import { SendRoomEvent } from './SendRoomEvent';
import { useRoomAccountData } from '../../../hooks/useRoomAccountData';
import { CutoutCard } from '../../../components/cutout-card';
import {
  AccountDataEditor,
  AccountDataSubmitCallback,
} from '../../../components/AccountDataEditor';
import { useMatrixClient } from '../../../hooks/useMatrixClient';

type DeveloperToolsProps = {
  requestClose: () => void;
};
export function DeveloperTools({ requestClose }: DeveloperToolsProps) {
  const [developerTools, setDeveloperTools] = useSetting(settingsAtom, 'developerTools');
  const mx = useMatrixClient();
  const room = useRoom();

  const roomState = useRoomState(room);
  const accountData = useRoomAccountData(room);

  const [expandState, setExpandState] = useState<string>();
  const [openStateEvent, setOpenStateEvent] = useState<StateEventInfo>();
  const [composeEvent, setComposeEvent] = useState<{ type?: string; stateKey?: string }>();

  const [expandAccountData, setExpandAccountData] = useState(false);
  const [accountDataType, setAccountDataType] = useState<string | null>();

  const handleClose = useCallback(() => {
    setOpenStateEvent(undefined);
    setComposeEvent(undefined);
    setAccountDataType(undefined);
  }, []);

  const submitAccountData: AccountDataSubmitCallback = useCallback(
    async (type, content) => {
      await mx.setRoomAccountData(room.roomId, type, content);
    },
    [mx, room.roomId]
  );

  if (accountDataType !== undefined) {
    return (
      <AccountDataEditor
        type={accountDataType ?? undefined}
        content={accountDataType ? accountData.get(accountDataType) : undefined}
        submitChange={submitAccountData}
        requestClose={handleClose}
      />
    );
  }

  if (composeEvent) {
    return <SendRoomEvent {...composeEvent} requestClose={handleClose} />;
  }

  if (openStateEvent) {
    return <StateEventEditor {...openStateEvent} requestClose={handleClose} />;
  }

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
                  <>
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

                    <SequenceCard
                      className={SequenceCardStyle}
                      variant="SurfaceVariant"
                      direction="Column"
                      gap="400"
                    >
                      <SettingTile
                        title="New Message Event"
                        description="Create and send a new message event within the room."
                        after={
                          <Button
                            onClick={() => setComposeEvent({})}
                            variant="Secondary"
                            fill="Soft"
                            size="300"
                            radii="300"
                            outlined
                          >
                            <Text size="B300">Compose</Text>
                          </Button>
                        }
                      />
                    </SequenceCard>
                  </>
                )}
              </Box>
              {developerTools && (
                <Box direction="Column" gap="100">
                  <Text size="L400">State</Text>
                  <SequenceCard
                    className={SequenceCardStyle}
                    variant="SurfaceVariant"
                    direction="Column"
                    gap="400"
                  >
                    <SettingTile
                      title="New State Event"
                      description="Create and send a new state event within the room."
                      after={
                        <Button
                          onClick={() => setComposeEvent({ stateKey: '' })}
                          variant="Secondary"
                          fill="Soft"
                          size="300"
                          radii="300"
                          outlined
                        >
                          <Text size="B300">Compose</Text>
                        </Button>
                      }
                    />
                  </SequenceCard>
                  {Array.from(roomState.keys())
                    .sort()
                    .map((eventType) => {
                      const expanded = eventType === expandState;
                      const stateKeyToEvents = roomState.get(eventType);
                      if (!stateKeyToEvents) return null;

                      return (
                        <SequenceCard
                          id={eventType}
                          key={eventType}
                          className={SequenceCardStyle}
                          variant="SurfaceVariant"
                          direction="Column"
                          gap="400"
                        >
                          <SettingTile
                            title={eventType}
                            after={
                              <Chip
                                variant="Secondary"
                                fill="Soft"
                                radii="Pill"
                                before={
                                  <Icon
                                    size="100"
                                    src={expanded ? Icons.ChevronTop : Icons.ChevronBottom}
                                  />
                                }
                                onClick={() => setExpandState(expanded ? undefined : eventType)}
                              >
                                {expanded ? (
                                  <Text size="B300">Collapse</Text>
                                ) : (
                                  <Text size="B300">Expand</Text>
                                )}
                              </Chip>
                            }
                          />
                          {expanded && (
                            <Box direction="Column" gap="100">
                              <Box justifyContent="SpaceBetween">
                                <Text size="L400">Events</Text>
                                <Text size="L400">Total: {stateKeyToEvents.size}</Text>
                              </Box>
                              <CutoutCard>
                                <MenuItem
                                  onClick={() => setComposeEvent({ type: eventType, stateKey: '' })}
                                  variant="Surface"
                                  fill="None"
                                  size="300"
                                  radii="0"
                                  before={<Icon size="50" src={Icons.Plus} />}
                                >
                                  <Box grow="Yes">
                                    <Text size="B300" truncate>
                                      Add New
                                    </Text>
                                  </Box>
                                </MenuItem>
                                {Array.from(stateKeyToEvents.keys())
                                  .sort()
                                  .map((stateKey) => (
                                    <MenuItem
                                      onClick={() => {
                                        setOpenStateEvent({
                                          type: eventType,
                                          stateKey,
                                        });
                                      }}
                                      key={stateKey}
                                      variant="Surface"
                                      fill="None"
                                      size="300"
                                      radii="0"
                                      after={<Icon size="50" src={Icons.ChevronRight} />}
                                    >
                                      <Box grow="Yes">
                                        <Text size="B300" truncate>
                                          {stateKey ? `"${stateKey}"` : 'Default'}
                                        </Text>
                                      </Box>
                                    </MenuItem>
                                  ))}
                              </CutoutCard>
                            </Box>
                          )}
                        </SequenceCard>
                      );
                    })}
                </Box>
              )}

              {developerTools && (
                <Box direction="Column" gap="100">
                  <Text size="L400">Data</Text>
                  <SequenceCard
                    className={SequenceCardStyle}
                    variant="SurfaceVariant"
                    direction="Column"
                    gap="400"
                  >
                    <SettingTile
                      title="Account Data"
                      description="Private personalization data stored within room."
                      after={
                        <Button
                          onClick={() => setExpandAccountData(!expandAccountData)}
                          variant="Secondary"
                          fill="Soft"
                          size="300"
                          radii="300"
                          outlined
                          before={
                            <Icon
                              src={expandAccountData ? Icons.ChevronTop : Icons.ChevronBottom}
                              size="100"
                              filled
                            />
                          }
                        >
                          <Text size="B300">{expandAccountData ? 'Collapse' : 'Expand'}</Text>
                        </Button>
                      }
                    />
                    {expandAccountData && (
                      <Box direction="Column" gap="100">
                        <Box justifyContent="SpaceBetween">
                          <Text size="L400">Events</Text>
                          <Text size="L400">Total: {accountData.size}</Text>
                        </Box>
                        <CutoutCard>
                          <MenuItem
                            variant="Surface"
                            fill="None"
                            size="300"
                            radii="0"
                            before={<Icon size="50" src={Icons.Plus} />}
                            onClick={() => setAccountDataType(null)}
                          >
                            <Box grow="Yes">
                              <Text size="B300" truncate>
                                Add New
                              </Text>
                            </Box>
                          </MenuItem>
                          {Array.from(accountData.keys())
                            .sort()
                            .map((type) => (
                              <MenuItem
                                key={type}
                                variant="Surface"
                                fill="None"
                                size="300"
                                radii="0"
                                after={<Icon size="50" src={Icons.ChevronRight} />}
                                onClick={() => setAccountDataType(type)}
                              >
                                <Box grow="Yes">
                                  <Text size="B300" truncate>
                                    {type}
                                  </Text>
                                </Box>
                              </MenuItem>
                            ))}
                        </CutoutCard>
                      </Box>
                    )}
                  </SequenceCard>
                </Box>
              )}
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
