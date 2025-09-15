import React, {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  toRem,
  Dialog,
  Header,
  MenuItem,
  Chip,
  PopOut,
  RectCords,
  Menu,
} from 'folds';
import FocusTrap from 'focus-trap-react';
import { UserEvent } from 'matrix-js-sdk';
import { isKeyHotkey } from 'is-hotkey';
import { SequenceCard } from '../../../components/sequence-card';
import { SettingTile } from '../../../components/setting-tile';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { getMxIdServer, mxcUrlToHttp } from '../../../utils/matrix';
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
import { CutoutCard } from '../../../components/cutout-card';
import { ServerChip, ShareChip, TimezoneChip } from '../../../components/user-profile/UserChips';
import { SequenceCardStyle } from '../styles.css';

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
    <SettingTile
      title={
        <Text as="span" size="L400">
          Avatar
        </Text>
      }
    >
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
    const content = evt.currentTarget.value;
    if (content.length > 0) {
      setValue(evt.currentTarget.value);
    } else {
      setValue(undefined);
    }
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

function ProfilePronouns() {
  const { busy, value, setValue } = useProfileField('io.fsky.nyx.pronouns');
  const disabled = !useProfileFieldAllowed('io.fsky.nyx.pronouns') || busy;

  const [menuCords, setMenuCords] = useState<RectCords>();
  const [pendingPronoun, setPendingPronoun] = useState('');

  const handleRemovePronoun = (index: number) => {
    const newPronouns = [...(value ?? [])];
    newPronouns.splice(index, 1);
    if (newPronouns.length > 0) {
      setValue(newPronouns);
    } else {
      setValue(undefined);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    setMenuCords(undefined);
    if (pendingPronoun.length > 0) {
      setValue([...(value ?? []), { language: 'en', summary: pendingPronoun }]);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (isKeyHotkey('escape', evt)) {
      evt.stopPropagation();
      setMenuCords(undefined);
    }
  };

  const handleOpenMenu: MouseEventHandler<HTMLSpanElement> = (evt) => {
    setPendingPronoun('');
    setMenuCords(evt.currentTarget.getBoundingClientRect());
  };

  return (
    <SettingTile
      title={
        <Text as="span" size="L400">
          Pronouns
        </Text>
      }
    >
      <Box alignItems="Center" gap="200" wrap="Wrap">
        {value?.map(({ summary }, index) => (
          <Chip
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            variant="Secondary"
            radii="Pill"
            after={<Icon src={Icons.Cross} size="100" />}
            onClick={() => handleRemovePronoun(index)}
            disabled={disabled}
          >
            <Text size="T200" truncate>
              {summary}
            </Text>
          </Chip>
        ))}
        <Chip
          variant="Secondary"
          radii="Pill"
          disabled={disabled}
          after={<Icon src={menuCords ? Icons.ChevronRight : Icons.Plus} size="100" />}
          onClick={handleOpenMenu}
        >
          <Text size="T200">Add</Text>
        </Chip>
      </Box>
      <PopOut
        anchor={menuCords}
        offset={5}
        position="Right"
        align="Center"
        content={
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: () => setMenuCords(undefined),
              clickOutsideDeactivates: true,
              isKeyForward: (evt: KeyboardEvent) =>
                evt.key === 'ArrowDown' || evt.key === 'ArrowRight',
              isKeyBackward: (evt: KeyboardEvent) =>
                evt.key === 'ArrowUp' || evt.key === 'ArrowLeft',
              escapeDeactivates: stopPropagation,
            }}
          >
            <Menu
              variant="SurfaceVariant"
              style={{
                padding: config.space.S200,
              }}
            >
              <Box as="form" onSubmit={handleSubmit} direction="Row" gap="200">
                <Input
                  variant="Secondary"
                  placeholder="they/them"
                  inputSize={10}
                  radii="300"
                  size="300"
                  outlined
                  value={pendingPronoun}
                  onChange={(evt) => setPendingPronoun(evt.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  type="submit"
                  size="300"
                  variant="Success"
                  radii="300"
                  before={<Icon size="100" src={Icons.Plus} />}
                >
                  <Text size="B300">Add</Text>
                </Button>
              </Box>
            </Menu>
          </FocusTrap>
        }
      />
    </SettingTile>
  );
}

function ProfileTimezone() {
  const { busy, value, setValue } = useProfileField('us.cloke.msc4175.tz');
  const disabled = !useProfileFieldAllowed('us.cloke.msc4175.tz') || busy;

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [query, setQuery] = useState('');

  // @ts-expect-error Intl.supportedValuesOf isn't in the types yet
  const timezones = useMemo(() => Intl.supportedValuesOf('timeZone') as string[], []);
  const filteredTimezones = timezones.filter(
    (timezone) =>
      query.length === 0 || timezone.toLowerCase().replace('_', ' ').includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (timezone: string) => {
      setOverlayOpen(false);
      setValue(timezone);
    },
    [setOverlayOpen, setValue]
  );

  useEffect(() => {
    if (overlayOpen) {
      const scrollView = scrollRef.current;
      const focusedItem = scrollView?.querySelector(`[data-tz="${value}"]`);

      if (value && focusedItem && scrollView) {
        focusedItem.scrollIntoView({
          block: 'center',
        });
      }
    }
  }, [scrollRef, value, overlayOpen]);

  return (
    <SettingTile
      title={
        <Text as="span" size="L400">
          Timezone
        </Text>
      }
    >
      <Overlay open={overlayOpen} backdrop={<OverlayBackdrop />}>
        <OverlayCenter>
          <FocusTrap
            focusTrapOptions={{
              initialFocus: () => inputRef.current,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              onDeactivate: () => setOverlayOpen(false),
              escapeDeactivates: (evt) => {
                evt.stopPropagation();
                return true;
              },
            }}
          >
            <Dialog variant="Surface">
              <Header
                style={{
                  padding: `0 ${config.space.S200} 0 ${config.space.S400}`,
                  borderBottomWidth: config.borderWidth.B300,
                }}
                variant="Surface"
                size="500"
              >
                <Box grow="Yes">
                  <Text size="H4">Choose a Timezone</Text>
                </Box>
                <IconButton size="300" onClick={() => setOverlayOpen(false)} radii="300">
                  <Icon src={Icons.Cross} />
                </IconButton>
              </Header>
              <Box style={{ padding: config.space.S400 }} direction="Column" gap="400">
                <Input
                  ref={inputRef}
                  size="500"
                  variant="Background"
                  radii="400"
                  outlined
                  placeholder="Search"
                  before={<Icon size="200" src={Icons.Search} />}
                  value={query}
                  onChange={(evt) => setQuery(evt.currentTarget.value)}
                />
                <CutoutCard ref={scrollRef} style={{ overflowY: 'scroll', height: toRem(300) }}>
                  {filteredTimezones.length === 0 && (
                    <Box
                      style={{ paddingTop: config.space.S700 }}
                      grow="Yes"
                      alignItems="Center"
                      justifyContent="Center"
                      direction="Column"
                      gap="100"
                    >
                      <Text size="H6" align="Center">
                        No Results
                      </Text>
                    </Box>
                  )}
                  {filteredTimezones.map((timezone) => (
                    <MenuItem
                      key={timezone}
                      data-tz={timezone}
                      variant={timezone === value ? 'Success' : 'Surface'}
                      fill={timezone === value ? 'Soft' : 'None'}
                      size="300"
                      radii="0"
                      after={<Icon size="50" src={Icons.ChevronRight} />}
                      onClick={() => handleSelect(timezone)}
                    >
                      <Box grow="Yes">
                        <Text size="T200" truncate>
                          {timezone}
                        </Text>
                      </Box>
                    </MenuItem>
                  ))}
                </CutoutCard>
              </Box>
            </Dialog>
          </FocusTrap>
        </OverlayCenter>
      </Overlay>
      <Box gap="200">
        <Button
          variant="Secondary"
          fill="Soft"
          size="300"
          radii="300"
          outlined
          disabled={disabled}
          onClick={() => setOverlayOpen(true)}
          after={<Icon size="100" src={Icons.ChevronRight} />}
        >
          <Text size="B300">{value ?? 'Set Timezone'}</Text>
        </Button>
        {value && (
          <Button
            size="300"
            variant="Critical"
            fill="None"
            radii="300"
            disabled={disabled}
            onClick={() => setValue(undefined)}
          >
            <Text size="B300">Remove Timezone</Text>
          </Button>
        )}
      </Box>
    </SettingTile>
  );
}

export function Profile() {
  const mx = useMatrixClient();
  const userId = mx.getUserId() as string;
  const server = getMxIdServer(userId);

  const [extendedProfileState, refreshExtendedProfile] = useExtendedProfile(userId);
  const extendedProfile =
    extendedProfileState.status === AsyncStatus.Success ? extendedProfileState.data : undefined;

  const [fieldDefaults, setFieldDefaults] = useState<ExtendedProfile>({});
  useLayoutEffect(() => {
    if (extendedProfile !== undefined) {
      setFieldDefaults(extendedProfile);
    }
  }, [userId, setFieldDefaults, extendedProfile]);

  const useAuthentication = useMediaAuthentication();

  const [saveState, handleSave] = useAsyncCallback(
    useCallback(
      async (fields: ExtendedProfile) => {
        await Promise.all(
          Object.entries(fields).map(async ([key, value]) => {
            if (value === undefined) {
              await mx.deleteExtendedProfileProperty(key);
            } else {
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
        variant="Surface"
        outlined
        direction="Column"
        style={{
          overflow: 'hidden',
        }}
      >
        <ProfileFieldContextProvider fieldDefaults={fieldDefaults} save={handleSave} busy={busy}>
          {(save, reset, hasChanges, fields) => {
            const heroAvatarUrl =
              (fields.avatar_url && mxcUrlToHttp(mx, fields.avatar_url, useAuthentication)) ??
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
                  <Box alignItems="Center" gap="200" wrap="Wrap">
                    {server && <ServerChip server={server} />}
                    <ShareChip userId={userId} />
                    {fields['us.cloke.msc4175.tz'] && (
                      <TimezoneChip timezone={fields['us.cloke.msc4175.tz']} />
                    )}
                  </Box>
                </Box>
                <SequenceCard
                  className={SequenceCardStyle}
                  variant="SurfaceVariant"
                  direction="Column"
                  gap="300"
                  radii="0"
                  outlined
                  style={{ borderLeftWidth: '0', borderRightWidth: '0', borderBottomWidth: '0' }}
                >
                  <ProfileAvatar />
                  <ProfileTextField field="displayname" label="Display Name" />
                  <ProfilePronouns />
                  <ProfileTimezone />
                  <Box gap="300" alignItems="Center">
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
                    {saving && <Spinner size="300" />}
                  </Box>
                </SequenceCard>
              </>
            );
          }}
        </ProfileFieldContextProvider>
      </SequenceCard>
    </Box>
  );
}
