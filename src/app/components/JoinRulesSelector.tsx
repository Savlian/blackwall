import React, { CSSProperties, useMemo } from 'react';
import { config, Box, MenuItem, Text, Icon, Icons, IconSrc } from 'folds';
import { JoinRule } from 'matrix-js-sdk';
import { SequenceCard } from './sequence-card';

const CardStyles: CSSProperties = {
  padding: config.space.S200,
  // paddingBottom: config.space.S200,
};

const useRoomJoinRuleIcon = (): Record<JoinRule, IconSrc> =>
  useMemo(
    () => ({
      [JoinRule.Invite]: Icons.HashLock,
      [JoinRule.Knock]: Icons.HashLock,
      [JoinRule.Restricted]: Icons.Hash,
      [JoinRule.Public]: Icons.HashGlobe,
      [JoinRule.Private]: Icons.HashLock,
    }),
    []
  );

const useRoomJoinRuleLabel = (): Record<JoinRule, string> =>
  useMemo(
    () => ({
      [JoinRule.Invite]: 'Invite Required',
      [JoinRule.Knock]: 'Knock to Join',
      [JoinRule.Restricted]: 'Space Members',
      [JoinRule.Public]: 'Public Joinable',
      [JoinRule.Private]: 'Invite Required',
    }),
    []
  );

type JoinRulesSelectorProps<T extends JoinRule[]> = {
  rules: T;
  value: T[number];
  onChange: (value: T[number]) => void;
  disabled?: boolean;
};

export function JoinRulesSelector<T extends JoinRule[]>({
  rules,
  value,
  onChange,
  disabled,
}: JoinRulesSelectorProps<T>) {
  const icons = useRoomJoinRuleIcon();
  const labels = useRoomJoinRuleLabel();

  return (
    <SequenceCard style={CardStyles} variant="SurfaceVariant" direction="Column" gap="400">
      <Box direction="Column" gap="0">
        {rules.map((rule) => (
          <MenuItem
            key={rule}
            size="400"
            variant="SurfaceVariant"
            fill="None"
            radii="300"
            aria-pressed={value === rule}
            onClick={() => onChange(rule)}
            before={<Icon size="100" src={icons[rule]} />}
            disabled={disabled}
          >
            <Box grow="Yes">
              <Text
                style={{
                  fontWeight: value === rule ? config.fontWeight.W600 : undefined,
                }}
                size="T300"
              >
                {labels[rule]}
              </Text>
            </Box>
          </MenuItem>
        ))}
      </Box>
    </SequenceCard>
  );
}
