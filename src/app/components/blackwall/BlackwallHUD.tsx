import React, { useEffect, useState } from 'react';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import * as css from './BlackwallHUD.css';

export function BlackwallHUD(): JSX.Element {
  const mx = useMatrixClient();
  const [roomCount, setRoomCount] = useState(() => (mx ? mx.getRooms().length : 0));

  useEffect(() => {
    if (!mx) return undefined;
    const update = () => setRoomCount(mx.getRooms().length);
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, [mx]);

  const homeserver = (() => {
    if (!mx || !(mx as any).baseUrl) return 'offline';
    try {
      return new URL((mx as any).baseUrl as string).host;
    } catch (error) {
      return (mx as any).baseUrl as string;
    }
  })();

  const syncState = mx?.getSyncState?.()?.toString().toUpperCase() ?? 'IDLE';

  return (
    <div className={css.rightShell} aria-hidden>
      <div className={css.block}>
        <span className={css.label}>Matrix Relay</span>
        <span className={css.value}>{homeserver}</span>
        <span className={css.subValue}>Sync {syncState}</span>
        <span className={css.subValue}>Rooms {roomCount}</span>
      </div>
    </div>
  );
}
