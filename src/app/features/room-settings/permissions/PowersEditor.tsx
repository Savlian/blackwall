import React, { FormEventHandler, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Text,
  Chip,
  Icon,
  Icons,
  IconButton,
  Scroll,
  Button,
  Input,
  RectCords,
  PopOut,
  Menu,
  config,
  Spinner,
} from 'folds';
import { HexColorPicker } from 'react-colorful';
import { useAtomValue } from 'jotai';
import { Page, PageContent, PageHeader } from '../../../components/page';
import { IPowerLevels } from '../../../hooks/usePowerLevels';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';
import {
  getPowers,
  getUsedPowers,
  PowerLevelTag,
  PowerLevelTagIcon,
  PowerLevelTags,
  usePowerLevelTags,
} from '../../../hooks/usePowerLevelTags';
import { useRoom } from '../../../hooks/useRoom';
import { HexColorPickerPopOut } from '../../../components/HexColorPickerPopOut';
import { PowerColorBadge } from '../../../components/power';
import { UseStateProvider } from '../../../components/UseStateProvider';
import { EmojiBoard } from '../../../components/emoji-board';
import { useImagePackRooms } from '../../../hooks/useImagePackRooms';
import { roomToParentsAtom } from '../../../state/room/roomToParents';
import { PowerIcon } from '../../../components/power/PowerIcon';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { CompactUploadCardRenderer } from '../../../components/upload-card';
import { createUploadAtom, UploadSuccess } from '../../../state/upload';
import { AsyncStatus, useAsyncCallback } from '../../../hooks/useAsyncCallback';
import { StateEvent } from '../../../../types/matrix/room';
import { useAlive } from '../../../hooks/useAlive';
import { BetaNoticeBadge } from '../../../components/BetaNoticeBadge';

