import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { CryptoApi } from 'matrix-js-sdk/lib/crypto-api';
import { Badge, Box, Chip, color, percent, ProgressBar, Spinner, Text } from 'folds';
import { BackupProgressStatus, backupRestoreProgressAtom } from '../state/backupRestore';
import { InfoCard } from './info-card';
import { AsyncStatus, useAsyncCallback, useAsyncCallbackValue } from '../hooks/useAsyncCallback';

type BackupRestoreTileProps = {
  crypto: CryptoApi;
};
export function BackupRestoreTile({ crypto }: BackupRestoreTileProps) {
  const [restoreProgress, setRestoreProgress] = useAtom(backupRestoreProgressAtom);

  const [backupInfo] = useAsyncCallbackValue(
    useCallback(() => crypto.getKeyBackupInfo(), [crypto])
  );

  const [activeBackup, recheckActiveBackup] = useAsyncCallbackValue(
    useCallback(() => crypto.getActiveSessionBackupVersion(), [crypto])
  );

  const [restoreState, restoreBackup] = useAsyncCallback(
    useCallback(async () => {
      await crypto.restoreKeyBackup({
        progressCallback(progress) {
          setRestoreProgress(progress);
        },
      });
    }, [crypto, setRestoreProgress])
  );

  const [startState, startActiveBackup] = useAsyncCallback(
    useCallback(async () => {
      await crypto.checkKeyBackupAndEnable();
      await recheckActiveBackup();
    }, [crypto, recheckActiveBackup])
  );

  const running =
    restoreState.status === AsyncStatus.Loading ||
    startState.status === AsyncStatus.Loading ||
    restoreProgress.status === BackupProgressStatus.Fetching ||
    restoreProgress.status === BackupProgressStatus.Loading;

  const hasInfo = backupInfo.status === AsyncStatus.Success;
  const isBackupActive =
    activeBackup.status === AsyncStatus.Success ? activeBackup.data !== null : false;

  return (
    <InfoCard
      variant="Surface"
      title="Encryption Backup"
      description={
        <Box as="span" gap="200" alignItems="Center" wrap="Wrap">
          <Box as="span" gap="100" alignItems="Center">
            <Badge
              variant={isBackupActive ? 'Success' : 'Critical'}
              fill="Solid"
              size="200"
              radii="Pill"
            />
            <Text
              size="L400"
              style={{ color: isBackupActive ? color.Success.Main : color.Critical.Main }}
            >
              {isBackupActive ? 'Active' : 'Stopped'}
            </Text>
          </Box>
          <span>version: {hasInfo ? backupInfo.data?.version : 'NIL'},</span>
          <span>Keys: {hasInfo ? backupInfo.data?.count : 'NIL'}</span>
        </Box>
      }
      after={
        <Box gap="200">
          {!isBackupActive && (
            <Chip
              variant="Success"
              radii="Pill"
              outlined
              disabled={running}
              onClick={startActiveBackup}
            >
              <Text as="span" size="B300">
                Start
              </Text>
            </Chip>
          )}
          <Chip
            variant="Secondary"
            radii="Pill"
            onClick={restoreBackup}
            disabled={running}
            before={running && <Spinner size="100" variant="Secondary" fill="Soft" />}
          >
            <Text as="span" size="B300">
              Restore
            </Text>
          </Chip>
        </Box>
      }
    >
      {restoreProgress.status === BackupProgressStatus.Loading && (
        <Box grow="Yes" gap="200" alignItems="Center">
          <Badge variant="Secondary" fill="Solid" radii="Pill">
            <Text size="L400">{`${Math.round(
              percent(0, restoreProgress.data.total, restoreProgress.data.downloaded)
            )}%`}</Text>
          </Badge>
          <Box grow="Yes" direction="Column">
            <ProgressBar
              variant="Secondary"
              size="300"
              min={0}
              max={restoreProgress.data.total}
              value={restoreProgress.data.downloaded}
            />
          </Box>
          <Badge variant="Secondary" fill="Soft" radii="Pill">
            <Text size="L400">
              {restoreProgress.data.downloaded} / {restoreProgress.data.total}
            </Text>
          </Badge>
        </Box>
      )}
    </InfoCard>
  );
}
