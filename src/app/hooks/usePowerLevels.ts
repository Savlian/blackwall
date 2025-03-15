import { Room } from 'matrix-js-sdk';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useStateEvent } from './useStateEvent';
import { StateEvent } from '../../types/matrix/room';
import { useForceUpdate } from './useForceUpdate';
import { useStateEventCallback } from './useStateEventCallback';
import { useMatrixClient } from './useMatrixClient';
import { getStateEvent } from '../utils/room';

export type PowerLevelActions = 'invite' | 'redact' | 'kick' | 'ban' | 'historical';
export type PowerLevelUsersDefaultKey = 'users_default';
export type PowerLevelNotificationsAction = 'room';

export type IPowerLevels = {
  users_default?: number;
  state_default?: number;
  events_default?: number;
  historical?: number;
  invite?: number;
  redact?: number;
  kick?: number;
  ban?: number;

  events?: Record<string, number>;
  users?: Record<string, number>;
  notifications?: Record<string, number>;
};

const DEFAULT_POWER_LEVELS: Record<
  PowerLevelActions | PowerLevelUsersDefaultKey | 'state_default' | 'events_default',
  number
> & {
  notifications: Record<PowerLevelNotificationsAction, number>;
} = {
  users_default: 0,
  state_default: 50,
  events_default: 0,
  invite: 0,
  redact: 50,
  kick: 50,
  ban: 50,
  historical: 0,
  notifications: {
    room: 50,
  },
};

export function usePowerLevels(room: Room): IPowerLevels {
  const powerLevelsEvent = useStateEvent(room, StateEvent.RoomPowerLevels);
  const powerLevels: IPowerLevels =
    powerLevelsEvent?.getContent<IPowerLevels>() ?? DEFAULT_POWER_LEVELS;

  return powerLevels;
}

export const PowerLevelsContext = createContext<IPowerLevels | null>(null);

export const PowerLevelsContextProvider = PowerLevelsContext.Provider;

export const usePowerLevelsContext = (): IPowerLevels => {
  const pl = useContext(PowerLevelsContext);
  if (!pl) throw new Error('PowerLevelContext is not initialized!');
  return pl;
};

export const useRoomsPowerLevels = (rooms: Room[]): Map<string, IPowerLevels> => {
  const mx = useMatrixClient();
  const [updateCount, forceUpdate] = useForceUpdate();

  useStateEventCallback(
    mx,
    useCallback(
      (event) => {
        const roomId = event.getRoomId();
        if (
          roomId &&
          event.getType() === StateEvent.RoomPowerLevels &&
          event.getStateKey() === '' &&
          rooms.find((r) => r.roomId === roomId)
        ) {
          forceUpdate();
        }
      },
      [rooms, forceUpdate]
    )
  );

  const roomToPowerLevels = useMemo(
    () => {
      const rToPl = new Map<string, IPowerLevels>();

      rooms.forEach((room) => {
        const pl = getStateEvent(room, StateEvent.RoomPowerLevels, '')?.getContent<IPowerLevels>();
        if (pl) rToPl.set(room.roomId, pl);
      });

      return rToPl;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rooms, updateCount]
  );

  return roomToPowerLevels;
};

export type GetPowerLevel = (powerLevels: IPowerLevels, userId: string | undefined) => number;
export type CanSend = (
  powerLevels: IPowerLevels,
  eventType: string | undefined,
  powerLevel: number
) => boolean;
export type CanDoAction = (
  powerLevels: IPowerLevels,
  action: PowerLevelActions,
  powerLevel: number
) => boolean;
export type CanDoNotificationAction = (
  powerLevels: IPowerLevels,
  action: PowerLevelNotificationsAction,
  powerLevel: number
) => boolean;

export type PowerLevelsAPI = {
  getPowerLevel: GetPowerLevel;
  canSendEvent: CanSend;
  canSendStateEvent: CanSend;
  canDoAction: CanDoAction;
  canDoNotificationAction: CanDoNotificationAction;
};

export type ReadPowerLevelAPI = {
  user: GetPowerLevel;
  event: (powerLevels: IPowerLevels, eventType: string | undefined) => number;
  state: (powerLevels: IPowerLevels, eventType: string | undefined) => number;
  action: (powerLevels: IPowerLevels, action: PowerLevelActions) => number;
  notification: (powerLevels: IPowerLevels, action: PowerLevelNotificationsAction) => number;
};

export const readPowerLevel: ReadPowerLevelAPI = {
  user: (powerLevels, userId) => {
    const { users_default: usersDefault, users } = powerLevels;
    if (userId && users && typeof users[userId] === 'number') {
      return users[userId];
    }
    return usersDefault ?? DEFAULT_POWER_LEVELS.users_default;
  },
  event: (powerLevels, eventType) => {
    const { events, events_default: eventsDefault } = powerLevels;
    if (events && eventType && typeof events[eventType] === 'number') {
      return events[eventType];
    }
    return eventsDefault ?? DEFAULT_POWER_LEVELS.events_default;
  },
  state: (powerLevels, eventType) => {
    const { events, state_default: stateDefault } = powerLevels;
    if (events && eventType && typeof events[eventType] === 'number') {
      return events[eventType];
    }
    return stateDefault ?? DEFAULT_POWER_LEVELS.state_default;
  },
  action: (powerLevels, action) => {
    const powerLevel = powerLevels[action];
    if (typeof powerLevel === 'number') {
      return powerLevel;
    }
    return DEFAULT_POWER_LEVELS[action];
  },
  notification: (powerLevels, action) => {
    const powerLevel = powerLevels.notifications?.[action];
    if (typeof powerLevel === 'number') {
      return powerLevel;
    }
    return DEFAULT_POWER_LEVELS.notifications[action];
  },
};

