import { useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { MatrixClient } from 'matrix-js-sdk';
import { SlidingSync, SlidingSyncEvent } from 'matrix-js-sdk/lib/sliding-sync';
import { 
  slidingSyncAtom, 
  slidingSyncStateAtom, 
  slidingSyncEnabledAtom,
  slidingSyncRoomListAtom,
  slidingSyncRoomDataAtom,
  slidingSyncErrorAtom
} from './slidingSync';

export const useBindSlidingSyncAtom = (mx: MatrixClient, slidingSync: SlidingSync | null) => {
  const setSlidingSync = useSetAtom(slidingSyncAtom);
  const setSlidingSyncState = useSetAtom(slidingSyncStateAtom);
  const setSlidingSyncEnabled = useSetAtom(slidingSyncEnabledAtom);
  const setSlidingSyncRoomList = useSetAtom(slidingSyncRoomListAtom);
  const setSlidingSyncRoomData = useSetAtom(slidingSyncRoomDataAtom);
  const setSlidingSyncError = useSetAtom(slidingSyncErrorAtom);

  useEffect(() => {
    if (!slidingSync) {
      setSlidingSyncEnabled(false);
      return;
    }

    setSlidingSync(slidingSync);
    setSlidingSyncEnabled(true);

    const handleSyncUpdate = () => {
      setSlidingSyncState('SYNCING');
      
      // Extract room lists
      const lists: Record<string, string[]> = {};
      slidingSync.getListData().forEach((listData, listKey) => {
        lists[listKey] = listData.joinedRooms || [];
      });
      setSlidingSyncRoomList(lists);

      // Extract room data
      const roomData: Record<string, any> = {};
      slidingSync.getRoomData().forEach((data, roomId) => {
        roomData[roomId] = data;
      });
      setSlidingSyncRoomData(roomData);
    };

    const handleSyncComplete = () => {
      setSlidingSyncState('PREPARED');
      setSlidingSyncError(null);
    };

    const handleSyncError = (error: Error) => {
      setSlidingSyncState('ERROR');
      setSlidingSyncError(error);
    };

    // Bind sliding sync events
    slidingSync.on(SlidingSyncEvent.List, handleSyncUpdate);
    slidingSync.on(SlidingSyncEvent.RoomData, handleSyncUpdate);
    // Note: These event names might need adjustment based on actual SDK events
    slidingSync.on('sync' as any, handleSyncComplete);
    slidingSync.on('error' as any, handleSyncError);

    return () => {
      slidingSync.removeListener(SlidingSyncEvent.List, handleSyncUpdate);
      slidingSync.removeListener(SlidingSyncEvent.RoomData, handleSyncUpdate);
      slidingSync.removeListener('sync' as any, handleSyncComplete);
      slidingSync.removeListener('error' as any, handleSyncError);
    };
  }, [mx, slidingSync, setSlidingSync, setSlidingSyncState, setSlidingSyncEnabled, setSlidingSyncRoomList, setSlidingSyncRoomData, setSlidingSyncError]);
};

export const useSlidingSyncEnabled = () => useAtomValue(slidingSyncEnabledAtom);
export const useSlidingSyncState = () => useAtomValue(slidingSyncStateAtom);
export const useSlidingSyncRoomList = () => useAtomValue(slidingSyncRoomListAtom);
export const useSlidingSyncRoomData = () => useAtomValue(slidingSyncRoomDataAtom);
export const useSlidingSyncError = () => useAtomValue(slidingSyncErrorAtom);