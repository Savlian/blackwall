import { useCallback } from 'react';
import { Direction, MatrixEvent, Room, ThreadFilterType } from 'matrix-js-sdk';
import { useMatrixClient } from './useMatrixClient';
import { AsyncStatus, useAsyncCallbackValue } from './useAsyncCallback';

export const useRoomMyThreads = (room: Room): MatrixEvent[] | undefined => {
  const mx = useMatrixClient();

  const [fetchState] = useAsyncCallbackValue(
    useCallback(
      () =>
        mx.createThreadListMessagesRequest(
          room.roomId,
          null,
          30,
          Direction.Backward,
          ThreadFilterType.All
        ),
      [mx, room]
    )
  );

  if (fetchState.status === AsyncStatus.Success) {
    const roomEvents = fetchState.data.chunk;
    const mEvents = roomEvents.map((event) => new MatrixEvent(event)).reverse();
    return mEvents;
  }
  return undefined;
};
