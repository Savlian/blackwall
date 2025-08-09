import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useMemo } from 'react';
import { useStateEvent } from './useStateEvent';
import { IRoomCreateContent, StateEvent } from '../../types/matrix/room';

export const getRoomCreators = (createEvent: MatrixEvent): string[] => {
  const createContent = createEvent.getContent<IRoomCreateContent>();

  const creators: Set<string> = new Set();

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

  return Array.from(creators);
};

export const useRoomCreators = (room: Room): string[] => {
  const createEvent = useStateEvent(room, StateEvent.RoomCreate);

  const creators = useMemo(() => (createEvent ? getRoomCreators(createEvent) : []), [createEvent]);

  return creators;
};
