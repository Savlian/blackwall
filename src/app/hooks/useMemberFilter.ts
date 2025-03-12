import { useMemo } from 'react';
import { RoomMember } from 'matrix-js-sdk';
import { ContainerColor } from 'folds';
import { Membership } from '../../types/matrix/room';

export const MembershipFilter = {
  filterJoined: (m: RoomMember) => m.membership === Membership.Join,
  filterInvited: (m: RoomMember) => m.membership === Membership.Invite,
  filterLeaved: (m: RoomMember) =>
    m.membership === Membership.Leave &&
    m.events.member?.getStateKey() === m.events.member?.getSender(),
  filterKicked: (m: RoomMember) =>
    m.membership === Membership.Leave &&
    m.events.member?.getStateKey() !== m.events.member?.getSender(),
  filterBanned: (m: RoomMember) => m.membership === Membership.Ban,
};

export type MembershipFilterFn = (m: RoomMember) => boolean;

export type MembershipFilterItem = {
  name: string;
  filterFn: MembershipFilterFn;
  color: ContainerColor;
};

export const useMembershipFilterMenu = (): MembershipFilterItem[] =>
  useMemo(
    () => [
      {
        name: 'Joined',
        filterFn: MembershipFilter.filterJoined,
        color: 'Background',
      },
      {
        name: 'Invited',
        filterFn: MembershipFilter.filterInvited,
        color: 'Success',
      },
      {
        name: 'Left',
        filterFn: MembershipFilter.filterLeaved,
        color: 'Secondary',
      },
      {
        name: 'Kicked',
        filterFn: MembershipFilter.filterKicked,
        color: 'Warning',
      },
      {
        name: 'Banned',
        filterFn: MembershipFilter.filterBanned,
        color: 'Critical',
      },
    ],
    []
  );

export const useMembershipFilter = (
  index: number,
  membershipFilter: MembershipFilterItem[]
): MembershipFilterItem => {
  const filter = membershipFilter[index] ?? membershipFilter[0];
  return filter;
};
