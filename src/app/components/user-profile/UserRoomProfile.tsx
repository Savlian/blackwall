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
  Spinner,
  Text,
} from 'folds';
import React, { MouseEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useMutualRooms, useMutualRoomsSupport } from '../../hooks/useMutualRooms';
import { AsyncStatus } from '../../hooks/useAsyncCallback';
import { stopPropagation } from '../../utils/keyboard';
import { getExploreServerPath } from '../../pages/pathUtils';
import { useCloseUserRoomProfile } from '../../state/hooks/userRoomProfile';
import { copyToClipboard } from '../../../util/common';
import { StateEvent } from '../../../types/matrix/room';
import { useOpenRoomSettings } from '../../state/hooks/roomSettings';
import { RoomSettingsPage } from '../../state/roomSettings';
import { useRoom } from '../../hooks/useRoom';
import { useSpaceOptionally } from '../../hooks/useSpace';

function ServerChip({ server }: { server: string }) {
  const mx = useMatrixClient();
  const myServer = getMxIdServer(mx.getSafeUserId());
  const navigate = useNavigate();
  const closeProfile = useCloseUserRoomProfile();

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
              <MenuItem
                variant="Surface"
                fill="None"
                size="300"
                radii="300"
                onClick={() => {
                  copyToClipboard(server);
                  close();
                }}
              >
                <Text size="B300">Copy Server</Text>
              </MenuItem>
              <MenuItem
                variant="Surface"
                fill="None"
                size="300"
                radii="300"
                onClick={() => {
                  navigate(getExploreServerPath(server));
                  closeProfile();
                }}
              >
                <Text size="B300">Explore Community</Text>
              </MenuItem>
            </div>
            <Line size="300" />
            <div style={{ padding: config.space.S100 }}>
              <MenuItem
                variant={myServer === server ? 'Surface' : 'Critical'}
                fill="None"
                size="300"
                radii="300"
                onClick={() => window.open(`https://${server}`, '_blank')}
              >
                <Text size="B300">Open in Browser</Text>
              </MenuItem>
            </div>
          </Menu>
        </FocusTrap>
      }
    >
      <Chip
        variant={myServer === server ? 'SurfaceVariant' : 'Warning'}
        radii="Pill"
        before={
          cords ? (
            <Icon size="50" src={Icons.ChevronBottom} />
          ) : (
            <Icon size="50" src={Icons.Server} />
          )
        }
        onClick={open}
        aria-pressed={!!cords}
      >
        <Text size="B300" truncate>
          {server}
        </Text>
      </Chip>
    </PopOut>
  );
}

function PowerChip({ userId }: { userId: string }) {
  const mx = useMatrixClient();
  const room = useRoom();
  const space = useSpaceOptionally();
  const useAuthentication = useMediaAuthentication();
  const openRoomSettings = useOpenRoomSettings();

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
                  openRoomSettings(room.roomId, space?.roomId, RoomSettingsPage.PermissionsPage);
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

function MutualRoomsChip({ userId }: { userId: string }) {
  const mx = useMatrixClient();
  const mutualRoomSupported = useMutualRoomsSupport();
  const mutualRoomsState = useMutualRooms(userId);

  if (
    userId === mx.getSafeUserId() ||
    !mutualRoomSupported ||
    mutualRoomsState.status === AsyncStatus.Error
  )
    return null;

  return (
    <Chip
      variant="SurfaceVariant"
      radii="Pill"
      before={mutualRoomsState.status === AsyncStatus.Loading && <Spinner size="50" />}
      disabled={mutualRoomsState.status !== AsyncStatus.Success}
    >
      <Text size="B300">
        {mutualRoomsState.status === AsyncStatus.Success &&
          `${mutualRoomsState.data.length} Mutual Rooms`}
        {mutualRoomsState.status === AsyncStatus.Loading && 'Mutual Rooms'}
      </Text>
    </Chip>
  );
}

type UserRoomProfileProps = {
  userId: string;
};
export function UserRoomProfile({ userId }: UserRoomProfileProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const room = useRoom();

  const server = getMxIdServer(userId);
  const displayName = getMemberDisplayName(room, userId);
  const avatarMxc = getMemberAvatarMxc(room, userId);
  const avatarUrl = (avatarMxc && mxcUrlToHttp(mx, avatarMxc, useAuthentication)) ?? undefined;

  return (
    <Box direction="Column">
      <UserHero userId={userId} avatarUrl={avatarUrl} />
      <Box direction="Column" gap="500" style={{ padding: config.space.S400 }}>
        <Box direction="Column" gap="400">
          <Box gap="400" alignItems="Start">
            <UserHeroName displayName={displayName} userId={userId} />
            <Box shrink="No">
              <Button size="300" variant="Secondary" fill="Solid" radii="300">
                <Text size="B300">View Profile</Text>
              </Button>
            </Box>
          </Box>
          <Box alignItems="Center" gap="200" wrap="Wrap">
            {server && <ServerChip server={server} />}
            <PowerChip userId={userId} />
            <MutualRoomsChip userId={userId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
