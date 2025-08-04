import React, {
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ICreateRoomOpts,
  ICreateRoomStateEvent,
  JoinRule,
  MatrixClient,
  MatrixError,
  RestrictedAllowType,
  Room,
} from 'matrix-js-sdk';
import {
  Box,
  Button,
  Chip,
  color,
  config,
  Icon,
  Icons,
  Input,
  Menu,
  PopOut,
  RectCords,
  Spinner,
  Switch,
  Text,
  TextArea,
  toRem,
} from 'folds';
import FocusTrap from 'focus-trap-react';
import { RoomJoinRulesEventContent } from 'matrix-js-sdk/lib/types';
import { isKeyHotkey } from 'is-hotkey';
import { SettingTile } from '../../components/setting-tile';
import { SequenceCard } from '../../components/sequence-card';
import {
  getMxIdServer,
  knockRestrictedSupported,
  knockSupported,
  restrictedSupported,
} from '../../utils/matrix';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { millisecondsToMinutes, replaceSpaceWithDash } from '../../utils/common';
import { AsyncState, AsyncStatus, useAsync, useAsyncCallback } from '../../hooks/useAsyncCallback';
import { useDebounce } from '../../hooks/useDebounce';
import { useCapabilities } from '../../hooks/useCapabilities';
import { stopPropagation } from '../../utils/keyboard';
import { getViaServers } from '../../plugins/via-servers';
import { StateEvent } from '../../../types/matrix/room';
import { getIdServer } from '../../../util/matrixUtil';
import { useAlive } from '../../hooks/useAlive';
import { ErrorCode } from '../../cs-errorcode';

export enum CreateRoomKind {
  Private = 'private',
  Restricted = 'restricted',
  Public = 'public',
}
type CreateRoomKindSelectorProps = {
  value?: CreateRoomKind;
  onSelect: (value: CreateRoomKind) => void;
  canRestrict?: boolean;
  disabled?: boolean;
};
export function CreateRoomKindSelector({
  value,
  onSelect,
  canRestrict,
  disabled,
}: CreateRoomKindSelectorProps) {
  return (
    <Box shrink="No" direction="Column" gap="100">
      {canRestrict && (
        <SequenceCard
          style={{ padding: config.space.S300 }}
          variant={value === CreateRoomKind.Restricted ? 'Primary' : 'SurfaceVariant'}
          direction="Column"
          gap="100"
          as="button"
          type="button"
          aria-pressed={value === CreateRoomKind.Restricted}
          onClick={() => onSelect(CreateRoomKind.Restricted)}
          disabled={disabled}
        >
          <SettingTile
            before={<Icon size="400" src={Icons.Hash} />}
            after={value === CreateRoomKind.Restricted && <Icon src={Icons.Check} />}
          >
            <Text size="H6">Restricted</Text>
            <Text size="T300" priority="300">
              Only member of parent space can join.
            </Text>
          </SettingTile>
        </SequenceCard>
      )}
      <SequenceCard
        style={{ padding: config.space.S300 }}
        variant={value === CreateRoomKind.Private ? 'Primary' : 'SurfaceVariant'}
        direction="Column"
        gap="100"
        as="button"
        type="button"
        aria-pressed={value === CreateRoomKind.Private}
        onClick={() => onSelect(CreateRoomKind.Private)}
        disabled={disabled}
      >
        <SettingTile
          before={<Icon size="400" src={Icons.HashLock} />}
          after={value === CreateRoomKind.Private && <Icon src={Icons.Check} />}
        >
          <Text size="H6">Private</Text>
          <Text size="T300" priority="300">
            Only people with invite can join.
          </Text>
        </SettingTile>
      </SequenceCard>
      <SequenceCard
        style={{ padding: config.space.S300 }}
        variant={value === CreateRoomKind.Public ? 'Primary' : 'SurfaceVariant'}
        direction="Column"
        gap="100"
        as="button"
        type="button"
        aria-pressed={value === CreateRoomKind.Public}
        onClick={() => onSelect(CreateRoomKind.Public)}
        disabled={disabled}
      >
        <SettingTile
          before={<Icon size="400" src={Icons.HashGlobe} />}
          after={value === CreateRoomKind.Public && <Icon src={Icons.Check} />}
        >
          <Text size="H6">Public</Text>
          <Text size="T300" priority="300">
            Anyone with the address can join.
          </Text>
        </SettingTile>
      </SequenceCard>
    </Box>
  );
}

