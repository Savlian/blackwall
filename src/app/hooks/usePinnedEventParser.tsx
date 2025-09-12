import { MatrixEvent } from 'matrix-js-sdk';
import React, { ReactNode } from 'react';
import { IRoomPinnedEventsContent } from '../../types/matrix/room';
import { getMxIdLocalPart } from '../utils/matrix';
import { MessageJumpLink } from '../components/message/MessageJumpLink';

export type PinnedEventParser = (mEvent: MatrixEvent) => ReactNode;

export const usePinnedEventParser = (roomId: string): PinnedEventParser => {
  const pinnedEventParser = (mEvent: MatrixEvent) => {
    const { pinned } = mEvent.getContent<IRoomPinnedEventsContent>();
    const prevPinned = (mEvent.getPrevContent() as Partial<IRoomPinnedEventsContent>).pinned;
    const senderId = mEvent.getSender() ?? '';
    const senderName = getMxIdLocalPart(senderId);

    const addedPins = pinned.filter((pdu) => !(prevPinned?.includes(pdu) ?? false));
    const removedPins = prevPinned?.filter((pdu) => !pinned.includes(pdu)) ?? [];

    return (
      <>
        <b>{senderName}</b>
        {addedPins.length === 0 && removedPins.length === 0 ? (
          ' made no changes to the pinned messages'
        ) : (
          <>
            {addedPins.length > 0 && (
              <>
                {' pinned '}
                <b>
                  {addedPins.length === 1 ? (
                    <MessageJumpLink roomId={roomId} eventId={addedPins[0]} />
                  ) : (
                    `${addedPins.length} messages`
                  )}
                </b>
              </>
            )}
            {addedPins.length > 0 && removedPins.length > 0 && 'and'}
            {removedPins.length > 0 && (
              <>
                {' unpinned '}
                <b>
                  {removedPins.length === 1 ? (
                    <MessageJumpLink roomId={roomId} eventId={removedPins[0]} />
                  ) : (
                    `${removedPins.length} messages`
                  )}
                </b>
              </>
            )}
          </>
        )}
      </>
    );
  };
  return pinnedEventParser;
};
