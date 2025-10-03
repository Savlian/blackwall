import React, { useEffect, useState } from 'react';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import * as css from './RoomChrono.css';

const formatClock = () =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

export function RoomChrono(): JSX.Element {
  const mx = useMatrixClient();
  const [clock, setClock] = useState(() => formatClock());

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(formatClock());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const syncState = mx?.getSyncState?.()?.toString().toUpperCase() ?? 'IDLE';

  return (
    <div className={css.chrono} aria-hidden>
      <span className={css.label}>Chrono</span>
      <span className={css.value}>{clock}</span>
      <span className={css.subValue}>Sync {syncState}</span>
    </div>
  );
}