export function AliasInput({ disabled }: { disabled?: boolean }) {
  const mx = useMatrixClient();
  const aliasInputRef = useRef<HTMLInputElement>(null);
  const [aliasAvail, setAliasAvail] = useState<AsyncState<boolean, Error>>({
    status: AsyncStatus.Idle,
  });

  useEffect(() => {
    if (aliasAvail.status === AsyncStatus.Success && aliasInputRef.current?.value === '') {
      setAliasAvail({ status: AsyncStatus.Idle });
    }
  }, [aliasAvail]);

  const checkAliasAvail = useAsync(
    useCallback(
      async (aliasLocalPart: string) => {
        const roomAlias = `#${aliasLocalPart}:${getMxIdServer(mx.getSafeUserId())}`;
        try {
          const result = await mx.getRoomIdForAlias(roomAlias);
          return typeof result.room_id !== 'string';
        } catch (e) {
          if (e instanceof MatrixError && e.httpStatus === 404) {
            return true;
          }
          throw e;
        }
      },
      [mx]
    ),
    setAliasAvail
  );
  const aliasAvailable: boolean | undefined =
    aliasAvail.status === AsyncStatus.Success ? aliasAvail.data : undefined;

  const debounceCheckAliasAvail = useDebounce(checkAliasAvail, { wait: 500 });

  const handleAliasChange: FormEventHandler<HTMLInputElement> = (evt) => {
    const aliasInput = evt.currentTarget;
    const aliasLocalPart = replaceSpaceWithDash(aliasInput.value);
    if (aliasLocalPart) {
      aliasInput.value = aliasLocalPart;
      debounceCheckAliasAvail(aliasLocalPart);
    } else {
      setAliasAvail({ status: AsyncStatus.Idle });
    }
  };

  const handleAliasKeyDown: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (isKeyHotkey('enter', evt)) {
      evt.preventDefault();

      const aliasInput = evt.currentTarget;
      const aliasLocalPart = replaceSpaceWithDash(aliasInput.value);
      if (aliasLocalPart) {
        checkAliasAvail(aliasLocalPart);
      } else {
        setAliasAvail({ status: AsyncStatus.Idle });
      }
    }
  };

  return (
    <Box shrink="No" direction="Column" gap="100">
      <Text size="L400">Address (Optional)</Text>
      <Text size="T200" priority="300">
        Pick an unique address to make your room discoverable to public.
      </Text>
      <Input
        ref={aliasInputRef}
        onChange={handleAliasChange}
        before={
          aliasAvail.status === AsyncStatus.Loading ? (
            <Spinner size="100" variant="Secondary" />
          ) : (
            <Icon size="100" src={Icons.Hash} />
          )
        }
        after={
          <Text style={{ maxWidth: toRem(150) }} truncate>
            :{getMxIdServer(mx.getSafeUserId())}
          </Text>
        }
        onKeyDown={handleAliasKeyDown}
        name="aliasInput"
        size="500"
        variant={aliasAvailable === true ? 'Success' : 'SurfaceVariant'}
        radii="400"
        disabled={disabled}
      />
      {aliasAvailable === false && (
        <Box style={{ color: color.Critical.Main }} alignItems="Center" gap="100">
          <Icon src={Icons.Warning} filled size="50" />
          <Text size="T200">
            <b>This address is already taken. Please select a different one.</b>
          </Text>
        </Box>
      )}
    </Box>
  );
}

