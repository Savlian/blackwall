import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from 'folds';
import { useAtomValue } from 'jotai';
import { SyncState } from 'matrix-js-sdk';
import { roomToUnreadAtom } from '../../../state/room/roomToUnread';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { useSyncState } from '../../../hooks/useSyncState';
import * as css from './SidebarWidgets.css';

type WeatherTick = {
  flux: number;
  drift: number;
  scatter: number;
};

const createTick = (): WeatherTick => ({
  flux: Math.floor(Math.random() * 48),
  drift: Math.floor(Math.random() * 36),
  scatter: Math.floor(Math.random() * 28),
});

const mapSyncState = (state: SyncState | null | undefined): string => {
  switch (state) {
    case SyncState.Syncing:
    case SyncState.Prepared:
      return 'Signal Locked';
    case SyncState.Catchup:
      return 'Data Surge';
    case SyncState.Reconnecting:
      return 'Reconnect Storm';
    case SyncState.Error:
      return 'Blackout';
    case SyncState.Stopped:
      return 'Signal Halt';
    default:
      return 'Idle Drift';
  }
};

export function SynthWeatherPanel() {
  const mx = useMatrixClient();
  const roomToUnread = useAtomValue(roomToUnreadAtom);
  const [syncState, setSyncState] = useState<SyncState | null>(mx?.getSyncState?.() ?? null);
  const [tick, setTick] = useState<WeatherTick>(() => createTick());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick(createTick());
    }, 6200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mx) return;
    setSyncState(mx.getSyncState?.() ?? null);
  }, [mx]);

  useSyncState(
    mx,
    useCallback((current) => {
      setSyncState(current);
    }, [])
  );

  const aggregates = useMemo(() => {
    let total = 0;
    let highlights = 0;
    roomToUnread.forEach((unread) => {
      if (!unread) return;
      total += unread.total;
      highlights += unread.highlight;
    });
    return { total, highlights };
  }, [roomToUnread]);

  const moodLabel = aggregates.highlights > 0 ? 'Alert Surge' : aggregates.total > 0 ? 'Murmur Field' : 'Clear Sky';
  const syncLabel = mapSyncState(syncState);
  const statusLabel = `${syncLabel} | ${moodLabel}`;

  const signalFlux = Math.min(99, aggregates.total * 6 + tick.flux + (aggregates.highlights > 0 ? 12 : 0));
  const packetDrift = Math.min(99, aggregates.highlights * 9 + tick.drift + (aggregates.total > 4 ? 8 : 2));
  const noiseScatter = Math.min(
    99,
    Math.round(Math.sqrt(aggregates.total + aggregates.highlights) * 12 + tick.scatter)
  );

  return (
    <div className={css.weatherPanel}>
      <div className={css.weatherBackdrop} aria-hidden />
      <div className={css.weatherHeader}>
        <Text as="span" size="T200" weight="600" className={css.weatherTitle}>
          Synth Weather
        </Text>
        <span className={css.weatherStatus}>{statusLabel}</span>
      </div>
      <div className={css.weatherGrid}>
        <div className={css.weatherMetric}>
          <span className={css.metricLabel}>Signal Flux</span>
          <span className={css.metricValue}>{signalFlux.toString().padStart(2, '0')}%</span>
          <span className={css.metricAccent}>{`traffic ${aggregates.total}`}</span>
        </div>
        <div className={css.weatherMetric}>
          <span className={css.metricLabel}>Packet Drift</span>
          <span className={css.metricValue}>{packetDrift.toString().padStart(2, '0')}%</span>
          <span className={css.metricAccent}>{`alerts ${aggregates.highlights}`}</span>
        </div>
        <div className={css.weatherMetric}>
          <span className={css.metricLabel}>Noise Scatter</span>
          <span className={css.metricValue}>{noiseScatter.toString().padStart(2, '0')}%</span>
          <span className={css.metricAccent}>{syncLabel}</span>
        </div>
      </div>
    </div>
  );
}
