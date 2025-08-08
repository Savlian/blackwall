import { Box, Button, color, config, Icon, Icons, MenuItem, Spinner, Text } from 'folds';
import React, { useCallback } from 'react';
import { useRoom } from '../../hooks/useRoom';
import { SequenceCard } from '../sequence-card';
import { CutoutCard } from '../cutout-card';
import { SettingTile } from '../setting-tile';
import { AsyncStatus, useAsyncCallback } from '../../hooks/useAsyncCallback';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { BreakWord } from '../../styles/Text.css';
import { useSetting } from '../../state/hooks/settings';
import { settingsAtom } from '../../state/settings';
import { timeDayMonYear, timeHourMinute } from '../../utils/time';

type UserBanAlertProps = {
  userId: string;
  reason?: string;
  canUnban?: boolean;
  bannedBy?: string;
  ts?: number;
};
export function UserBanAlert({ userId, reason, canUnban, bannedBy, ts }: UserBanAlertProps) {
  const mx = useMatrixClient();
  const room = useRoom();
  const [hour24Clock] = useSetting(settingsAtom, 'hour24Clock');
  const [dateFormatString] = useSetting(settingsAtom, 'dateFormatString');

  const time = ts ? timeHourMinute(ts, hour24Clock) : undefined;
  const date = ts ? timeDayMonYear(ts, dateFormatString) : undefined;

  const [unbanState, unban] = useAsyncCallback<undefined, Error, []>(
    useCallback(async () => {
      await mx.unban(room.roomId, userId);
    }, [mx, room, userId])
  );
  const banning = unbanState.status === AsyncStatus.Loading;
  const error = unbanState.status === AsyncStatus.Error;

  return (
    <CutoutCard style={{ padding: config.space.S200 }} variant="Critical">
      <SettingTile>
        <Box direction="Column" gap="200">
          <Box gap="200" justifyContent="SpaceBetween">
            <Text size="L400">Banned User</Text>
            {time && date && (
              <Text size="T200">
                {date} {time}
              </Text>
            )}
          </Box>
          <Box direction="Column">
            {bannedBy && (
              <Text size="T200">
                Banned by: <b>{bannedBy}</b>
              </Text>
            )}
            <Text size="T200">
              {reason ? (
                <>
                  Reason: <b>{reason}</b>
                </>
              ) : (
                <i>No Reason Provided.</i>
              )}
            </Text>
          </Box>
          {error && (
            <Text className={BreakWord} size="T200" style={{ color: color.Critical.Main }}>
              <b>{unbanState.error.message}</b>
            </Text>
          )}
          {canUnban && (
            <Button
              size="300"
              variant="Critical"
              radii="300"
              onClick={unban}
              before={banning && <Spinner size="100" variant="Critical" fill="Solid" />}
              disabled={banning}
            >
              <Text size="B300">Unban</Text>
            </Button>
          )}
        </Box>
      </SettingTile>
    </CutoutCard>
  );
}

type UserModerationProps = {
  userId: string;
  canKick: boolean;
  canBan: boolean;
};
export function UserModeration({ userId, canKick, canBan }: UserModerationProps) {
  const room = useRoom();

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Moderation</Text>
      <SequenceCard
        variant="SurfaceVariant"
        style={{ padding: config.space.S100 }}
        direction="Column"
      >
        <MenuItem
          size="400"
          radii="300"
          variant="SurfaceVariant"
          before={<Icon size="100" src={Icons.ArrowGoLeft} />}
          disabled={!canKick}
        >
          <Text size="T300">Kick</Text>
        </MenuItem>
        <MenuItem
          size="400"
          radii="300"
          variant="SurfaceVariant"
          fill="None"
          before={<Icon size="100" src={Icons.NoEntry} />}
          disabled={!canBan}
        >
          <Text size="T300">Ban</Text>
        </MenuItem>
      </SequenceCard>
    </Box>
  );
}
