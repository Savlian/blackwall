import React from 'react';
import {
  Box,
  Icon,
  IconButton,
  Icons,
  Text,
} from 'folds';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { SequenceCard } from '../../../components/sequence-card';
import { SettingTile } from '../../../components/setting-tile';
import { SequenceCardStyle } from '../styles.css';
import { useClientConfig } from '../../../hooks/useClientConfig';

type SlidingSyncSettingsProps = {
  requestClose: () => void;
};

export function SlidingSyncSettings({ requestClose }: SlidingSyncSettingsProps) {
  const clientConfig = useClientConfig();

  return (
    <Page>
      <PageHeader outlined={false}>
        <Box grow="Yes" gap="200">
          <Box grow="Yes" alignItems="Center" gap="200">
            <Text size="H3" truncate>
              Sliding Sync
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
        <PageContent>
          <Box direction="Column" gap="700">
            
            {/* Status Section */}
            <Box direction="Column" gap="100">
              <Text size="L400">Status</Text>
              <SequenceCard className={SequenceCardStyle} variant="SurfaceVariant" direction="Column">
                <SettingTile
                  title="Current Status"
                  description="Sliding sync is currently disabled in configuration"
                  after={
                    <Text size="B300">
                      {clientConfig.slidingSync?.enabled ? 'Enabled' : 'Disabled'}
                    </Text>
                  }
                />
              </SequenceCard>
            </Box>

            {/* Configuration Section */}
            <Box direction="Column" gap="100">
              <Text size="L400">Configuration</Text>
              
              <SequenceCard className={SequenceCardStyle} variant="SurfaceVariant" direction="Column">
                <SettingTile
                  title="Proxy URL"
                  description={clientConfig.slidingSync?.proxyUrl || 'Not configured'}
                />
              </SequenceCard>
            </Box>

            {/* Info Section */}
            <Box direction="Column" gap="100">
              <Text size="L400">Information</Text>
              <SequenceCard className={SequenceCardStyle} variant="SurfaceVariant" direction="Column">
                <SettingTile
                  title="About Sliding Sync"
                  description="Sliding sync is a more efficient synchronization protocol that provides better performance, especially for large accounts. It requires a compatible proxy server and homeserver."
                />
              </SequenceCard>

              {!clientConfig.slidingSync?.enabled && (
                <SequenceCard className={SequenceCardStyle} variant="Warning" direction="Column">
                  <SettingTile
                    title="Configuration Required"
                    description="To enable sliding sync, you need to edit config.json and set slidingSync.enabled to true and provide a valid proxy URL. Restart the application after making changes."
                  />
                </SequenceCard>
              )}
            </Box>

          </Box>
        </PageContent>
      </Box>
    </Page>
  );
}