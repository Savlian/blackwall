import React, { MouseEventHandler, useMemo, useRef } from 'react';
import { Box, config, Icon, IconButton, Icons, Scroll, Spinner, Text } from 'folds';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { useRoom } from '../../../hooks/useRoom';
import { useRoomMembers } from '../../../hooks/useRoomMembers';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { usePowerLevels, usePowerLevelsAPI } from '../../../hooks/usePowerLevels';
import {
  useFlattenPowerLevelTagMembers,
  usePowerLevelTags,
} from '../../../hooks/usePowerLevelTags';
import { VirtualTile } from '../../../components/virtualizer';
import { MemberTile } from '../../../components/member-tile';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import { getMxIdServer } from '../../../utils/matrix';
import { ServerBadge } from '../../../components/server-badge';
import { openProfileViewer } from '../../../../client/action/navigation';

type MembersProps = {
  requestClose: () => void;
};
export function Members({ requestClose }: MembersProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const room = useRoom();
  const members = useRoomMembers(mx, room.roomId);
  const fetchingMembers = members.length < room.getJoinedMemberCount();

  const powerLevels = usePowerLevels(room);
  const { getPowerLevel } = usePowerLevelsAPI(powerLevels);
  const getPowerLevelTag = usePowerLevelTags();

  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedMembers = useMemo(
    () => Array.from(members).sort((a, b) => b.powerLevel - a.powerLevel),
    [members]
  );

  const flattenTagMembers = useFlattenPowerLevelTagMembers(
    sortedMembers,
    getPowerLevel,
    getPowerLevelTag
  );

  const virtualizer = useVirtualizer({
    count: flattenTagMembers.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const handleMemberClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const btn = evt.currentTarget as HTMLButtonElement;
    const userId = btn.getAttribute('data-user-id');
    openProfileViewer(userId, room.roomId);
    requestClose();
  };

  return (
    <Page>
      <PageHeader outlined={false}>
        <Box grow="Yes" gap="200">
          <Box grow="Yes" alignItems="Center" gap="200">
            <Text size="H3" truncate>
              Members ({room.getJoinedMemberCount()})
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
        <Scroll ref={scrollRef} hideTrack visibility="Hover">
          <PageContent>
            <Box
              style={{
                position: 'relative',
                height: virtualizer.getTotalSize(),
              }}
              direction="Column"
              gap="100"
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                const tagOrMember = flattenTagMembers[vItem.index];

                if ('userId' in tagOrMember) {
                  const server = getMxIdServer(tagOrMember.userId);
                  return (
                    <VirtualTile
                      virtualItem={vItem}
                      key={vItem.index}
                      ref={virtualizer.measureElement}
                    >
                      <div style={{ paddingTop: config.space.S100 }}>
                        <MemberTile
                          data-user-id={tagOrMember.userId}
                          onClick={handleMemberClick}
                          mx={mx}
                          room={room}
                          member={tagOrMember}
                          useAuthentication={useAuthentication}
                          after={
                            server && (
                              <Box as="span" shrink="No" alignSelf="Start">
                                <ServerBadge server={server} fill="Solid" />
                              </Box>
                            )
                          }
                        />
                      </div>
                    </VirtualTile>
                  );
                }

                return (
                  <VirtualTile
                    virtualItem={vItem}
                    key={vItem.index}
                    ref={virtualizer.measureElement}
                  >
                    <div
                      style={{
                        paddingTop: vItem.index === 0 ? undefined : config.space.S500,
                      }}
                    >
                      <Text size="L400">{tagOrMember.name}</Text>
                    </div>
                  </VirtualTile>
                );
              })}

              {fetchingMembers && (
                <Box justifyContent="Center">
                  <Spinner />
                </Box>
              )}
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
