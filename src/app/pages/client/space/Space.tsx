import React, {
  MouseEventHandler,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  Avatar,
  Box,
  Icon,
  IconButton,
  Icons,
  Line,
  Menu,
  MenuItem,
  PopOut,
  RectCords,
  Text,
  config,
  toRem,
} from 'folds';
import { useVirtualizer } from '@tanstack/react-virtual';
import { JoinRule, Room } from 'matrix-js-sdk';
import { RoomJoinRulesEventContent } from 'matrix-js-sdk/lib/types';
import FocusTrap from 'focus-trap-react';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { mDirectAtom } from '../../../state/mDirectList';
import {
  NavCategory,
  NavCategoryHeader,
  NavItem,
  NavItemContent,
  NavLink,
} from '../../../components/nav';
import { getSpaceLobbyPath, getSpaceRoomPath, getSpaceSearchPath } from '../../pathUtils';
import { getCanonicalAliasOrRoomId, isRoomAlias } from '../../../utils/matrix';
import { useSelectedRoom } from '../../../hooks/router/useSelectedRoom';
import {
  useSpaceLobbySelected,
  useSpaceSearchSelected,
} from '../../../hooks/router/useSelectedSpace';
import { useSpace } from '../../../hooks/useSpace';
import { VirtualTile } from '../../../components/virtualizer';
import { RoomNavCategoryButton, RoomNavItem } from '../../../features/room-nav';
import { makeNavCategoryId, getNavCategoryIdParts } from '../../../state/closedNavCategories';
import { roomToUnreadAtom } from '../../../state/room/roomToUnread';
import { useCategoryHandler } from '../../../hooks/useCategoryHandler';
import { useNavToActivePathMapper } from '../../../hooks/useNavToActivePathMapper';
import { useRoomName } from '../../../hooks/useRoomMeta';
import { useSpaceJoinedHierarchy } from '../../../hooks/useSpaceHierarchy';
import { allRoomsAtom } from '../../../state/room-list/roomList';
import { PageNav, PageNavContent, PageNavHeader } from '../../../components/page';
import { usePowerLevels, usePowerLevelsAPI } from '../../../hooks/usePowerLevels';
import { openInviteUser } from '../../../../client/action/navigation';
import { useRecursiveChildScopeFactory, useSpaceChildren } from '../../../state/hooks/roomList';
import { roomToParentsAtom } from '../../../state/room/roomToParents';
import { roomToChildrenAtom } from '../../../state/room/roomToChildren';
import { markAsRead } from '../../../../client/action/notifications';
import { useRoomsUnread } from '../../../state/hooks/unread';
import { UseStateProvider } from '../../../components/UseStateProvider';
import { LeaveSpacePrompt } from '../../../components/leave-space-prompt';
import { copyToClipboard } from '../../../utils/dom';
import { useClosedNavCategoriesAtom } from '../../../state/hooks/closedNavCategories';
import { useStateEvent } from '../../../hooks/useStateEvent';
import { StateEvent } from '../../../../types/matrix/room';
import { stopPropagation } from '../../../utils/keyboard';
import { getMatrixToRoom } from '../../../plugins/matrix-to';
import { getViaServers } from '../../../plugins/via-servers';
import { useSetting } from '../../../state/hooks/settings';
import { settingsAtom } from '../../../state/settings';
import {
  getRoomNotificationMode,
  useRoomsNotificationPreferencesContext,
} from '../../../hooks/useRoomsNotificationPreferences';
import { useOpenSpaceSettings } from '../../../state/hooks/spaceSettings';
import { useRoomNavigate } from '../../../hooks/useRoomNavigate';

