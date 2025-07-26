import {
  Box,
  Button,
  Chip,
  config,
  Icon,
  Icons,
  Line,
  Menu,
  MenuItem,
  PopOut,
  RectCords,
  Text,
} from 'folds';
import React, { MouseEventHandler, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { isKeyHotkey } from 'is-hotkey';
import { UserHero, UserHeroName } from './UserHero';
import { getMxIdServer, mxcUrlToHttp } from '../../utils/matrix';
import { getMemberAvatarMxc, getMemberDisplayName } from '../../utils/room';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { useMediaAuthentication } from '../../hooks/useMediaAuthentication';
import { PowerColorBadge, PowerIcon } from '../power';
import { usePowerLevels, usePowerLevelsAPI } from '../../hooks/usePowerLevels';
import { getPowers, getTagIconSrc, usePowerLevelTags } from '../../hooks/usePowerLevelTags';
import { stopPropagation } from '../../utils/keyboard';
import { StateEvent } from '../../../types/matrix/room';
import { useOpenRoomSettings } from '../../state/hooks/roomSettings';
import { RoomSettingsPage } from '../../state/roomSettings';
import { useRoom } from '../../hooks/useRoom';
import { useSpaceOptionally } from '../../hooks/useSpace';
import { useUserPresence } from '../../hooks/useUserPresence';
import { SequenceCard } from '../sequence-card';
import { MutualRoomsChip, ServerChip } from './UserChips';
import { CutoutCard } from '../cutout-card';
import { SettingTile } from '../setting-tile';
import { useOpenSpaceSettings } from '../../state/hooks/spaceSettings';
import { SpaceSettingsPage } from '../../state/spaceSettings';

function PowerChip({ userId }: { userId: string }) {
  const mx = useMatrixClient();
  const room = useRoom();
  const space = useSpaceOptionally();
  const useAuthentication = useMediaAuthentication();
  const openRoomSettings = useOpenRoomSettings();
  const openSpaceSettings = useOpenSpaceSettings();

  const powerLevels = usePowerLevels(room);
  const { getPowerLevel, canSendStateEvent } = usePowerLevelsAPI(powerLevels);
  const [powerLevelTags, getPowerLevelTag] = usePowerLevelTags(room, powerLevels);
  const myPower = getPowerLevel(mx.getSafeUserId());
  const canChangePowers = canSendStateEvent(StateEvent.RoomPowerLevels, myPower);

  const userPower = getPowerLevel(userId);
  const tag = getPowerLevelTag(userPower);
  const tagIconSrc = tag.icon && getTagIconSrc(mx, useAuthentication, tag.icon);

  const [cords, setCords] = useState<RectCords>();

  const open: MouseEventHandler<HTMLButtonElement> = (evt) => {
    setCords(evt.currentTarget.getBoundingClientRect());
  };

  const close = () => setCords(undefined);

  return (
    <PopOut
      anchor={cords}
      position="Bottom"
      align="Start"
      offset={4}
      content={
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            onDeactivate: close,
            clickOutsideDeactivates: true,
            escapeDeactivates: stopPropagation,
            isKeyForward: (evt: KeyboardEvent) => isKeyHotkey('arrowdown', evt),
            isKeyBackward: (evt: KeyboardEvent) => isKeyHotkey('arrowup', evt),
          }}
        >
          <Menu>
            <div style={{ padding: config.space.S100 }}>
              {getPowers(powerLevelTags).map((power) => {
                const powerTag = powerLevelTags[power];
                const powerTagIconSrc =
                  powerTag.icon && getTagIconSrc(mx, useAuthentication, powerTag.icon);

                return (
                  <MenuItem
                    key={power}
                    variant="Surface"
                    fill="None"
                    size="300"
                    radii="300"
                    aria-disabled={!canChangePowers}
                    aria-pressed={userPower === power}
                    before={<PowerColorBadge color={powerTag.color} />}
                    after={
                      powerTagIconSrc ? (
                        <PowerIcon size="50" iconSrc={powerTagIconSrc} />
                      ) : undefined
                    }
                    onClick={canChangePowers ? undefined : undefined}
                  >
                    <Text size="B300">{powerTag.name}</Text>
                  </MenuItem>
                );
              })}
            </div>

            <Line size="300" />
            <div style={{ padding: config.space.S100 }}>
              <MenuItem
                variant="Surface"
                fill="None"
                size="300"
                radii="300"
                onClick={() => {
                  console.log(room.roomId, space?.roomId);
                  if (room.isSpaceRoom()) {
                    openSpaceSettings(
                      room.roomId,
                      space?.roomId,
                      SpaceSettingsPage.PermissionsPage
                    );
                  } else {
                    openRoomSettings(room.roomId, space?.roomId, RoomSettingsPage.PermissionsPage);
                  }
                  close();
                }}
              >
                <Text size="B300">Manage Powers</Text>
              </MenuItem>
            </div>
          </Menu>
        </FocusTrap>
      }
    >
      <Chip
        variant="SurfaceVariant"
        radii="Pill"
        before={
          cords ? (
            <Icon size="50" src={Icons.ChevronBottom} />
          ) : (
            <PowerColorBadge color={tag.color} />
          )
        }
        after={tagIconSrc ? <PowerIcon size="50" iconSrc={tagIconSrc} /> : undefined}
        onClick={open}
        aria-pressed={!!cords}
      >
        <Text size="B300" truncate>
          {tag.name}
        </Text>
      </Chip>
    </PopOut>
  );
}

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
                variant="Secondary"
                fill="Solid"
                radii="300"
                before={<Icon size="50" src={Icons.User} filled />}
              >
                <Text size="B300">Profile</Text>
              </Button>
            </Box>
          </Box>
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
