import { RoomMember } from 'matrix-js-sdk';
import { useCallback, useMemo } from 'react';

export type PowerLevelTag = {
  name: string;
};

export type GetPowerLevelTag = (powerLevel: number) => PowerLevelTag;

export const usePowerLevelTags = (): GetPowerLevelTag => {
  const powerLevelTags = useMemo(
    () => ({
      9000: {
        name: 'Goku',
      },
      101: {
        name: 'Founder',
      },
      100: {
        name: 'Admin',
      },
      50: {
        name: 'Moderator',
      },
      0: {
        name: 'Default',
      },
    }),
    []
  );

  const getTag: GetPowerLevelTag = useCallback(
    (powerLevel) => {
      if (powerLevel >= 9000) return powerLevelTags[9000];
      if (powerLevel >= 101) return powerLevelTags[101];
      if (powerLevel === 100) return powerLevelTags[100];
      if (powerLevel >= 50) return powerLevelTags[50];
      return powerLevelTags[0];
    },
    [powerLevelTags]
  );

  return getTag;
};

export const useFlattenPowerLevelTagMembers = (
  members: RoomMember[],
  getPowerLevel: (userId: string) => number,
  getTag: GetPowerLevelTag
): Array<PowerLevelTag | RoomMember> => {
  const PLTagOrRoomMember = useMemo(() => {
    let prevTag: PowerLevelTag | undefined;
    const tagOrMember: Array<PowerLevelTag | RoomMember> = [];
    members.forEach((member) => {
      const memberPL = getPowerLevel(member.userId);
      const tag = getTag(memberPL);
      if (tag !== prevTag) {
        prevTag = tag;
        tagOrMember.push(tag);
      }
      tagOrMember.push(member);
    });
    return tagOrMember;
  }, [members, getTag, getPowerLevel]);

  return PLTagOrRoomMember;
};
