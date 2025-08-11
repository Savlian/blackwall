import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useMemo } from 'react';
import { useStateEvent } from './useStateEvent';
import { IRoomCreateContent, StateEvent } from '../../types/matrix/room';
import { creatorsSupported } from '../utils/matrix';

export const getRoomCreators = (createEvent: MatrixEvent): Set<string> => {
  const createContent = createEvent.getContent<IRoomCreateContent>();

  const creators: Set<string> = new Set();

  if (!creatorsSupported(createContent.room_version)) return creators;

  if (createEvent.event.sender) {
    creators.add(createEvent.event.sender);
  }

  if ('additional_creators' in createContent && Array.isArray(createContent.additional_creators)) {
    createContent.additional_creators.forEach((creator) => {
      if (typeof creator === 'string') {
        creators.add(creator);
      }
    });
  }

  return creators;
};

export const useRoomCreators = (room: Room): Set<string> => {
  const createEvent = useStateEvent(room, StateEvent.RoomCreate);

  const creators = useMemo(
    () => (createEvent ? getRoomCreators(createEvent) : new Set<string>()),
    [createEvent]
  );

  return creators;
};
