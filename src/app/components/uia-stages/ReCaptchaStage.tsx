import React from 'react';
import { Text, Box, Button, config } from 'folds';
import { AuthType } from 'matrix-js-sdk';
import ReCAPTCHA from 'react-google-recaptcha';
import { StageComponentProps } from './types';
import { GlitchDialog } from '../blackwall/GlitchDialog';

function ReCaptchaErrorDialog({
  title,
  message,
  onCancel,
}: {
  title: string;
  message: string;
  onCancel: () => void;
}) {
  return (
    <GlitchDialog>
      <Box style={{ padding: config.space.S400 }} direction="Column" gap="400">
        <Box direction="Column" gap="100">
          <Text size="H4">{title}</Text>
          <Text>{message}</Text>
        </Box>
        <Button variant="Critical" fill="None" outlined onClick={onCancel}>
          <Text as="span" size="B400">
            Cancel
          </Text>
        </Button>
      </Box>
    </GlitchDialog>
  );
}

export function ReCaptchaStageDialog({ stageData, submitAuthDict, onCancel }: StageComponentProps) {
  const { info, session } = stageData;

  const publicKey = info?.public_key;

  const handleChange = (token: string | null) => {
    submitAuthDict({
      type: AuthType.Recaptcha,
      response: token,
      session,
    });
  };

  if (typeof publicKey !== 'string' || !session) {
    return (
      <ReCaptchaErrorDialog
        title="Invalid Data"
        message="No valid data found to proceed with ReCAPTCHA."
        onCancel={onCancel}
      />
    );
  }

  return (
    <GlitchDialog>
      <Box style={{ padding: config.space.S400 }} direction="Column" gap="400">
        <Text>Please check the box below to proceed.</Text>
        <ReCAPTCHA sitekey={publicKey} onChange={handleChange} />
      </Box>
    </GlitchDialog>
  );
}
