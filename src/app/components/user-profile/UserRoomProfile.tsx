import { Box, Button, color, config, Icon, Icons, MenuItem, Spinner, Text } from 'folds';
import React, { useCallback } from 'react';
import { UserHero, UserHeroName } from './UserHero';
import { getDMRoomFor, getMxIdServer, mxcUrlToHttp } from '../../utils/matrix';
import { getMemberAvatarMxc, getMemberDisplayName } from '../../utils/room';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { useMediaAuthentication } from '../../hooks/useMediaAuthentication';
import { usePowerLevels, usePowerLevelsAPI } from '../../hooks/usePowerLevels';
import { useRoom } from '../../hooks/useRoom';
import { useUserPresence } from '../../hooks/useUserPresence';
import { SequenceCard } from '../sequence-card';
import { MutualRoomsChip, ServerChip } from './UserChips';
import { CutoutCard } from '../cutout-card';
import { SettingTile } from '../setting-tile';
import { AsyncStatus, useAsyncCallback } from '../../hooks/useAsyncCallback';
import { createDM } from '../../../client/action/room';
import { hasDevices } from '../../../util/matrixUtil';
import { useRoomNavigate } from '../../hooks/useRoomNavigate';
import { useAlive } from '../../hooks/useAlive';
import { useCloseUserRoomProfile } from '../../state/hooks/userRoomProfile';
import { PowerChip } from './PowerChip';

type UserBanAlertProps = {
  userId: string;
  reason?: string;
};
function UserBanAlert({ userId, reason }: UserBanAlertProps) {
  return (
    <CutoutCard style={{ padding: config.space.S200 }} variant="Critical">
      <SettingTile
        after={
          <Button size="300" variant="Critical" radii="300">
            <Text size="B300">Unban</Text>
          </Button>
        }
      >
        <Box direction="Column">
          <Text size="L400">Banned User</Text>
          <Text size="T200">This user has been banned!{reason ? ` Reason: ${reason}` : ''}</Text>
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
function UserModeration({ userId, canKick, canBan }: UserModerationProps) {
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

type UserRoomProfileProps = {
  userId: string;
};
export function UserRoomProfile({ userId }: UserRoomProfileProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const { navigateRoom } = useRoomNavigate();
  const alive = useAlive();
  const closeUserRoomProfile = useCloseUserRoomProfile();

  const room = useRoom();
  const powerlevels = usePowerLevels(room);
  const { getPowerLevel, canDoAction } = usePowerLevelsAPI(powerlevels);
  const myPowerLevel = getPowerLevel(mx.getSafeUserId());
  const userPowerLevel = getPowerLevel(userId);
  const canKick = canDoAction('kick', myPowerLevel) && myPowerLevel > userPowerLevel;
  const canBan = canDoAction('ban', myPowerLevel) && myPowerLevel > userPowerLevel;

  const member = room.getMember(userId);

  const server = getMxIdServer(userId);
  const displayName = getMemberDisplayName(room, userId);
  const avatarMxc = getMemberAvatarMxc(room, userId);
  const avatarUrl = (avatarMxc && mxcUrlToHttp(mx, avatarMxc, useAuthentication)) ?? undefined;

  const presence = useUserPresence(userId);

  const [directMessageState, directMessage] = useAsyncCallback<string, Error, []>(
    useCallback(async () => {
      const result = await createDM(mx, userId, await hasDevices(mx, userId));
      return result.room_id as string;
    }, [userId, mx])
  );

  const handleMessage = () => {
    const dmRoomId = getDMRoomFor(mx, userId)?.roomId;
    if (dmRoomId) {
      navigateRoom(dmRoomId);
      closeUserRoomProfile();
      return;
    }
    directMessage().then((rId) => {
      if (alive()) {
        navigateRoom(rId);
        closeUserRoomProfile();
      }
    });
  };

  return (
    <Box direction="Column">
      <UserHero
        userId={userId}
        avatarUrl={avatarUrl}
        presence={presence && presence.lastActiveTs !== 0 ? presence : undefined}
      />
      <Box direction="Column" gap="500" style={{ padding: config.space.S400 }}>
        <Box direction="Column" gap="400">
          <Box gap="400" alignItems="Start">
            <UserHeroName displayName={displayName} userId={userId} />
            <Box shrink="No">
              <Button
                size="300"
                variant="Primary"
                fill="Solid"
                radii="300"
                disabled={directMessageState.status === AsyncStatus.Loading}
                before={
                  directMessageState.status === AsyncStatus.Loading ? (
                    <Spinner size="50" variant="Primary" fill="Solid" />
                  ) : (
                    <Icon size="50" src={Icons.Message} filled />
                  )
                }
                onClick={handleMessage}
              >
                <Text size="B300">Message</Text>
              </Button>
            </Box>
          </Box>
          {directMessageState.status === AsyncStatus.Error && (
            <Text style={{ color: color.Critical.Main }}>
              <b>{directMessageState.error.message}</b>
            </Text>
          )}
          <Box alignItems="Center" gap="200" wrap="Wrap">
            {server && <ServerChip server={server} />}
            <PowerChip userId={userId} />
            <MutualRoomsChip userId={userId} />
          </Box>
        </Box>
        {member?.membership === 'ban' && <UserBanAlert userId={userId} />}
        {(canKick || canBan) && (
          <UserModeration userId={userId} canKick={canKick} canBan={canBan} />
        )}
      </Box>
    </Box>
  );
}
