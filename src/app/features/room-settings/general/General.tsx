import React, { useMemo, useState } from 'react';
import { Box, Icon, IconButton, Icons, Scroll, Text } from 'folds';
import { JoinRule } from 'matrix-js-sdk';
import { Page, PageContent, PageHeader } from '../../../components/page';
import {
  JoinRulesSwitcher,
  useRoomJoinRuleIcon,
  useRoomJoinRuleLabel,
} from '../../../components/JoinRulesSwitcher';
import { SequenceCard } from '../../../components/sequence-card';
import { SettingTile } from '../../../components/setting-tile';
import { SequenceCardStyle } from '../styles.css';

function RoomJoinRules() {
  const joinRules: Array<JoinRule> = useMemo(
    () => [JoinRule.Invite, JoinRule.Knock, JoinRule.Restricted, JoinRule.Public],
    []
  );

  const [rule, setRule] = useState(JoinRule.Invite);
  const icons = useRoomJoinRuleIcon();
  const labels = useRoomJoinRuleLabel();

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Options</Text>
      <SequenceCard
        className={SequenceCardStyle}
        variant="SurfaceVariant"
        direction="Column"
        gap="400"
      >
        <SettingTile
          title="Room Access"
          description="Change how people can join the room."
          after={
            <JoinRulesSwitcher
              icons={icons}
              labels={labels}
              rules={joinRules}
              value={rule}
              onChange={setRule}
            />
          }
        />
      </SequenceCard>
    </Box>
  );
}

type GeneralProps = {
  requestClose: () => void;
};
export function General({ requestClose }: GeneralProps) {
  return (
    <Page>
      <PageHeader outlined={false}>
        <Box grow="Yes" gap="200">
          <Box grow="Yes" alignItems="Center" gap="200">
            <Text size="H3" truncate>
              General
            </Text>
          </Box>
          <Box shrink="No">
            <IconButton onClick={requestClose} variant="Surface">
              <Icon src={Icons.Cross} />
            </IconButton>
          </Box>
        </Box>
      </PageHeader>
      <Box grow="Yes">
        <Scroll hideTrack visibility="Hover">
          <PageContent>
            <Box direction="Column" gap="700">
              <RoomJoinRules />
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