export function RoomVersionSelector({
  versions,
  value,
  onChange,
  disabled,
}: {
  versions: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [menuCords, setMenuCords] = useState<RectCords>();

  const handleMenu: MouseEventHandler<HTMLButtonElement> = (evt) => {
    setMenuCords(evt.currentTarget.getBoundingClientRect());
  };

  const handleSelect = (version: string) => {
    setMenuCords(undefined);
    onChange(version);
  };

  return (
    <SequenceCard
      style={{ padding: config.space.S300 }}
      variant="SurfaceVariant"
      direction="Column"
      gap="500"
    >
      <SettingTile
        title="Room Version"
        after={
          <PopOut
            anchor={menuCords}
            offset={5}
            position="Bottom"
            align="End"
            content={
              <FocusTrap
                focusTrapOptions={{
                  initialFocus: false,
                  onDeactivate: () => setMenuCords(undefined),
                  clickOutsideDeactivates: true,
                  isKeyForward: (evt: KeyboardEvent) =>
                    evt.key === 'ArrowDown' || evt.key === 'ArrowRight',
                  isKeyBackward: (evt: KeyboardEvent) =>
                    evt.key === 'ArrowUp' || evt.key === 'ArrowLeft',
                  escapeDeactivates: stopPropagation,
                }}
              >
                <Menu>
                  <Box
                    direction="Column"
                    gap="200"
                    style={{ padding: config.space.S200, maxWidth: toRem(300) }}
                  >
                    <Text size="L400">Room Versions</Text>
                    <Box wrap="Wrap" gap="100">
                      {versions.map((version) => (
                        <Chip
                          key={version}
                          variant={value === version ? 'Primary' : 'SurfaceVariant'}
                          aria-pressed={value === version}
                          outlined={value === version}
                          radii="300"
                          onClick={() => handleSelect(version)}
                          type="button"
                        >
                          <Text truncate size="T300">
                            {version}
                          </Text>
                        </Chip>
                      ))}
                    </Box>
                  </Box>
                </Menu>
              </FocusTrap>
            }
          >
            <Button
              type="button"
              onClick={handleMenu}
              size="300"
              variant="Secondary"
              fill="Soft"
              radii="300"
              aria-pressed={!!menuCords}
              before={<Icon size="50" src={menuCords ? Icons.ChevronTop : Icons.ChevronBottom} />}
              disabled={disabled}
            >
              <Text size="B300">{value}</Text>
            </Button>
          </PopOut>
        }
      />
    </SequenceCard>
  );
}

type CreateRoomData = {
  version: string;
  parent?: Room;
  kind: CreateRoomKind;
  name: string;
  topic?: string;
  aliasLocalPart?: string;
  encryption: boolean;
  knock: boolean;
  allowFederation: boolean;
};
const createRoom = async (mx: MatrixClient, data: CreateRoomData): Promise<string> => {
  const creationContent = {
    'm.federate': data.allowFederation,
  };

  const initialState: ICreateRoomStateEvent[] = [];

  if (data.encryption) {
    initialState.push({
      type: 'm.room.encryption',
      state_key: '',
      content: {
        algorithm: 'm.megolm.v1.aes-sha2',
      },
    });
  }

  if (data.parent) {
    initialState.push({
      type: StateEvent.SpaceParent,
      state_key: data.parent.roomId,
      content: {
        canonical: true,
        via: getViaServers(data.parent),
      },
    });
  }

  const getJoinRuleContent = (): RoomJoinRulesEventContent => {
    if (data.kind === CreateRoomKind.Public) {
      return {
        join_rule: JoinRule.Public,
      };
    }

    if (data.kind === CreateRoomKind.Restricted && data.parent) {
      return {
        join_rule: data.knock ? ('knock_restricted' as JoinRule) : JoinRule.Restricted,
        allow: [
          {
            type: RestrictedAllowType.RoomMembership,
            room_id: data.parent.roomId,
          },
        ],
      };
    }

    return {
      join_rule: data.knock ? JoinRule.Knock : JoinRule.Invite,
    };
  };

  initialState.push({
    type: StateEvent.RoomJoinRules,
    content: getJoinRuleContent(),
  });

  const options: ICreateRoomOpts = {
    room_version: data.version,
    name: data.name,
    topic: data.topic,
    room_alias_name: data.aliasLocalPart,
    creation_content: creationContent,
    initial_state: initialState,
  };

  const result = await mx.createRoom(options);

  if (data.parent) {
    await mx.sendStateEvent(
      data.parent.roomId,
      StateEvent.SpaceChild as any,
      {
        auto_join: false,
        suggested: false,
        via: [getIdServer(mx.getUserId())],
      },
      result.room_id
    );
  }

  return result.room_id;
};

const getCreateRoomKindToIcon = (kind: CreateRoomKind) => {
  if (kind === CreateRoomKind.Private) return Icons.HashLock;
  if (kind === CreateRoomKind.Restricted) return Icons.Hash;
  return Icons.HashGlobe;
};

type CreateRoomFormProps = {
  defaultKind?: CreateRoomKind;
  space?: Room;
  onCreate?: (roomId: string) => void;
};
export function CreateRoomForm({ defaultKind, space, onCreate }: CreateRoomFormProps) {
  const mx = useMatrixClient();
  const alive = useAlive();

  const capabilities = useCapabilities();
  const roomVersion = capabilities['m.room_versions'];
  const [selectedRoomVersion, selectRoomVersion] = useState(roomVersion?.default ?? '1');
  const allowRestricted = space && restrictedSupported(selectedRoomVersion);

  const [kind, setKind] = useState(
    defaultKind ?? allowRestricted ? CreateRoomKind.Restricted : CreateRoomKind.Private
  );
  const [federation, setFederation] = useState(true);
  const [encryption, setEncryption] = useState(false);
  const [knock, setKnock] = useState(false);
  const [advance, setAdvance] = useState(false);

  const allowKnock = kind === CreateRoomKind.Private && knockSupported(selectedRoomVersion);
  const allowKnockRestricted =
    kind === CreateRoomKind.Restricted && knockRestrictedSupported(selectedRoomVersion);

  const handleRoomVersionChange = (version: string) => {
    if (!restrictedSupported(version)) {
      setKind(CreateRoomKind.Private);
    }
    selectRoomVersion(version);
  };

  const [createState, create] = useAsyncCallback<string, Error | MatrixError, [CreateRoomData]>(
    useCallback((data) => createRoom(mx, data), [mx])
  );
  const loading = createState.status === AsyncStatus.Loading;
  const error = createState.status === AsyncStatus.Error ? createState.error : undefined;
  const disabled = createState.status === AsyncStatus.Loading;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    if (disabled) return;
    const form = evt.currentTarget;

    const nameInput = form.nameInput as HTMLInputElement | undefined;
    const topicTextArea = form.topicTextAria as HTMLTextAreaElement | undefined;
    const aliasInput = form.aliasInput as HTMLInputElement | undefined;
    const roomName = nameInput?.value.trim();
    const roomTopic = topicTextArea?.value.trim();
    const aliasLocalPart =
      aliasInput && aliasInput.value ? replaceSpaceWithDash(aliasInput.value) : undefined;

    if (!roomName) return;
    const publicRoom = kind === CreateRoomKind.Public;
    let roomKnock = false;
    if (allowKnock && kind === CreateRoomKind.Private) {
      roomKnock = knock;
    }
    if (allowKnockRestricted && kind === CreateRoomKind.Restricted) {
      roomKnock = knock;
    }

    create({
      version: selectedRoomVersion,
      parent: space,
      kind,
      name: roomName,
      topic: roomTopic || undefined,
      aliasLocalPart: publicRoom ? aliasLocalPart : undefined,
      encryption: publicRoom ? false : encryption,
      knock: roomKnock,
      allowFederation: federation,
    }).then((roomId) => {
      if (alive()) {
        onCreate?.(roomId);
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} grow="Yes" direction="Column" gap="500">
      <Box direction="Column" gap="100">
        <Text size="L400">Access</Text>
        <CreateRoomKindSelector
          value={kind}
          onSelect={setKind}
          canRestrict={allowRestricted}
          disabled={disabled}
        />
      </Box>
      <Box shrink="No" direction="Column" gap="100">
        <Text size="L400">Name</Text>
        <Input
          required
          before={<Icon size="100" src={getCreateRoomKindToIcon(kind)} />}
          name="nameInput"
          autoFocus
          size="500"
          variant="SurfaceVariant"
          radii="400"
          disabled={disabled}
        />
      </Box>
      <Box shrink="No" direction="Column" gap="100">
        <Text size="L400">Topic (Optional)</Text>
        <TextArea
          name="topicTextAria"
          size="500"
          variant="SurfaceVariant"
          radii="400"
          disabled={disabled}
        />
      </Box>

      {kind === CreateRoomKind.Public && <AliasInput />}

      <Box shrink="No" direction="Column" gap="100">
        <Box gap="200" alignItems="End">
          <Text size="L400">Options</Text>
          <Box grow="Yes" justifyContent="End">
            <Chip
              radii="Pill"
              before={<Icon src={advance ? Icons.ChevronTop : Icons.ChevronBottom} size="50" />}
              onClick={() => setAdvance(!advance)}
              type="button"
            >
              <Text size="T200">Advance Options</Text>
            </Chip>
          </Box>
        </Box>
        {kind !== CreateRoomKind.Public && (
          <>
            <SequenceCard
              style={{ padding: config.space.S300 }}
              variant="SurfaceVariant"
              direction="Column"
              gap="500"
            >
              <SettingTile
                title="End-to-End Encryption"
                description="Once this feature is enabled, it can't be disabled after the room is created."
                after={
                  <Switch
                    variant="Primary"
                    value={encryption}
                    onChange={setEncryption}
                    disabled={disabled}
                  />
                }
              />
            </SequenceCard>
            {advance && (allowKnock || allowKnockRestricted) && (
              <SequenceCard
                style={{ padding: config.space.S300 }}
                variant="SurfaceVariant"
                direction="Column"
                gap="500"
              >
                <SettingTile
                  title="Knock to Join"
                  description="Anyone can send request to join this room."
                  after={
                    <Switch
                      variant="Primary"
                      value={knock}
                      onChange={setKnock}
                      disabled={disabled}
                    />
                  }
                />
              </SequenceCard>
            )}
          </>
        )}

        <SequenceCard
          style={{ padding: config.space.S300 }}
          variant="SurfaceVariant"
          direction="Column"
          gap="500"
        >
          <SettingTile
            title="Allow Federation"
            description="Users from other servers can join."
            after={
              <Switch
                variant="Primary"
                value={federation}
                onChange={setFederation}
                disabled={disabled}
              />
            }
          />
        </SequenceCard>
        {advance && (
          <RoomVersionSelector
            versions={roomVersion?.available ? Object.keys(roomVersion.available) : ['1']}
            value={selectedRoomVersion}
            onChange={handleRoomVersionChange}
            disabled={disabled}
          />
        )}
      </Box>

      {error && (
        <Box style={{ color: color.Critical.Main }} alignItems="Center" gap="200">
          <Icon src={Icons.Warning} filled size="100" />
          <Text size="T300" style={{ color: color.Critical.Main }}>
            <b>
              {error instanceof MatrixError && error.name === ErrorCode.M_LIMIT_EXCEEDED
                ? `Server rate-limited your request for ${millisecondsToMinutes(
                    (error.data.retry_after_ms as number | undefined) ?? 0
                  )} minutes!`
                : error.message}
            </b>
          </Text>
        </Box>
      )}
      <Box shrink="No" direction="Column" gap="200">
        <Button
          type="submit"
          size="500"
          variant="Primary"
          radii="400"
          disabled={disabled}
          before={loading && <Spinner variant="Primary" fill="Solid" size="200" />}
        >
          <Text size="B500">Create</Text>
        </Button>
      </Box>
    </Box>
  );
}
