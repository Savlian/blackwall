import { MatrixClient, SyncState } from 'matrix-js-sdk';
import React, { useCallback, useState } from 'react';
import { Box, config, Line, Text } from 'folds';
import { useSyncState } from '../../hooks/useSyncState';
import { ContainerColor } from '../../styles/ContainerColor.css';
import { useSlidingSyncEnabled, useSlidingSyncState, useSlidingSyncError } from '../../state/sliding-sync';

type StateData = {
  current: SyncState | null;
  previous: SyncState | null | undefined;
};

type SyncStatusProps = {
  mx: MatrixClient;
};
export function SyncStatus({ mx }: SyncStatusProps) {
  const [stateData, setStateData] = useState<StateData>({
    current: null,
    previous: undefined,
  });

  const slidingSyncEnabled = useSlidingSyncEnabled();
  const slidingSyncState = useSlidingSyncState();
  const slidingSyncError = useSlidingSyncError();

  useSyncState(
    mx,
    useCallback((current, previous) => {
      setStateData((s) => {
        if (s.current === current && s.previous === previous) {
          return s;
        }
        return { current, previous };
      });
    }, [])
  );

  // Handle sliding sync status if enabled
  if (slidingSyncEnabled) {
    if (slidingSyncError) {
      return (
        <Box direction="Column" shrink="No">
          <Box
            className={ContainerColor({ variant: 'Critical' })}
            style={{ padding: `${config.space.S100} 0` }}
            alignItems="Center"
            justifyContent="Center"
          >
            <Text size="L400">Sliding Sync Error!</Text>
          </Box>
          <Line variant="Critical" size="300" />
        </Box>
      );
    }

    if (slidingSyncState === 'SYNCING') {
      return (
        <Box direction="Column" shrink="No">
          <Box
            className={ContainerColor({ variant: 'Primary' })}
            style={{ padding: `${config.space.S100} 0` }}
            alignItems="Center"
            justifyContent="Center"
          >
            <Text size="L400">Sliding Sync Active...</Text>
          </Box>
          <Line variant="Primary" size="300" />
        </Box>
      );
    }

    // Don't show traditional sync status when sliding sync is active
    return null;
  }

  // Traditional sync status handling
  if (
    (stateData.current === SyncState.Prepared ||
      stateData.current === SyncState.Syncing ||
      stateData.current === SyncState.Catchup) &&
    stateData.previous !== SyncState.Syncing
  ) {
    return (
      <Box direction="Column" shrink="No">
        <Box
          className={ContainerColor({ variant: 'Success' })}
          style={{ padding: `${config.space.S100} 0` }}
          alignItems="Center"
          justifyContent="Center"
        >
          <Text size="L400">Connecting...</Text>
        </Box>
        <Line variant="Success" size="300" />
      </Box>
    );
  }

  if (stateData.current === SyncState.Reconnecting) {
    return (
      <Box direction="Column" shrink="No">
        <Box
          className={ContainerColor({ variant: 'Warning' })}
          style={{ padding: `${config.space.S100} 0` }}
          alignItems="Center"
          justifyContent="Center"
        >
          <Text size="L400">Connection Lost! Reconnecting...</Text>
        </Box>
        <Line variant="Warning" size="300" />
      </Box>
    );
  }

  if (stateData.current === SyncState.Error) {
    return (
      <Box direction="Column" shrink="No">
        <Box
          className={ContainerColor({ variant: 'Critical' })}
          style={{ padding: `${config.space.S100} 0` }}
          alignItems="Center"
          justifyContent="Center"
        >
          <Text size="L400">Connection Lost!</Text>
        </Box>
        <Line variant="Critical" size="300" />
      </Box>
    );
  }

  return null;
}
