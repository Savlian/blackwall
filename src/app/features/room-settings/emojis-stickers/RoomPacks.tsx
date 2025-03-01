import React, { useMemo } from 'react';
import { Box, Text, Button, Icon, Icons, Avatar, AvatarImage, AvatarFallback } from 'folds';
import { SequenceCard } from '../../../components/sequence-card';
import { ImagePack, ImageUsage } from '../../../plugins/custom-emoji';
import { useRoom } from '../../../hooks/useRoom';
import { useRoomImagePacks } from '../../../hooks/useImagePacks';
import { LineClamp2 } from '../../../styles/Text.css';
import { SettingTile } from '../../../components/setting-tile';
import { SequenceCardStyle } from '../styles.css';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { mxcUrlToHttp } from '../../../utils/matrix';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import { usePowerLevels, usePowerLevelsAPI } from '../../../hooks/usePowerLevels';
import { StateEvent } from '../../../../types/matrix/room';

type RoomPacksProps = {
  onViewPack: (imagePack: ImagePack) => void;
};
export function RoomPacks({ onViewPack }: RoomPacksProps) {
  const mx = useMatrixClient();
  const useAuthentication = useMediaAuthentication();
  const room = useRoom();
  const powerLevels = usePowerLevels(room);
  const { canSendStateEvent, getPowerLevel } = usePowerLevelsAPI(powerLevels);
  const canEdit = canSendStateEvent(StateEvent.PoniesRoomEmotes, getPowerLevel(mx.getSafeUserId()));
  const removed = false;

  const unfilteredPacks = useRoomImagePacks(room);
  const packs = useMemo(() => unfilteredPacks.filter((pack) => !pack.deleted), [unfilteredPacks]);

  const renderPack = (pack: ImagePack) => {
    const avatarMxc = pack.getAvatarUrl(ImageUsage.Emoticon);
    const avatarUrl = avatarMxc ? mxcUrlToHttp(mx, avatarMxc, useAuthentication) : undefined;
    const { address } = pack;
    if (!address) return null;

    return (
      <SequenceCard
        key={pack.id}
        className={SequenceCardStyle}
        variant={removed ? 'Critical' : 'SurfaceVariant'}
        direction="Column"
        gap="400"
      >
        <SettingTile
          title={
            <span style={{ textDecoration: removed ? 'line-through' : undefined }}>
              {pack.meta.name ?? 'Unknown'}
            </span>
          }
          description={<span className={LineClamp2}>{pack.meta.attribution}</span>}
          before={
            <Box alignItems="Center" gap="300">
              {/* {removed ? (
                  <IconButton
                    size="300"
                    radii="Pill"
                    variant="Critical"
                    onClick={() => handleUndoRemove(address)}
                    disabled={applyingChanges}
                  >
                    <Icon src={Icons.Plus} size="100" />
                  </IconButton>
                ) : (
                  <IconButton
                    size="300"
                    radii="Pill"
                    variant="Secondary"
                    onClick={() => handleRemove(address)}
                    disabled={applyingChanges}
                  >
                    <Icon src={Icons.Cross} size="100" />
                  </IconButton>
                )} */}
              <Avatar size="300" radii="300">
                {avatarUrl ? (
                  <AvatarImage style={{ objectFit: 'contain' }} src={avatarUrl} />
                ) : (
                  <AvatarFallback>
                    <Icon size="400" src={Icons.Sticker} filled />
                  </AvatarFallback>
                )}
              </Avatar>
            </Box>
          }
          after={
            !removed && (
              <Button
                variant="Secondary"
                fill="Soft"
                size="300"
                radii="300"
                outlined
                onClick={() => onViewPack(pack)}
              >
                <Text size="B300">View</Text>
              </Button>
            )
          }
        />
      </SequenceCard>
    );
  };

  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Packs</Text>
      {/* <SequenceCard
        className={SequenceCardStyle}
        variant="SurfaceVariant"
        direction="Column"
        gap="400"
      >
      </SequenceCard> */}
      {packs.map(renderPack)}
    </Box>
  );
}
