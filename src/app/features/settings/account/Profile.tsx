import React, { ChangeEventHandler, ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Text,
  IconButton,
  Icon,
  Icons,
  Input,
  Button,
  Overlay,
  OverlayBackdrop,
  OverlayCenter,
  Modal,
  config,
  Spinner,
} from 'folds';
import FocusTrap from 'focus-trap-react';
import { UserEvent } from 'matrix-js-sdk';
import { SequenceCard } from '../../../components/sequence-card';
import { SettingTile } from '../../../components/setting-tile';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { getMxIdLocalPart, mxcUrlToHttp } from '../../../utils/matrix';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useObjectURL } from '../../../hooks/useObjectURL';
import { stopPropagation } from '../../../utils/keyboard';
import { ImageEditor } from '../../../components/image-editor';
import { ModalWide } from '../../../styles/Modal.css';
import { createUploadAtom, UploadSuccess } from '../../../state/upload';
import { CompactUploadCardRenderer } from '../../../components/upload-card';
import { UserHero, UserHeroName } from '../../../components/user-profile/UserHero';
import {
  ExtendedProfile,
  useExtendedProfile,
  useProfileFieldAllowed,
} from '../../../hooks/useExtendedProfile';
import { ProfileFieldContextProvider, useProfileField } from './ProfileFieldContext';
import { AsyncStatus, useAsyncCallback } from '../../../hooks/useAsyncCallback';
import { FilterByValues } from '../../../../types/utils';

function ProfileAvatar() {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const { busy, value, setValue } = useProfileField('avatar_url');
  const avatarUrl = value
    ? mxcUrlToHttp(mx, value, useAuthentication, 96, 96, 'crop') ?? undefined
    : undefined;
  const disabled = !useProfileFieldAllowed('avatar_url') || busy;

  const [imageFile, setImageFile] = useState<File>();
  const imageFileURL = useObjectURL(imageFile);
  const uploadAtom = useMemo(() => {
    if (imageFile) return createUploadAtom(imageFile);
    return undefined;
  }, [imageFile]);

  const pickFile = useFilePicker(setImageFile, false);

  const handleRemoveUpload = useCallback(() => {
    setImageFile(undefined);
  }, []);

  const handleUploaded = useCallback(
    (upload: UploadSuccess) => {
      const { mxc } = upload;
      setValue(mxc);
      handleRemoveUpload();
    },
    [setValue, handleRemoveUpload]
  );

  const handleRemoveAvatar = () => {
    setValue('');
  };

  return (
    <SettingTile>
      {uploadAtom ? (
        <Box gap="200" direction="Column">
          <CompactUploadCardRenderer
            uploadAtom={uploadAtom}
            onRemove={handleRemoveUpload}
            onComplete={handleUploaded}
          />
        </Box>
      ) : (
        <Box gap="200">
          <Button
            onClick={() => pickFile('image/*')}
            size="300"
            variant="Secondary"
            fill="Soft"
            outlined
            radii="300"
            disabled={disabled}
          >
            <Text size="B300">Upload Avatar</Text>
          </Button>
          {avatarUrl && (
            <Button
              size="300"
              variant="Critical"
              fill="None"
              radii="300"
              disabled={disabled}
              onClick={handleRemoveAvatar}
            >
              <Text size="B300">Remove Avatar</Text>
            </Button>
          )}
        </Box>
      )}

      {imageFileURL && (
        <Overlay open={false} backdrop={<OverlayBackdrop />}>
          <OverlayCenter>
            <FocusTrap
              focusTrapOptions={{
                initialFocus: false,
                onDeactivate: handleRemoveUpload,
                clickOutsideDeactivates: true,
                escapeDeactivates: stopPropagation,
              }}
            >
              <Modal className={ModalWide} variant="Surface" size="500">
                <ImageEditor
                  name={imageFile?.name ?? 'Unnamed'}
                  url={imageFileURL}
                  requestClose={handleRemoveUpload}
                />
              </Modal>
            </FocusTrap>
          </OverlayCenter>
        </Overlay>
      )}
    </SettingTile>
  );
}

type ProfileTextFieldProps<K> = {
  field: K;
  label: ReactNode;
};

