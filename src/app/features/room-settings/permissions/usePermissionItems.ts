import { useMemo } from 'react';
import {
  PowerLevelNotificationsAction,
  PowerLevelActions,
  PowerLevelUsersDefaultKey,
} from '../../../hooks/usePowerLevels';
import { MessageEvent, StateEvent } from '../../../../types/matrix/room';

type PermissionItemOverview = {
  name: string;
  description?: string;
};

type DefaultPermissionItem = PermissionItemOverview & {
  userDefault: true;
  key: PowerLevelUsersDefaultKey;
};

type ActionPermissionItem = PermissionItemOverview & {
  action: true;
  key: PowerLevelActions;
};

type EventsPermissionItem = PermissionItemOverview & {
  state?: true;
  key?: string;
};

type NotificationsPermissionItem = PermissionItemOverview & {
  notifications: true;
  key: PowerLevelNotificationsAction;
};

type PermissionItem =
  | DefaultPermissionItem
  | ActionPermissionItem
  | EventsPermissionItem
  | NotificationsPermissionItem;

type PermissionGroup = {
  name: string;
  items: PermissionItem[];
};

export const usePermissionGroups = (): PermissionGroup[] => {
  const groups: PermissionGroup[] = useMemo(() => {
    const messagesGroup: PermissionGroup = {
      name: 'Messages',
      items: [
        {
          userDefault: true,
          key: 'users_default',
          name: 'Users Default',
          description: 'Default power level for all members',
        },
        {
          key: MessageEvent.RoomMessage,
          name: 'Send Messages',
          // description: 'Minimum power level required to send messages.',
        },
        // {
        //   key: MessageEvent.RoomMessageEncrypted,
        //   name: 'Send Encrypted Messages',
        //   description: 'Minimum power level required to send encrypted messages.',
        // },
        {
          key: MessageEvent.Sticker,
          name: 'Send Stickers',
          // description: 'Minimum power level required to send sticker messages.',
        },
        {
          key: MessageEvent.Reaction,
          name: 'Send Reactions',
          // description: 'Minimum power level required to send message reactions.',
        },
        {
          notifications: true,
          key: 'room',
          name: 'Ping @room',
          // description: 'Minimum power level required to ping all room members.',
        },
        {
          state: true,
          key: StateEvent.RoomPinnedEvents,
          name: 'Pin Messages',
          // description: 'Minimum power level required to pin or unpin messages.',
        },
        {
          name: 'Other Message Events',
          // description: 'Minimum power level required to send all other Messages.',
        },
      ],
    };

    const moderationGroup: PermissionGroup = {
      name: 'Moderation',
      items: [
        {
          action: true,
          key: 'invite',
          name: 'Invite',
          // description: 'Minimum power level required to invite members.',
        },
        {
          action: true,
          key: 'kick',
          name: 'Kick',
          // description: 'Minimum power level required to kick members.',
        },
        {
          action: true,
          key: 'ban',
          name: 'Ban',
          // description: 'Minimum power level required to ban members.',
        },
        {
          action: true,
          key: 'redact',
          name: 'Delete Others Messages',
          // description: 'Minimum power level required to delete others messages.',
        },
        {
          key: MessageEvent.RoomRedaction,
          name: 'Delete Self Messages',
          // description: 'Minimum power level required to delete own messages.',
        },
      ],
    };

    const roomOverviewGroup: PermissionGroup = {
      name: 'Room Overview',
      items: [
        {
          state: true,
          key: StateEvent.RoomAvatar,
          name: 'Room Avatar',
          // description: 'Minimum power level required to change room avatar.',
        },
        {
          state: true,
          key: StateEvent.RoomName,
          name: 'Room Name',
          // description: 'Minimum power level required to change room name.',
        },
        {
          state: true,
          key: StateEvent.RoomTopic,
          name: 'Room Topic',
          // description: 'Minimum power level required to change room topic.',
        },
      ],
    };

    const roomSettingsGroup: PermissionGroup = {
      name: 'Settings',
      items: [
        {
          state: true,
          key: StateEvent.RoomJoinRules,
          name: 'Change Room Access',
          // description: 'Minimum power level required to change room access setting.',
        },
        {
          state: true,
          key: StateEvent.RoomCanonicalAlias,
          name: 'Publish Address',
          // description: 'Minimum power level required to change published room address.',
        },
        {
          state: true,
          key: StateEvent.RoomPowerLevels,
          name: 'Change All Permission',
          // description: 'Minimum power level required to change all room permissions.',
        },
        {
          state: true,
          key: StateEvent.PowerLevelTags,
          name: 'Edit Power Levels',
          // description: 'Minimum power level required to edit power levels.',
        },
        {
          state: true,
          key: StateEvent.RoomEncryption,
          name: 'Enable Encryption',
          // description: 'Minimum power level required to enable rom encryptions.',
        },
        {
          state: true,
          key: StateEvent.RoomHistoryVisibility,
          name: 'History Visibility',
          // description: 'Minimum power level required to change messages history setting.',
        },
        {
          state: true,
          key: StateEvent.RoomTombstone,
          name: 'Upgrade Room',
          // description: 'Minimum power level required to upgrade room.',
        },
        {
          state: true,
          name: 'Other Settings',
          // description: 'Minimum power level required to change all other settings.',
        },
      ],
    };

    const otherSettingsGroup: PermissionGroup = {
      name: 'Other',
      items: [
        {
          state: true,
          key: StateEvent.RoomServerAcl,
          name: 'Change Server ACLs',
          // description: 'Minimum power level required to change server ACLs.',
        },
        {
          state: true,
          key: 'im.vector.modular.widgets',
          name: 'Modify Widgets',
          // description: 'Minimum power level required to change server ACLs.',
        },
      ],
    };

    return [
      messagesGroup,
      moderationGroup,
      roomOverviewGroup,
      roomSettingsGroup,
      otherSettingsGroup,
    ];
  }, []);

  return groups;
};
