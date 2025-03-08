import React, { useMemo } from 'react';
import { Box, Text, Icon, Icons, IconButton, Chip, Scroll, config } from 'folds';
import { MatrixEvent } from 'matrix-js-sdk';
import { Page, PageHeader } from '../../../components/page';
import { SequenceCard } from '../../../components/sequence-card';
import { TextViewerContent } from '../../../components/text-viewer';

const EDITOR_INTENT_SPACE_COUNT = 2;

type StateEventViewProps = {
  eventJSONStr: string;
};
function StateEventView({ eventJSONStr }: StateEventViewProps) {
  return (
    <Box direction="Column" style={{ padding: config.space.S400 }} gap="400">
      <Box grow="Yes" direction="Column" gap="100">
        <Text size="L400">State Event</Text>
        <SequenceCard variant="SurfaceVariant">
          <Scroll visibility="Always" size="300" hideTrack>
            <TextViewerContent
              size="T300"
              style={{
                padding: `${config.space.S300} ${config.space.S100} ${config.space.S300} ${config.space.S300}`,
              }}
              text={eventJSONStr}
              langName="JSON"
            />
          </Scroll>
        </SequenceCard>
      </Box>
    </Box>
  );
}

export type StateEventEditorProps = {
  stateEvent: MatrixEvent;
  requestClose: () => void;
};

export function StateEventEditor({ stateEvent, requestClose }: StateEventEditorProps) {
  const eventJSONStr = useMemo(
    () => JSON.stringify(stateEvent.event, null, EDITOR_INTENT_SPACE_COUNT),
    [stateEvent]
  );

  return (
    <Page>
      <PageHeader outlined={false} balance>
        <Box alignItems="Center" grow="Yes" gap="200">
          <Box alignItems="Inherit" grow="Yes" gap="200">
            <Chip
              size="500"
              radii="Pill"
              onClick={requestClose}
              before={<Icon size="100" src={Icons.ArrowLeft} />}
            >
              <Text size="T300">Developer Tools</Text>
            </Chip>
          </Box>
          <Box shrink="No">
            <IconButton onClick={requestClose} variant="Surface">
              <Icon src={Icons.Cross} />
            </IconButton>
          </Box>
        </Box>
      </PageHeader>
      <Box grow="Yes" direction="Column">
        <StateEventView eventJSONStr={eventJSONStr} />
      </Box>
    </Page>
  );
}
