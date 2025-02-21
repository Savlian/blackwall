import React, { forwardRef, MouseEventHandler } from 'react';
import { Room } from 'matrix-js-sdk';
import { Box } from 'folds';
import {
  HierarchyItem,
  HierarchyItemRoom,
  HierarchyItemSpace,
  useFetchSpaceHierarchyLevel,
} from '../../hooks/useSpaceHierarchy';
import { IPowerLevels, powerLevelAPI } from '../../hooks/usePowerLevels';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { SpaceItemCard } from './SpaceItem';
import { AfterItemDropTarget, CanDropCallback } from './DnD';
import { HierarchyItemMenu } from './HierarchyItemMenu';
import { RoomItemCard } from './RoomItem';

type SpaceHierarchyProps = {
  spaceItem: HierarchyItemSpace;
  roomItems?: HierarchyItemRoom[];
  allJoinedRooms: Set<string>;
  mDirects: Set<string>;
  roomsPowerLevels: Map<string, IPowerLevels>;
  canEditSpaceChild: (powerLevels: IPowerLevels) => boolean;
  categoryId: string;
  closed: boolean;
  handleClose: MouseEventHandler<HTMLButtonElement>;
  draggingItem?: HierarchyItem;
  onDragging: (item?: HierarchyItem) => void;
  canDrop: CanDropCallback;
  nextSpaceId?: string;
  getRoom: (roomId: string) => Room | undefined;
  pinned: boolean;
  togglePinToSidebar: (roomId: string) => void;
  onSpaceFound: (roomId: string) => void;
  onOpenRoom: MouseEventHandler<HTMLButtonElement>;
};
export const SpaceHierarchy = forwardRef<HTMLDivElement, SpaceHierarchyProps>(
  (
    {
      spaceItem,
      roomItems,
      allJoinedRooms,
      mDirects,
      roomsPowerLevels,
      canEditSpaceChild,
      categoryId,
      closed,
      handleClose,
      draggingItem,
      onDragging,
      canDrop,
      nextSpaceId,
      getRoom,
      pinned,
      togglePinToSidebar,
      onSpaceFound,
      onOpenRoom,
    },
    ref
  ) => {
    const mx = useMatrixClient();

    const enableHierarchy = !closed && allJoinedRooms.has(spaceItem.roomId);
    const { fetching, error, rooms } = useFetchSpaceHierarchyLevel(
      spaceItem.roomId,
      enableHierarchy
    );

    const spacePowerLevels = roomsPowerLevels.get(spaceItem.roomId) ?? {};
    const userPLInSpace = powerLevelAPI.getPowerLevel(
      spacePowerLevels,
      mx.getUserId() ?? undefined
    );
    const canInviteInSpace = powerLevelAPI.canDoAction(spacePowerLevels, 'invite', userPLInSpace);
    const isJoined = allJoinedRooms.has(spaceItem.roomId);

    const draggingSpace =
      draggingItem?.roomId === spaceItem.roomId && draggingItem.parentId === spaceItem.parentId;

    const { parentId } = spaceItem;
    const parentPowerLevels = parentId ? roomsPowerLevels.get(parentId) ?? {} : undefined;

    return (
      <Box direction="Column" gap="100" ref={ref}>
        <SpaceItemCard
          item={spaceItem}
          joined={allJoinedRooms.has(spaceItem.roomId)}
          categoryId={categoryId}
          closed={closed}
          handleClose={handleClose}
          getRoom={getRoom}
          canEditChild={canEditSpaceChild(spacePowerLevels)}
          canReorder={parentPowerLevels ? canEditSpaceChild(parentPowerLevels) : false}
          options={
            parentId &&
            parentPowerLevels && (
              <HierarchyItemMenu
                item={{ ...spaceItem, parentId }}
                canInvite={canInviteInSpace}
                joined={isJoined}
                canEditChild={canEditSpaceChild(parentPowerLevels)}
                pinned={pinned}
                onTogglePin={togglePinToSidebar}
              />
            )
          }
          after={
            <AfterItemDropTarget
              item={spaceItem}
              nextRoomId={closed ? nextSpaceId : roomItems?.[0]?.roomId}
              afterSpace
              canDrop={canDrop}
            />
          }
          onDragging={onDragging}
          data-dragging={draggingSpace}
        />
        <Box direction="Column" gap="100">
          {roomItems?.map((roomItem, index) => {
            const roomPowerLevels = roomsPowerLevels.get(roomItem.roomId) ?? {};
            const userPLInRoom = powerLevelAPI.getPowerLevel(
              roomPowerLevels,
              mx.getUserId() ?? undefined
            );
            const canInviteInRoom = powerLevelAPI.canDoAction(
              roomPowerLevels,
              'invite',
              userPLInRoom
            );

            const lastItem = index === roomItems.length;
            const nextRoomId = lastItem ? nextSpaceId : roomItems[index + 1]?.roomId;

            const roomDragging =
              draggingItem?.roomId === roomItem.roomId &&
              draggingItem.parentId === roomItem.parentId;

            return (
              <RoomItemCard
                key={roomItem.roomId}
                item={roomItem}
                loading={fetching}
                error={error}
                summary={rooms.get(roomItem.roomId)}
                onSpaceFound={onSpaceFound}
                dm={mDirects.has(roomItem.roomId)}
                onOpen={onOpenRoom}
                getRoom={getRoom}
                canReorder={canEditSpaceChild(spacePowerLevels)}
                options={
                  <HierarchyItemMenu
                    item={roomItem}
                    canInvite={canInviteInRoom}
                    joined={isJoined}
                    canEditChild={canEditSpaceChild(spacePowerLevels)}
                  />
                }
                after={
                  <AfterItemDropTarget item={roomItem} nextRoomId={nextRoomId} canDrop={canDrop} />
                }
                data-dragging={roomDragging}
                onDragging={onDragging}
              />
            );
          })}
        </Box>
      </Box>
    );
  }
);