export const powerLevelAPI: PowerLevelsAPI = {
  getPowerLevel: (powerLevels, userId) => readPowerLevel.user(powerLevels, userId),
  canSendEvent: (powerLevels, eventType, powerLevel) => {
    const requiredPL = readPowerLevel.event(powerLevels, eventType);
    return powerLevel >= requiredPL;
  },
  canSendStateEvent: (powerLevels, eventType, powerLevel) => {
    const requiredPL = readPowerLevel.state(powerLevels, eventType);
    return powerLevel >= requiredPL;
  },
  canDoAction: (powerLevels, action, powerLevel) => {
    const requiredPL = readPowerLevel.action(powerLevels, action);
    return powerLevel >= requiredPL;
  },
  canDoNotificationAction: (powerLevels, action, powerLevel) => {
    const requiredPL = readPowerLevel.notification(powerLevels, action);
    return powerLevel >= requiredPL;
  },
};

export const usePowerLevelsAPI = (powerLevels: IPowerLevels) => {
  const getPowerLevel = useCallback(
    (userId: string | undefined) => powerLevelAPI.getPowerLevel(powerLevels, userId),
    [powerLevels]
  );

  const canSendEvent = useCallback(
    (eventType: string | undefined, powerLevel: number) =>
      powerLevelAPI.canSendEvent(powerLevels, eventType, powerLevel),
    [powerLevels]
  );

  const canSendStateEvent = useCallback(
    (eventType: string | undefined, powerLevel: number) =>
      powerLevelAPI.canSendStateEvent(powerLevels, eventType, powerLevel),
    [powerLevels]
  );

  const canDoAction = useCallback(
    (action: PowerLevelActions, powerLevel: number) =>
      powerLevelAPI.canDoAction(powerLevels, action, powerLevel),
    [powerLevels]
  );

  const canDoNotificationAction = useCallback(
    (action: PowerLevelNotificationsAction, powerLevel: number) =>
      powerLevelAPI.canDoNotificationAction(powerLevels, action, powerLevel),
    [powerLevels]
  );

  return {
    getPowerLevel,
    canSendEvent,
    canSendStateEvent,
    canDoAction,
    canDoNotificationAction,
  };
};

/**
 * Permissions
 */

type DefaultPermissionLocation = {
  userDefault: true;
  key: PowerLevelUsersDefaultKey;
};

type ActionPermissionLocation = {
  action: true;
  key: PowerLevelActions;
};

type EventPermissionLocation = {
  state?: true;
  key?: string;
};

type NotificationPermissionLocation = {
  notification: true;
  key: PowerLevelNotificationsAction;
};

export type PermissionLocation =
  | DefaultPermissionLocation
  | ActionPermissionLocation
  | EventPermissionLocation
  | NotificationPermissionLocation;

export const getPermissionPower = (
  powerLevels: IPowerLevels,
  location: PermissionLocation
): number => {
  if ('userDefault' in location) {
    return readPowerLevel.user(powerLevels, undefined);
  }
  if ('action' in location) {
    return readPowerLevel.action(powerLevels, location.key);
  }
  if ('notification' in location) {
    return readPowerLevel.notification(powerLevels, location.key);
  }
  if ('state' in location) {
    return readPowerLevel.state(powerLevels, location.key);
  }

  return readPowerLevel.event(powerLevels, location.key);
};

export const applyPermissionPower = (
  powerLevels: IPowerLevels,
  location: PermissionLocation,
  power: number
): IPowerLevels => {
  if ('userDefault' in location) {
    // eslint-disable-next-line no-param-reassign
    powerLevels.users_default = power;
    return powerLevels;
  }
  if ('action' in location) {
    // eslint-disable-next-line no-param-reassign
    powerLevels[location.key] = power;
    return powerLevels;
  }
  if ('notification' in location) {
    const notifications = powerLevels.notifications ?? {};
    notifications[location.key] = power;
    // eslint-disable-next-line no-param-reassign
    powerLevels.notifications = notifications;
    return powerLevels;
  }
  if ('state' in location) {
    if (location.key) {
      const events = powerLevels.events ?? {};
      events[location.key] = power;
      // eslint-disable-next-line no-param-reassign
      powerLevels.events = events;
      return powerLevels;
    }
    // eslint-disable-next-line no-param-reassign
    powerLevels.state_default = power;
    return powerLevels;
  }

  if (location.key) {
    const events = powerLevels.events ?? {};
    events[location.key] = power;
    // eslint-disable-next-line no-param-reassign
    powerLevels.events = events;
    return powerLevels;
  }
  // eslint-disable-next-line no-param-reassign
  powerLevels.events_default = power;
  return powerLevels;
};
