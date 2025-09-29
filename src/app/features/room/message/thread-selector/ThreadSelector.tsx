import { Avatar, Box, Icon, Icons, Line, Text } from 'folds';
import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { IThreadBundledRelationship, Room } from 'matrix-js-sdk';
import * as css from './styles.css';
import { UserAvatar } from '../../../../components/user-avatar';
import { getMemberAvatarMxc, getMemberDisplayName } from '../../../../utils/room';
import { useMatrixClient } from '../../../../hooks/useMatrixClient';
import { useMediaAuthentication } from '../../../../hooks/useMediaAuthentication';
import { getMxIdLocalPart, mxcUrlToHttp } from '../../../../utils/matrix';
import { Time } from '../../../../components/message';

export function ThreadSelectorContainer({ children }: { children: ReactNode }) {
  return <Box className={css.ThreadSelectorContainer}>{children}</Box>;
}

type ThreadSelectorProps = {
  room: Room;
  threadDetail: IThreadBundledRelationship;
  outlined?: boolean;
  hour24Clock: boolean;
  dateFormatString: string;
};

export function ThreadSelector({
  room,
  threadDetail,
  outlined,
  hour24Clock,
  dateFormatString,
}: ThreadSelectorProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();

  const latestEvent = threadDetail.latest_event;

  const latestSenderId = latestEvent.sender;
  const latestSenderAvatarMxc = getMemberAvatarMxc(room, latestSenderId);
  const latestDisplayName =
    getMemberDisplayName(room, latestSenderId) ??
    getMxIdLocalPart(latestSenderId) ??
    latestSenderId;

  const latestEventTs = latestEvent.origin_server_ts;

  return (
    <Box
      as="button"
      type="button"
      className={classNames(css.ThreadSelector, outlined && css.ThreadSectorOutlined)}
      alignItems="Center"
      gap="300"
    >
      <Box className={css.ThreadRepliesCount} shrink="No" alignItems="Center" gap="100">
        <Icon size="100" src={Icons.Thread} filled />
        <Text size="L400">
          {threadDetail.count} {threadDetail.count === 1 ? 'Thread Reply' : 'Thread Replies'}
        </Text>
      </Box>
      {latestSenderId && (
        <>
          <Line
            className={css.ThreadSelectorDivider}
            direction="Vertical"
            variant="SurfaceVariant"
          />
          <Box gap="200" alignItems="Inherit">
            <Box gap="100" alignItems="Inherit">
              <Avatar size="200" radii="400">
                <UserAvatar
                  userId={latestSenderId}
                  src={
                    latestSenderAvatarMxc
                      ? mxcUrlToHttp(
                          mx,
                          latestSenderAvatarMxc,
                          useAuthentication,
                          48,
                          48,
                          'crop'
                        ) ?? undefined
                      : undefined
                  }
                  alt={latestSenderId}
                  renderFallback={() => <Icon size="200" src={Icons.User} filled />}
                />
              </Avatar>
            </Box>
            <Text size="T200" truncate>
              <span>
                Latest by <strong>{latestDisplayName}</strong> at{' '}
              </span>
              <Time
                hour24Clock={hour24Clock}
                dateFormatString={dateFormatString}
                ts={latestEventTs}
              />
            </Text>
            <Icon size="100" src={Icons.ChevronRight} />
          </Box>
        </>
      )}
    </Box>
  );
}
