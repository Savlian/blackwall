import React from 'react';
import {
  Box,
  Header,
  Icon,
  IconButton,
  Icons,
  Modal,
  Overlay,
  OverlayBackdrop,
  OverlayCenter,
  Scroll,
  Text,
} from 'folds';
import FocusTrap from 'focus-trap-react';
import { useAllJoinedRoomsSet, useGetRoom } from '../../hooks/useGetRoom';
import { SpaceProvider } from '../../hooks/useSpace';
import { CreateRoomForm } from './CreateRoom';
import {
  useCloseCreateRoomModal,
  useCreateRoomModalState,
} from '../../state/hooks/createRoomModal';
import { CreateRoomModalState } from '../../state/createRoomModal';
import * as css from './styles.css';
import { stopPropagation } from '../../utils/keyboard';

type CreateRoomModalProps = {
  state: CreateRoomModalState;
};
function CreateRoomModal({ state }: CreateRoomModalProps) {
  const { spaceId } = state;
  const closeDialog = useCloseCreateRoomModal();

  const allJoinedRooms = useAllJoinedRoomsSet();
  const getRoom = useGetRoom(allJoinedRooms);
  const space = spaceId ? getRoom(spaceId) : undefined;

  return (
    <SpaceProvider value={space ?? null}>
      <Overlay open backdrop={<OverlayBackdrop />}>
        <OverlayCenter>
          <FocusTrap
            focusTrapOptions={{
              initialFocus: false,
              clickOutsideDeactivates: true,
              onDeactivate: closeDialog,
              escapeDeactivates: stopPropagation,
            }}
          >
            <Modal className={css.CreateRoomModal} size="300" flexHeight>
              <Box direction="Column">
                <Header size="500" className={css.CreateRoomModalHeader}>
                  <Box grow="Yes">
                    <Text size="H4">New Room</Text>
                  </Box>
                  <Box shrink="No">
                    <IconButton size="300" radii="300" onClick={closeDialog}>
                      <Icon src={Icons.Cross} />
                    </IconButton>
                  </Box>
                </Header>
                <Scroll size="300" hideTrack>
                  <Box className={css.CreateRoomModalContent} direction="Column" gap="500">
                    <CreateRoomForm space={space} onCreate={closeDialog} />
                  </Box>
                </Scroll>
              </Box>
            </Modal>
          </FocusTrap>
        </OverlayCenter>
      </Overlay>
    </SpaceProvider>
  );
}

export function CreateRoomModalRenderer() {
  const state = useCreateRoomModalState();

  if (!state) return null;
  return <CreateRoomModal state={state} />;
}
