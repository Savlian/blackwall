import { Room } from 'matrix-js-sdk';
import { useMemo } from 'react';
import { useStateEvent } from './useStateEvent';
import { StateEvent } from '../../types/matrix/room';
import { getRoomCreators } from '../utils/room';

export const useRoomCreators = (room: Room): string[] | undefined => {
  const createEvent = useStateEvent(room, StateEvent.RoomCreate);

  const creators = useMemo(
    () => (createEvent ? getRoomCreators(createEvent) : undefined),
    [createEvent]
  );

  return creators;
};