type SpaceMenuProps = {
  room: Room;
  requestClose: () => void;
};
const SpaceMenu = forwardRef<HTMLDivElement, SpaceMenuProps>(({ room, requestClose }, ref) => {
  const mx = useMatrixClient();
  const [hideActivity] = useSetting(settingsAtom, 'hideActivity');
  const [developerTools] = useSetting(settingsAtom, 'developerTools');
  const roomToParents = useAtomValue(roomToParentsAtom);
  const powerLevels = usePowerLevels(room);
  const { getPowerLevel, canDoAction } = usePowerLevelsAPI(powerLevels);
  const canInvite = canDoAction('invite', getPowerLevel(mx.getUserId() ?? ''));
  const openSpaceSettings = useOpenSpaceSettings();
  const { navigateRoom } = useRoomNavigate();

  const allChild = useSpaceChildren(
    allRoomsAtom,
    room.roomId,
    useRecursiveChildScopeFactory(mx, roomToParents)
  );
  const unread = useRoomsUnread(allChild, roomToUnreadAtom);

  const handleMarkAsRead = () => {
    allChild.forEach((childRoomId) => markAsRead(mx, childRoomId, hideActivity));
    requestClose();
  };

  const handleCopyLink = () => {
    const roomIdOrAlias = getCanonicalAliasOrRoomId(mx, room.roomId);
    const viaServers = isRoomAlias(roomIdOrAlias) ? undefined : getViaServers(room);
    copyToClipboard(getMatrixToRoom(roomIdOrAlias, viaServers));
    requestClose();
  };

  const handleInvite = () => {
    openInviteUser(room.roomId);
    requestClose();
  };

  const handleRoomSettings = () => {
    openSpaceSettings(room.roomId);
    requestClose();
  };

  const handleOpenTimeline = () => {
    navigateRoom(room.roomId);
    requestClose();
  };

  return (
    <Menu ref={ref} style={{ maxWidth: toRem(160), width: '100vw' }}>
      <Box direction="Column" gap="100" style={{ padding: config.space.S100 }}>
        <MenuItem
          onClick={handleMarkAsRead}
          size="300"
          after={<Icon size="100" src={Icons.CheckTwice} />}
          radii="300"
          disabled={!unread}
        >
          <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
            Mark as Read
          </Text>
        </MenuItem>
      </Box>
      <Line variant="Surface" size="300" />
      <Box direction="Column" gap="100" style={{ padding: config.space.S100 }}>
        <MenuItem
          onClick={handleInvite}
          variant="Primary"
          fill="None"
          size="300"
          after={<Icon size="100" src={Icons.UserPlus} />}
          radii="300"
          disabled={!canInvite}
        >
          <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
            Invite
          </Text>
        </MenuItem>
        <MenuItem
          onClick={handleCopyLink}
          size="300"
          after={<Icon size="100" src={Icons.Link} />}
          radii="300"
        >
          <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
            Copy Link
          </Text>
        </MenuItem>
        <MenuItem
          onClick={handleRoomSettings}
          size="300"
          after={<Icon size="100" src={Icons.Setting} />}
          radii="300"
        >
          <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
            Space Settings
          </Text>
        </MenuItem>
        {developerTools && (
          <MenuItem
            onClick={handleOpenTimeline}
            size="300"
            after={<Icon size="100" src={Icons.Terminal} />}
            radii="300"
          >
            <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
              Event Timeline
            </Text>
          </MenuItem>
        )}
      </Box>
      <Line variant="Surface" size="300" />
      <Box direction="Column" gap="100" style={{ padding: config.space.S100 }}>
        <UseStateProvider initial={false}>
          {(promptLeave, setPromptLeave) => (
            <>
              <MenuItem
                onClick={() => setPromptLeave(true)}
                variant="Critical"
                fill="None"
                size="300"
                after={<Icon size="100" src={Icons.ArrowGoLeft} />}
                radii="300"
                aria-pressed={promptLeave}
              >
                <Text style={{ flexGrow: 1 }} as="span" size="T300" truncate>
                  Leave Space
                </Text>
              </MenuItem>
              {promptLeave && (
                <LeaveSpacePrompt
                  roomId={room.roomId}
                  onDone={requestClose}
                  onCancel={() => setPromptLeave(false)}
                />
              )}
            </>
          )}
        </UseStateProvider>
      </Box>
    </Menu>
  );
});

function SpaceHeader() {
  const space = useSpace();
  const spaceName = useRoomName(space);
  const [menuAnchor, setMenuAnchor] = useState<RectCords>();

  const joinRules = useStateEvent(
    space,
    StateEvent.RoomJoinRules
  )?.getContent<RoomJoinRulesEventContent>();

  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const cords = evt.currentTarget.getBoundingClientRect();
    setMenuAnchor((currentState) => {
      if (currentState) return undefined;
      return cords;
    });
  };

  return (
    <>
      <PageNavHeader>
        <Box alignItems="Center" grow="Yes" gap="300">
          <Box grow="Yes" alignItems="Center" gap="100">
            <Text size="H4" truncate>
              {spaceName}
            </Text>
            {joinRules?.join_rule !== JoinRule.Public && <Icon src={Icons.Lock} size="50" />}
          </Box>
          <Box>
            <IconButton aria-pressed={!!menuAnchor} variant="Background" onClick={handleOpenMenu}>
              <Icon src={Icons.VerticalDots} size="200" />
            </IconButton>
          </Box>
        </Box>
      </PageNavHeader>
      {menuAnchor && (
        <PopOut
          anchor={menuAnchor}
          position="Bottom"
          align="End"
          offset={6}
          content={
            <FocusTrap
              focusTrapOptions={{
                initialFocus: false,
                returnFocusOnDeactivate: false,
                onDeactivate: () => setMenuAnchor(undefined),
                clickOutsideDeactivates: true,
                isKeyForward: (evt: KeyboardEvent) => evt.key === 'ArrowDown',
                isKeyBackward: (evt: KeyboardEvent) => evt.key === 'ArrowUp',
                escapeDeactivates: stopPropagation,
              }}
            >
              <SpaceMenu room={space} requestClose={() => setMenuAnchor(undefined)} />
            </FocusTrap>
          }
        />
      )}
    </>
  );
}

