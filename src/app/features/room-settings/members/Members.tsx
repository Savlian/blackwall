import React, { ChangeEventHandler, MouseEventHandler, useCallback, useMemo, useRef } from 'react';
import { Box, config, Icon, IconButton, Icons, Input, Scroll, Spinner, Text } from 'folds';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RoomMember } from 'matrix-js-sdk';
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
import { getMxIdLocalPart, getMxIdServer } from '../../../utils/matrix';
import { ServerBadge } from '../../../components/server-badge';
import { openProfileViewer } from '../../../../client/action/navigation';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  SearchItemStrGetter,
  useAsyncSearch,
  UseAsyncSearchOptions,
} from '../../../hooks/useAsyncSearch';
import { getMemberSearchStr } from '../../../utils/room';

const SEARCH_OPTIONS: UseAsyncSearchOptions = {
  limit: 1000,
  matchOptions: {
    contain: true,
  },
  normalizeOptions: {
    ignoreWhitespace: false,
  },
};

const mxIdToName = (mxId: string) => getMxIdLocalPart(mxId) ?? mxId;
const getRoomMemberStr: SearchItemStrGetter<RoomMember> = (m, query) =>
  getMemberSearchStr(m, query, mxIdToName);

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sortedMembers = useMemo(
    () => Array.from(members).sort((a, b) => b.powerLevel - a.powerLevel),
    [members]
  );

  const [result, search, resetSearch] = useAsyncSearch(
    sortedMembers,
    getRoomMemberStr,
    SEARCH_OPTIONS
  );
  if (!result && searchInputRef.current?.value) search(searchInputRef.current.value);

  const flattenTagMembers = useFlattenPowerLevelTagMembers(
    result?.items ?? sortedMembers,
    getPowerLevel,
    getPowerLevelTag
  );

  const virtualizer = useVirtualizer({
    count: flattenTagMembers.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useDebounce(
    useCallback(
      (evt) => {
        if (evt.target.value) search(evt.target.value);
        else resetSearch();
      },
      [search, resetSearch]
    ),
    { wait: 200 }
  );

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
              {room.getJoinedMemberCount()} Members
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
            <Box direction="Column" gap="600">
              <Box
                style={{ position: 'sticky', top: config.space.S100, zIndex: 1 }}
                direction="Column"
                gap="100"
              >
                <Input
                  ref={searchInputRef}
                  onChange={handleSearchChange}
                  before={<Icon size="200" src={Icons.Search} />}
                  variant="SurfaceVariant"
                  size="500"
                  placeholder="Search"
                  outlined
                />
              </Box>
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
                        key={tagOrMember.userId}
                        ref={virtualizer.measureElement}
                      >
                        <div style={{ paddingTop: config.space.S200 }}>
                          <MemberTile
                            data-user-id={tagOrMember.userId}
                            onClick={handleMemberClick}
                            mx={mx}
                            room={room}
                            member={tagOrMember}
                            useAuthentication={useAuthentication}
                            after={
                              server && (
                                <Box as="span" shrink="No" alignSelf="End">
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
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
