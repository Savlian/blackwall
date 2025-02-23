import React, { useMemo, useState } from 'react';
import { Box, Icon, IconButton, Icons, Scroll, Text } from 'folds';
import { JoinRule } from 'matrix-js-sdk';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { JoinRulesSelector } from '../../../components/JoinRulesSelector';

function RoomJoinRules() {
  const joinRules: Array<JoinRule> = useMemo(
    () => [JoinRule.Invite, JoinRule.Knock, JoinRule.Restricted, JoinRule.Public],
    []
  );

  const [rule, setRule] = useState(JoinRule.Invite);

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Join Access</Text>
      <JoinRulesSelector rules={joinRules} value={rule} onChange={setRule} />
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
