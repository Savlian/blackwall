import { atom } from 'jotai';

export enum RoomSettingsPage {
  GeneralPage,
  MembersPage,
  EmojisStickersPage,
  PermissionsPage,
  SecurityPage,
}

export type RoomSettingsState = {
  page?: RoomSettingsPage;
  roomId: string;
  spaceId?: string;
};

export const roomSettingsAtom = atom<RoomSettingsState | undefined>(undefined);