function ProfileTextField<K extends keyof FilterByValues<ExtendedProfile, string | undefined>>({
  field,
  label,
}: ProfileTextFieldProps<K>) {
  const { busy, defaultValue, value, setValue } = useProfileField<K>(field);
  const disabled = !useProfileFieldAllowed(field) || busy;
  const hasChanges = defaultValue !== value;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setValue(evt.currentTarget.value);
  };

  const handleReset = () => {
    setValue(defaultValue);
  };

  return (
    <SettingTile
      title={
        <Text as="span" size="L400">
          {label}
        </Text>
      }
    >
      <Box direction="Column" grow="Yes" gap="100">
        <Box gap="200" aria-disabled={disabled}>
          <Box grow="Yes" direction="Column">
            <Input
              required
              name="displayNameInput"
              value={value ?? ''}
              onChange={handleChange}
              variant="Secondary"
              radii="300"
              style={{ paddingRight: config.space.S200 }}
              readOnly={disabled}
              after={
                hasChanges &&
                !busy && (
                  <IconButton
                    type="reset"
                    onClick={handleReset}
                    size="300"
                    radii="300"
                    variant="Secondary"
                  >
                    <Icon src={Icons.Cross} size="100" />
                  </IconButton>
                )
              }
            />
          </Box>
        </Box>
      </Box>
    </SettingTile>
  );
}

export function Profile() {
  const mx = useMatrixClient();
  const userId = mx.getUserId() as string;

  const [extendedProfileState, refreshExtendedProfile] = useExtendedProfile(userId);
  const extendedProfile =
    extendedProfileState.status === AsyncStatus.Success ? extendedProfileState.data : undefined;
  const fieldDefaults = useMemo<ExtendedProfile>(
    () =>
      extendedProfile !== undefined
        ? {
            ...extendedProfile,
            displayname: extendedProfile.displayname ?? getMxIdLocalPart(userId) ?? userId,
          }
        : {},
    [userId, extendedProfile]
  );

  const useAuthentication = useMediaAuthentication();

  const [saveState, handleSave] = useAsyncCallback(
    useCallback(
      async (fields: ExtendedProfile) => {
        await Promise.all(
          Object.entries(fields).map(async ([key, value]) => {
            if (value !== undefined) {
              await mx.setExtendedProfileProperty(key, value);
            }
          })
        );
        await refreshExtendedProfile();
        // XXX: synthesise a profile update for ourselves because Synapse is broken and won't
        const user = mx.getUser(userId);
        if (user) {
            user.displayName = fields.displayname;
            user.avatarUrl = fields.avatar_url;
            user.emit(UserEvent.DisplayName, user.events.presence, user);
            user.emit(UserEvent.AvatarUrl, user.events.presence, user);
        }
      },
      [mx, userId, refreshExtendedProfile]
    )
  );

  const saving = saveState.status === AsyncStatus.Loading;
  const loadingExtendedProfile = extendedProfileState.status === AsyncStatus.Loading;
  const busy = saving || loadingExtendedProfile;

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Profile</Text>
      <SequenceCard
        variant="SurfaceVariant"
        direction="Column"
        style={{
          overflow: 'hidden',
        }}
      >
        <ProfileFieldContextProvider fieldDefaults={fieldDefaults} save={handleSave} busy={busy}>
          {(save, reset, hasChanges, fields) => {
            const heroAvatarUrl =
              (fields.avatar_url &&
                mxcUrlToHttp(mx, fields.avatar_url, useAuthentication)) ??
              undefined;
            return (
              <>
                <UserHero userId={userId} avatarUrl={heroAvatarUrl} />
                <Box direction="Column" gap="400" style={{ padding: config.space.S400 }}>
                  <Box gap="400" alignItems="Start">
                    <UserHeroName
                      userId={userId}
                      displayName={fields.displayname as string}
                      extendedProfile={fields}
                    />
                  </Box>
                  <ProfileAvatar />
                  <ProfileTextField field="displayname" label="Display Name" />
                  <Box gap="300">
                    <Button
                      type="submit"
                      size="300"
                      variant={!busy && hasChanges ? 'Success' : 'Secondary'}
                      fill={!busy && hasChanges ? 'Solid' : 'Soft'}
                      outlined
                      radii="300"
                      disabled={!hasChanges || busy}
                      onClick={save}
                    >
                      {saving && <Spinner variant="Success" fill="Solid" size="300" />}
                      <Text size="B300">Save</Text>
                    </Button>
                    <Button
                      type="reset"
                      size="300"
                      variant="Secondary"
                      fill="Soft"
                      outlined
                      radii="300"
                      onClick={reset}
                      disabled={!hasChanges || busy}
                    >
                      <Text size="B300">Cancel</Text>
                    </Button>
                  </Box>
                </Box>
              </>
            );
          }}
        </ProfileFieldContextProvider>
      </SequenceCard>
    </Box>
  );
}