type EditPowerProps = {
  maxPower: number;
  power?: number;
  tag?: PowerLevelTag;
  onSave: (power: number, tag: PowerLevelTag) => void;
  onClose: () => void;
};
function EditPower({ maxPower, power, tag, onSave, onClose }: EditPowerProps) {
  const mx = useMatrixClient();
  const room = useRoom();
  const roomToParents = useAtomValue(roomToParentsAtom);
  const useAuthentication = useMediaAuthentication();

  const imagePackRooms = useImagePackRooms(room.roomId, roomToParents);

  const [iconFile, setIconFile] = useState<File>();
  const pickFile = useFilePicker(setIconFile, false);

  const [tagColor, setTagColor] = useState<string>();
  const [tagIcon, setTagIcon] = useState<string>();
  const uploadingIcon = iconFile && !tagIcon;

  const iconUploadAtom = useMemo(() => {
    if (iconFile) return createUploadAtom(iconFile);
    return undefined;
  }, [iconFile]);

  const handleRemoveIconUpload = useCallback(() => {
    setIconFile(undefined);
  }, []);

  const handleIconUploaded = useCallback((upload: UploadSuccess) => {
    setTagIcon(upload.mxc);
    setIconFile(undefined);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    if (uploadingIcon) return;

    const target = evt.target as HTMLFormElement | undefined;
    const powerInput = target?.powerInput as HTMLInputElement | undefined;
    const nameInput = target?.nameInput as HTMLInputElement | undefined;
    if (!powerInput || !nameInput) return;

    const tagPower = parseInt(powerInput.value, 10);
    if (Number.isNaN(tagPower)) return;
    const tagName = nameInput.value.trim();
    if (!tagName) return;

    const iconContent: PowerLevelTagIcon | undefined = tagIcon
      ? {
          key: tagIcon,
        }
      : undefined;

    const editedTag: PowerLevelTag = {
      name: tagName,
      color: tagColor,
      icon: iconContent,
    };

    onSave(power ?? tagPower, editedTag);
    onClose();
  };

  return (
    <Box onSubmit={handleSubmit} as="form" direction="Column" gap="400">
      <Box direction="Column" gap="300">
        <Box direction="Column" gap="100">
          <Text size="L400">Icon</Text>
          {iconUploadAtom && !tagIcon ? (
            <CompactUploadCardRenderer
              uploadAtom={iconUploadAtom}
              onRemove={handleRemoveIconUpload}
              onComplete={handleIconUploaded}
            />
          ) : (
            <Box gap="200" alignItems="Center">
              {tagIcon ? (
                <>
                  <Text size="H3">
                    <PowerIcon
                      iconSrc={
                        tagIcon.startsWith('mxc://')
                          ? mx.mxcUrlToHttp(
                              tagIcon,
                              96,
                              96,
                              'scale',
                              undefined,
                              undefined,
                              useAuthentication
                            ) ?? 'X'
                          : tagIcon
                      }
                    />
                  </Text>
                  <Button
                    onClick={() => setTagIcon(undefined)}
                    type="button"
                    size="300"
                    variant="Critical"
                    fill="None"
                    radii="300"
                  >
                    <Text size="B300">Remove</Text>
                  </Button>
                </>
              ) : (
                <>
                  <UseStateProvider initial={undefined}>
                    {(cords: RectCords | undefined, setCords) => (
                      <PopOut
                        position="Bottom"
                        anchor={cords}
                        content={
                          <EmojiBoard
                            imagePackRooms={imagePackRooms}
                            returnFocusOnDeactivate={false}
                            allowTextCustomEmoji={false}
                            addToRecentEmoji={false}
                            onEmojiSelect={(key) => {
                              setTagIcon(key);
                              setCords(undefined);
                            }}
                            onCustomEmojiSelect={(mxc) => {
                              setTagIcon(mxc);
                              setCords(undefined);
                            }}
                            requestClose={() => {
                              setCords(undefined);
                            }}
                          />
                        }
                      >
                        <IconButton
                          onClick={
                            ((evt) =>
                              setCords(
                                evt.currentTarget.getBoundingClientRect()
                              )) as MouseEventHandler<HTMLButtonElement>
                          }
                          type="button"
                          size="400"
                          variant="Secondary"
                          fill="Soft"
                          radii="300"
                        >
                          <Icon size="50" src={Icons.SmilePlus} />
                        </IconButton>
                      </PopOut>
                    )}
                  </UseStateProvider>
                  <Button
                    onClick={() => pickFile('image/*')}
                    type="button"
                    size="300"
                    variant="Secondary"
                    fill="Soft"
                    radii="300"
                  >
                    <Text size="B300">Import</Text>
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
        <Box gap="200">
          <Box grow="Yes" direction="Column" gap="100">
            <Text size="L400">Power</Text>
            <Input
              autoFocus
              defaultValue={power}
              name="powerInput"
              size="300"
              variant="Secondary"
              radii="300"
              type="number"
              placeholder="75"
              max={maxPower}
              readOnly={typeof power === 'number'}
              required
            />
          </Box>
          <Box shrink="No" direction="Column" gap="100">
            <Text size="L400">Color</Text>
            <Box gap="200">
              <HexColorPickerPopOut
                picker={<HexColorPicker color={tagColor ?? tag?.color} onChange={setTagColor} />}
                onRemove={() => setTagColor(undefined)}
              >
                {(openPicker, opened) => (
                  <Button
                    aria-pressed={opened}
                    onClick={openPicker}
                    size="300"
                    type="button"
                    variant="Secondary"
                    fill="Soft"
                    radii="300"
                    before={<PowerColorBadge color={tagColor ?? tag?.color} />}
                  >
                    <Text size="B300">Pick</Text>
                  </Button>
                )}
              </HexColorPickerPopOut>
            </Box>
          </Box>
        </Box>
        <Box direction="Column" gap="100">
          <Text size="L400">Name</Text>
          <Input
            name="nameInput"
            defaultValue={tag?.name}
            placeholder="Bot"
            size="300"
            variant="Secondary"
            radii="300"
            required
          />
        </Box>
        <Box direction="Row" gap="200">
          <Button type="submit" size="300" variant="Success" radii="300" disabled={uploadingIcon}>
            <Text size="B300">Save</Text>
          </Button>
          <Button
            type="button"
            size="300"
            variant="Secondary"
            fill="Soft"
            radii="300"
            onClick={onClose}
          >
            <Text size="B300">Cancel</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

type PowersEditorProps = {
  powerLevels: IPowerLevels;
  requestClose: () => void;
};
export function PowersEditor({ powerLevels, requestClose }: PowersEditorProps) {
  const mx = useMatrixClient();
  const room = useRoom();
  const alive = useAlive();
  const [, maxPower] = useMemo(() => {
    const up = getUsedPowers(powerLevels);
    return [up, Math.max(...Array.from(up))];
  }, [powerLevels]);

  const [powerLevelTags] = usePowerLevelTags(room, powerLevels);
  const [editedPowerTags, setEditedPowerTags] = useState<PowerLevelTags>();

  const [createTag, setCreateTag] = useState(false);

  const handleSaveTag = useCallback(
    (power: number, tag: PowerLevelTag) => {
      setEditedPowerTags((tags) => {
        const editedTags = { ...(tags ?? powerLevelTags) };
        editedTags[power] = tag;
        return editedTags;
      });
    },
    [powerLevelTags]
  );

  const [applyState, applyChanges] = useAsyncCallback(
    useCallback(async () => {
      await mx.sendStateEvent(room.roomId, StateEvent.PowerLevelTags as any, editedPowerTags);
    }, [mx, room, editedPowerTags])
  );

  const resetChanges = useCallback(() => {
    setEditedPowerTags(undefined);
  }, []);

  const handleApplyChanges = () => {
    applyChanges().then(() => {
      if (alive()) {
        resetChanges();
      }
    });
  };

  const applyingChanges = applyState.status === AsyncStatus.Loading;

  const powerTags = editedPowerTags ?? powerLevelTags;
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
              <Text size="T300">Permissions</Text>
            </Chip>
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
              <Box direction="Column" gap="100">
                <Box alignItems="Baseline" gap="200" justifyContent="SpaceBetween">
                  <Text size="L400">Powers Editor</Text>
                  <BetaNoticeBadge />
                </Box>
                <SequenceCard
                  variant="SurfaceVariant"
                  className={SequenceCardStyle}
                  direction="Column"
                  gap="400"
                >
                  <SettingTile
                    title="New Power Level"
                    description="Create a new power level."
                    after={
                      !createTag && (
                        <Button
                          onClick={() => setCreateTag(true)}
                          variant="Secondary"
                          fill="Soft"
                          size="300"
                          radii="300"
                          outlined
                          disabled={applyingChanges}
                        >
                          <Text size="B300">Create</Text>
                        </Button>
                      )
                    }
                  />
                  {createTag && (
                    <EditPower
                      maxPower={maxPower}
                      onSave={handleSaveTag}
                      onClose={() => setCreateTag(false)}
                    />
                  )}
                </SequenceCard>
                {getPowers(powerTags).map((power) => {
                  const tag = powerTags[power];

                  return (
                    <SequenceCard
                      key={power}
                      variant="SurfaceVariant"
                      className={SequenceCardStyle}
                      direction="Column"
                      gap="400"
                    >
                      <SettingTile
                        before={<PowerColorBadge color={tag.color} />}
                        title={
                          <Box as="span" gap="100" alignItems="Center">
                            <b>{tag.name}</b>
                            <Text as="span" size="T200" priority="300">
                              ({power})
                            </Text>
                          </Box>
                        }
                        after={
                          <Chip variant="Secondary" radii="Pill" disabled={applyingChanges}>
                            <Text size="B300">Edit</Text>
                          </Chip>
                        }
                      />
                    </SequenceCard>
                  );
                })}
              </Box>
              {editedPowerTags && (
                <Menu
                  style={{
                    position: 'sticky',
                    padding: config.space.S200,
                    paddingLeft: config.space.S400,
                    bottom: config.space.S400,
                    left: config.space.S400,
                    right: 0,
                    zIndex: 1,
                  }}
                  variant="Success"
                >
                  <Box alignItems="Center" gap="400">
                    <Box grow="Yes" direction="Column">
                      {applyState.status === AsyncStatus.Error ? (
                        <Text size="T200">
                          <b>Failed to apply changes! Please try again.</b>
                        </Text>
                      ) : (
                        <Text size="T200">
                          <b>Changes saved! Apply when ready.</b>
                        </Text>
                      )}
                    </Box>
                    <Box shrink="No" gap="200">
                      <Button
                        size="300"
                        variant="Success"
                        fill="None"
                        radii="300"
                        disabled={applyingChanges}
                        onClick={resetChanges}
                      >
                        <Text size="B300">Reset</Text>
                      </Button>
                      <Button
                        size="300"
                        variant="Success"
                        radii="300"
                        disabled={applyingChanges}
                        before={
                          applyingChanges && <Spinner variant="Success" fill="Solid" size="100" />
                        }
                        onClick={handleApplyChanges}
                      >
                        <Text size="B300">Apply Changes</Text>
                      </Button>
                    </Box>
                  </Box>
                </Menu>
              )}
            </Box>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
