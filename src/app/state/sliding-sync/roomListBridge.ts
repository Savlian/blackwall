import { useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { allRoomsAtom } from '../room-list/roomList';
import { allInvitesAtom } from '../room-list/inviteList';
import { slidingSyncRoomListAtom, slidingSyncEnabledAtom } from './slidingSync';

/**
 * Bridge sliding sync room list data to existing Cinny room list atoms
 * This allows existing UI components to work seamlessly with sliding sync
 */
export const useSlidingSyncRoomListBridge = () => {
  const slidingSyncEnabled = useAtomValue(slidingSyncEnabledAtom);
  const slidingSyncRoomList = useAtomValue(slidingSyncRoomListAtom);
  const setAllRooms = useSetAtom(allRoomsAtom);
  const setAllInvites = useSetAtom(allInvitesAtom);

  useEffect(() => {
    if (!slidingSyncEnabled) return;

    // Bridge sliding sync room lists to existing atoms
    const allRoomsList = slidingSyncRoomList.allRooms || [];
    const directMessagesList = slidingSyncRoomList.directMessages || [];
    const invitesList = slidingSyncRoomList.invites || [];

    // Combine all rooms and DMs for the all rooms atom
    const combinedRooms = [...allRoomsList, ...directMessagesList];

    // Update existing atoms
    setAllRooms({ type: 'INITIALIZE', rooms: combinedRooms });
    setAllInvites({ type: 'INITIALIZE', invites: invitesList });

  }, [slidingSyncEnabled, slidingSyncRoomList, setAllRooms, setAllInvites]);
};

/**
 * Hook to determine if sliding sync should override traditional sync behavior
 */
export const useShouldUseSlidingSync = () => {
  return useAtomValue(slidingSyncEnabledAtom);
};