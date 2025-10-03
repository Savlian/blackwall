import React, { useMemo } from 'react';
import { Icon, Icons, Text } from 'folds';
import { useAtomValue } from 'jotai';
import { roomToUnreadAtom } from '../../../state/room/roomToUnread';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { MatrixEvent } from 'matrix-js-sdk';
import * as css from './SidebarWidgets.css';

const formatSnippet = (event: MatrixEvent | null | undefined): string => {
  if (!event) return 'no recent signal';
  const content = event.getContent<{ body?: string; formatted_body?: string }>();
  let body = typeof content?.body === 'string' ? content.body : undefined;
  if (!body && typeof content?.formatted_body === 'string') {
    body = content.formatted_body.replace(/<[^>]+>/g, '');
  }
  if (!body || body.trim().length === 0) {
    return event.getType().replace('m.', '').replace('org.matrix.', '');
  }
  const trimmed = body.trim();
  if (trimmed.length <= 64) return trimmed;
  return `${trimmed.slice(0, 61)}…`;
};

const timeAgo = (ts: number | null | undefined): string => {
  if (!ts) return 'just now';
  const delta = Date.now() - ts;
  if (delta < 60_000) return 'now';
  if (delta < 3_600_000) {
    const mins = Math.max(1, Math.floor(delta / 60_000));
    return `${mins}m`;
  }
  if (delta < 86_400_000) {
    const hrs = Math.floor(delta / 3_600_000);
    return `${hrs}h`;
  }
  const days = Math.floor(delta / 86_400_000);
  return `${days}d`;
};

type WhisperEntry = {
  roomId: string;
  name: string;
  snippet: string;
  ts: number | null;
  highlights: number;
  total: number;
};

export function WhisperBacklog() {
  const mx = useMatrixClient();
  const roomToUnread = useAtomValue(roomToUnreadAtom);

  const whispers = useMemo<WhisperEntry[]>(() => {
    if (!mx) return [];
    const draft: WhisperEntry[] = [];
    roomToUnread.forEach((unread, roomId) => {
      if (!unread || unread.total === 0) return;
      const room = mx.getRoom(roomId);
      if (!room || room.isSpaceRoom()) return;
      const lastEvent = room.getLastLiveEvent();
      const entry: WhisperEntry = {
        roomId,
        name: room.name ?? room.getCanonicalAlias() ?? roomId,
        snippet: formatSnippet(lastEvent),
        ts: lastEvent?.getTs() ?? null,
        highlights: unread.highlight,
        total: unread.total,
      };
      draft.push(entry);
    });

    return draft
      .sort((a, b) => {
        if (b.highlights !== a.highlights) return b.highlights - a.highlights;
        if (b.total !== a.total) return b.total - a.total;
        return (b.ts ?? 0) - (a.ts ?? 0);
      })
      .slice(0, 4);
  }, [mx, roomToUnread]);

  return (
    <div className={css.whisperSection}>
      <div className={css.whisperBackdrop} aria-hidden />
      <div className={css.whisperHeader}>
        <Text as="span" size="T200" weight="600" className={css.whisperGlyph}>
          <Icon size="100" src={Icons.Message} />
          Whisper Backlog
        </Text>
        <span className={css.whisperTicker}>
          {whispers.length > 0 ? `${whispers.length} channel${whispers.length > 1 ? 's' : ''} pulsing` : 'channels clear'}
        </span>
      </div>
      <div className={css.whisperList}>
        {whispers.length === 0 && (
          <div className={css.whisperEmpty}>no whispers cached</div>
        )}
        {whispers.map((whisper) => (
          <div key={whisper.roomId} className={css.whisperItem}>
            <Text as="span" size="T200" className={css.whisperRoom} weight="600">
              {whisper.name}
            </Text>
            <Text as="span" size="T100" className={css.whisperSnippet}>
              {whisper.snippet}
            </Text>
            <div className={css.whisperMeta}>
              <span>{timeAgo(whisper.ts)}</span>
              <span>•</span>
              <span>{`echo ${whisper.total}`}</span>
              {whisper.highlights > 0 && <span>{`pulse ${whisper.highlights}`}</span>}
              <span className={css.whisperSignal} aria-hidden>
                <span className={css.whisperSignalBarLow} />
                <span className={css.whisperSignalBarMid} />
                <span className={css.whisperSignalBarHigh} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
