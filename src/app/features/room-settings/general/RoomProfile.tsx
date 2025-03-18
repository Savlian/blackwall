import { Avatar, Box, Chip, Icon, Icons, Text } from 'folds';
import React from 'react';
import { useAtomValue } from 'jotai';
import Linkify from 'linkify-react';
import classNames from 'classnames';
import { JoinRule } from 'matrix-js-sdk';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { useRoom } from '../../../hooks/useRoom';
import {
  useRoomAvatar,
  useRoomJoinRule,
  useRoomName,
  useRoomTopic,
} from '../../../hooks/useRoomMeta';
import { mDirectAtom } from '../../../state/mDirectList';
import { BreakWord, LineClamp3 } from '../../../styles/Text.css';
import { LINKIFY_OPTS } from '../../../plugins/react-custom-html-parser';
import { RoomAvatar, RoomIcon } from '../../../components/room-avatar';
import { mxcUrlToHttp } from '../../../utils/matrix';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import { IPowerLevels, usePowerLevelsAPI } from '../../../hooks/usePowerLevels';
import { StateEvent } from '../../../../types/matrix/room';

type RoomProfileProps = {
  powerLevels: IPowerLevels;
};
export function RoomProfile({ powerLevels }: RoomProfileProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const room = useRoom();
  const directs = useAtomValue(mDirectAtom);
  const { getPowerLevel, canSendStateEvent } = usePowerLevelsAPI(powerLevels);
  const userPowerLevel = getPowerLevel(mx.getSafeUserId());

  const avatar = useRoomAvatar(room, directs.has(room.roomId));
  const name = useRoomName(room);
  const topic = useRoomTopic(room);
  const joinRule = useRoomJoinRule(room);

  const canEditAvatar = canSendStateEvent(StateEvent.RoomAvatar, userPowerLevel);
  const canEditName = canSendStateEvent(StateEvent.RoomName, userPowerLevel);
  const canEditTopic = canSendStateEvent(StateEvent.RoomTopic, userPowerLevel);
  const canEdit = canEditAvatar || canEditName || canEditTopic;

  const avatarUrl = avatar
    ? mxcUrlToHttp(mx, avatar, useAuthentication, 96, 96, 'crop') ?? undefined
    : undefined;

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Profile</Text>
      <SequenceCard
        className={SequenceCardStyle}
        variant="SurfaceVariant"
        direction="Column"
        gap="400"
      >
        <Box gap="400">
          <Box grow="Yes" direction="Column" gap="300">
            <Box direction="Column" gap="100">
              <Text className={BreakWord} size="H5">
                {name ?? 'Unknown'}
              </Text>
              {topic && (
                <Text className={classNames(BreakWord, LineClamp3)} size="T200">
                  <Linkify options={LINKIFY_OPTS}>{topic}</Linkify>
                </Text>
              )}
            </Box>
            {canEdit && (
              <Box gap="200">
                <Chip
                  variant="Secondary"
                  fill="Soft"
                  radii="300"
                  before={<Icon size="50" src={Icons.Pencil} />}
                  // onClick={onEdit}
                  outlined
                >
                  <Text size="B300">Edit</Text>
                </Chip>
              </Box>
            )}
          </Box>
          <Box shrink="No">
            <Avatar size="500" radii="300">
              <RoomAvatar
                roomId={room.roomId}
                src={avatarUrl}
                alt={name}
                renderFallback={() => (
                  <RoomIcon size="50" joinRule={joinRule?.join_rule ?? JoinRule.Invite} filled />
                )}
              />
            </Avatar>
          </Box>
        </Box>
      </SequenceCard>
    </Box>
  );
}