export function Space() {
  const mx = useMatrixClient();
  const space = useSpace();
  useNavToActivePathMapper(space.roomId);
  const spaceIdOrAlias = getCanonicalAliasOrRoomId(mx, space.roomId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mDirects = useAtomValue(mDirectAtom);
  const roomToUnread = useAtomValue(roomToUnreadAtom);
  const roomToParents = useAtomValue(roomToParentsAtom);
  const roomToChildren = useAtomValue(roomToChildrenAtom);
  const allRooms = useAtomValue(allRoomsAtom);
  const allJoinedRooms = useMemo(() => new Set(allRooms), [allRooms]);
  const notificationPreferences = useRoomsNotificationPreferencesContext();

  const selectedRoomId = useSelectedRoom();
  const lobbySelected = useSpaceLobbySelected(spaceIdOrAlias);
  const searchSelected = useSpaceSearchSelected(spaceIdOrAlias);

  const [closedCategories, setClosedCategories] = useAtom(useClosedNavCategoriesAtom());

  const getRoom = useCallback(
    (rId: string) => {
      if (allJoinedRooms.has(rId)) {
        return mx.getRoom(rId) ?? undefined;
      }
      return undefined;
    },
    [mx, allJoinedRooms]
  );

  /**
   * Recursively checks if a given parentId (or all its ancestors) is in a closed category.
   *
   * @param spaceId - The root space ID.
   * @param parentId - The parent space ID to start the check from.
   * @param previousId - The last ID checked, only used to ignore root collapse state.
   * @returns True if parentId or all ancestors is in a closed category.
   */
  const getInClosedCategories = useCallback(
    (spaceId: string, parentId: string, previousId?: string): boolean => {
      // Ignore root space being collapsed if in a subspace,
      // this is due to many spaces dumping all rooms in the top-level space.
      if (parentId === spaceId) {
        if (previousId) {
          if (getRoom(previousId)?.isSpaceRoom()) return false;
        }
      }

      if (closedCategories.has(makeNavCategoryId(spaceId, parentId))) {
        return true;
      }

      const parentParentIds = roomToParents.get(parentId);
      if (!parentParentIds || parentParentIds.size === 0) {
        return false;
      }

      let anyOpen = false;
      parentParentIds.forEach((id) => {
        if (!getInClosedCategories(spaceId, id, parentId)) {
          anyOpen = true;
        }
      });

      return !anyOpen;
    },
    [closedCategories, getRoom, roomToParents]
  );

  /**
   * Recursively checks if the given room or any of its descendants should be visible.
   *
   * @param roomId - The room ID to check.
   * @returns True if the room or any descendant should be visible.
   */
  const getContainsShowRoom = useCallback(
    (roomId: string): boolean => {
      if (roomToUnread.has(roomId) || roomId === selectedRoomId) {
        return true;
      }

      const childIds = roomToChildren.get(roomId);
      if (!childIds || childIds.size === 0) {
        return false;
      }

      let visible = false;
      childIds.forEach((id) => {
        if (getContainsShowRoom(id)) {
          visible = true;
        }
      });

      return visible;
    },
    [roomToUnread, selectedRoomId, roomToChildren]
  );

  /**
   * Determines whether all parent categories are collapsed.
   *
   * @param spaceId - The root space ID.
   * @param roomId - The room ID to start the check from.
   * @returns True if every parent category is collapsed; false otherwise.
   */
  const getAllAncestorsCollapsed = (spaceId: string, roomId: string): boolean => {
    const parentIds = roomToParents.get(roomId);
    if (!parentIds || parentIds.size === 0) {
      return false;
    }

    let allCollapsed = true;
    parentIds.forEach((id) => {
      if (!getInClosedCategories(spaceId, id, roomId)) {
        allCollapsed = false;
      }
    });
    return allCollapsed;
  };

  const hierarchy = useSpaceJoinedHierarchy(
    space.roomId,
    getRoom,
    useCallback(
      (parentId, roomId) => {
        if (!getInClosedCategories(space.roomId, parentId, roomId)) {
          return false;
        }
        if (getContainsShowRoom(roomId)) return false;
        return true;
      },
      [getContainsShowRoom, getInClosedCategories, space.roomId]
    ),
    useCallback(
      (sId) => getInClosedCategories(space.roomId, sId),
      [getInClosedCategories, space.roomId]
    )
  );

  const virtualizer = useVirtualizer({
    count: hierarchy.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 0,
    overscan: 10,
  });

  const handleCategoryClick = useCategoryHandler(setClosedCategories, (categoryId) => {
    const collapsed = closedCategories.has(categoryId);
    const [spaceId, roomId] = getNavCategoryIdParts(categoryId);

    // Only prevent collapsing if all parents are collapsed
    const toggleable = !getAllAncestorsCollapsed(spaceId, roomId);

    if (toggleable) {
      return collapsed;
    }
    return !collapsed;
  });

  const getToLink = (roomId: string) =>
    getSpaceRoomPath(spaceIdOrAlias, getCanonicalAliasOrRoomId(mx, roomId));

  const getCategoryPadding = (depth: number): string | undefined => {
    if (depth === 0) return undefined;
    if (depth === 1) return config.space.S400;
    return config.space.S200;
  };

  return (
    <PageNav>
      <SpaceHeader />
      <PageNavContent scrollRef={scrollRef}>
        <Box direction="Column" gap="300">
          <NavCategory>
            <NavItem variant="Background" radii="400" aria-selected={lobbySelected}>
              <NavLink to={getSpaceLobbyPath(getCanonicalAliasOrRoomId(mx, space.roomId))}>
                <NavItemContent>
                  <Box as="span" grow="Yes" alignItems="Center" gap="200">
                    <Avatar size="200" radii="400">
                      <Icon src={Icons.Flag} size="100" filled={lobbySelected} />
                    </Avatar>
                    <Box as="span" grow="Yes">
                      <Text as="span" size="Inherit" truncate>
                        Lobby
                      </Text>
                    </Box>
                  </Box>
                </NavItemContent>
              </NavLink>
            </NavItem>
            <NavItem variant="Background" radii="400" aria-selected={searchSelected}>
              <NavLink to={getSpaceSearchPath(getCanonicalAliasOrRoomId(mx, space.roomId))}>
                <NavItemContent>
                  <Box as="span" grow="Yes" alignItems="Center" gap="200">
                    <Avatar size="200" radii="400">
                      <Icon src={Icons.Search} size="100" filled={searchSelected} />
                    </Avatar>
                    <Box as="span" grow="Yes">
                      <Text as="span" size="Inherit" truncate>
                        Message Search
                      </Text>
                    </Box>
                  </Box>
                </NavItemContent>
              </NavLink>
            </NavItem>
          </NavCategory>
          <NavCategory
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((vItem) => {
              const { roomId, depth } = hierarchy[vItem.index] ?? {};
              const room = mx.getRoom(roomId);
              if (!room) return null;

              const paddingLeft = `calc((${depth} - 1) * ${config.space.S200})`;

              if (room.isSpaceRoom()) {
                const categoryId = makeNavCategoryId(space.roomId, roomId);
                const closed = getInClosedCategories(space.roomId, roomId);
                const toggleable = !getAllAncestorsCollapsed(space.roomId, roomId);

                const paddingTop = getCategoryPadding(depth);

                return (
                  <VirtualTile
                    virtualItem={vItem}
                    key={vItem.index}
                    ref={virtualizer.measureElement}
                  >
                    <div
                      style={{
                        paddingTop,
                        paddingLeft,
                      }}
                    >
                      <NavCategoryHeader>
                        <RoomNavCategoryButton
                          data-category-id={categoryId}
                          onClick={handleCategoryClick}
                          closed={closed}
                          aria-expanded={!closed}
                          aria-disabled={!toggleable}
                        >
                          {roomId === space.roomId ? 'Rooms' : room?.name}
                        </RoomNavCategoryButton>
                      </NavCategoryHeader>
                    </div>
                  </VirtualTile>
                );
              }

              return (
                <VirtualTile virtualItem={vItem} key={vItem.index} ref={virtualizer.measureElement}>
                  <div style={{ paddingLeft }}>
                    <RoomNavItem
                      room={room}
                      selected={selectedRoomId === roomId}
                      showAvatar={mDirects.has(roomId)}
                      direct={mDirects.has(roomId)}
                      linkPath={getToLink(roomId)}
                      notificationMode={getRoomNotificationMode(
                        notificationPreferences,
                        room.roomId
                      )}
                    />
                  </div>
                </VirtualTile>
              );
            })}
          </NavCategory>
        </Box>
      </PageNavContent>
    </PageNav>
  );
}
