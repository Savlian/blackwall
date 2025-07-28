import { MatrixClient } from 'matrix-js-sdk';
import { allInvitesAtom, useBindAllInvitesAtom } from '../room-list/inviteList';
import { allRoomsAtom, useBindAllRoomsAtom } from '../room-list/roomList';
import { mDirectAtom, useBindMDirectAtom } from '../mDirectList';
import { roomToUnreadAtom, useBindRoomToUnreadAtom } from '../room/roomToUnread';
import { roomToParentsAtom, useBindRoomToParentsAtom } from '../room/roomToParents';
import { roomIdToTypingMembersAtom, useBindRoomIdToTypingMembersAtom } from '../typingMembers';
import { useBindSlidingSyncAtom, useSlidingSyncRoomListBridge, useShouldUseSlidingSync } from '../sliding-sync';
import { getSlidingSync } from '../../../client/initMatrix';

export const useBindAtoms = (mx: MatrixClient) => {
  const slidingSync = getSlidingSync();
  const shouldUseSlidingSync = useShouldUseSlidingSync();

  // Bind sliding sync atoms if enabled
  useBindSlidingSyncAtom(mx, slidingSync);
  
  // Bridge sliding sync data to existing room list atoms
  useSlidingSyncRoomListBridge();

  // Only bind traditional room list atoms if not using sliding sync
  if (!shouldUseSlidingSync) {
    useBindAllInvitesAtom(mx, allInvitesAtom);
    useBindAllRoomsAtom(mx, allRoomsAtom);
  }

  // These atoms are always bound regardless of sync method
  useBindMDirectAtom(mx, mDirectAtom);
  useBindRoomToParentsAtom(mx, roomToParentsAtom);
  useBindRoomToUnreadAtom(mx, roomToUnreadAtom);
  useBindRoomIdToTypingMembersAtom(mx, roomIdToTypingMembersAtom);
};
