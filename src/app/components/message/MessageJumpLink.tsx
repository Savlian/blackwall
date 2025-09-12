import React from "react";
import { messageJumpLink } from "./MessageJumpLink.css";
import { useRoomNavigate } from "../../hooks/useRoomNavigate";

export function MessageJumpLink({ roomId, eventId }: { roomId: string, eventId: string }) {
  const { navigateRoom } = useRoomNavigate();

  return (
    <button type="button" className={messageJumpLink} onClick={() => navigateRoom(roomId, eventId)}>
      a message
    </button>
  );
}