import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Header,
  Icon,
  IconButton,
  IconSrc,
  Icons,
  Input,
  Overlay,
  OverlayBackdrop,
  OverlayCenter,
  Spinner,
  Text,
  color,
  config,
} from 'folds';
import { useFocusWithin, useHover } from 'react-aria';
import {
  NavButton,
  NavCategory,
  NavCategoryHeader,
  NavItem,
  NavItemContent,
  NavItemOptions,
  NavLink,
} from '../../../components/nav';
import { getExploreFeaturedPath, getExploreServerPath } from '../../pathUtils';
import {
  useExploreFeaturedRooms,
  useExploreServer,
} from '../../../hooks/router/useExploreSelected';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { getMxIdServer } from '../../../utils/matrix';
import { AsyncStatus, useAsyncCallback } from '../../../hooks/useAsyncCallback';
import { useNavToActivePathMapper } from '../../../hooks/useNavToActivePathMapper';
import { PageNav, PageNavContent, PageNavHeader } from '../../../components/page';
import { stopPropagation } from '../../../utils/keyboard';
import { useBookmarkedServers } from '../../../hooks/useBookmarkedServers';
import { useAlive } from '../../../hooks/useAlive';

type ExploreServerPromptProps = {
  onSubmit: (server: string, save: boolean) => Promise<void>;
  header: ReactNode;
  children: ReactNode;
  selected?: boolean;
};
export function ExploreServerPrompt({
  onSubmit,
  header,
  children,
  selected = false,
}: ExploreServerPromptProps) {
  const mx = useMatrixClient();
  const [dialog, setDialog] = useState(false);
  const alive = useAlive();
  const serverInputRef = useRef<HTMLInputElement>(null);

  const getInputServer = (): string | undefined => {
    const serverInput = serverInputRef.current;
    if (!serverInput) return undefined;
    const server = serverInput.value.trim();
    return server || undefined;
  };

  const handleSubmit = useCallback(
    async (saveBookmark: boolean) => {
      const server = getInputServer();
      if (!server) return;

      await mx.publicRooms({ server, limit: 1 });
      await onSubmit(server, saveBookmark);
      if (alive()) {
        setDialog(false);
      }
    },
    [alive, onSubmit, mx]
  );

  const [viewState, handleView] = useAsyncCallback(() => handleSubmit(false));
  const [saveViewState, handleSaveView] = useAsyncCallback(() => handleSubmit(true));
  const busy =
    viewState.status === AsyncStatus.Loading || saveViewState.status === AsyncStatus.Loading;
  const failed =
    viewState.status === AsyncStatus.Error || saveViewState.status === AsyncStatus.Error;

  return (
    <>
      <Overlay open={dialog} backdrop={<OverlayBackdrop />}>
        <OverlayCenter>
          <FocusTrap
            focusTrapOptions={{
              initialFocus: false,
              clickOutsideDeactivates: true,
              onDeactivate: () => setDialog(false),
              escapeDeactivates: stopPropagation,
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
                <Box grow="Yes">{header}</Box>
                <IconButton size="300" onClick={() => setDialog(false)} radii="300">
                  <Icon src={Icons.Cross} />
                </IconButton>
              </Header>
              <Box as="form" style={{ padding: config.space.S400 }} direction="Column" gap="400">
                <Text priority="400">Add server name to explore public communities.</Text>
                <Box direction="Column" gap="100">
                  <Text size="L400">Server Name</Text>
                  <Input ref={serverInputRef} name="serverInput" variant="Background" required />
                  {failed && (
                    <Text style={{ color: color.Critical.Main }} size="T300">
                      Failed to load public rooms. Please try again.
                    </Text>
                  )}
                  <Box direction="Column" gap="200">
                    <Button
                      type="button"
                      onClick={handleView}
                      variant="Secondary"
                      fill="Soft"
                      before={
                        viewState.status === AsyncStatus.Loading && (
                          <Spinner fill="Solid" variant="Secondary" size="200" />
                        )
                      }
                      disabled={busy}
                    >
                      <Text size="B400">View</Text>
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSaveView}
                      variant="Primary"
                      fill="Soft"
                      before={
                        saveViewState.status === AsyncStatus.Loading && (
                          <Spinner fill="Solid" variant="Secondary" size="200" />
                        )
                      }
                      disabled={busy}
                    >
                      <Text size="B400">Bookmark & View</Text>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Dialog>
          </FocusTrap>
        </OverlayCenter>
      </Overlay>
      <NavItem variant="Background" aria-selected={selected}>
        <NavButton onClick={() => setDialog(true)}>
          <NavItemContent>{children}</NavItemContent>
        </NavButton>
      </NavItem>
    </>
  );
}

type ExploreServerNavItemAction = {
  onClick: () => Promise<void>;
  icon: IconSrc;
  filled?: boolean;
  alwaysVisible: boolean;
};
type ExploreServerNavItemProps = {
  server: string;
  selected: boolean;
  icon: IconSrc;
  action?: ExploreServerNavItemAction;
};
export function ExploreServerNavItem({
  server,
  selected,
  icon,
  action,
}: ExploreServerNavItemProps) {
  const [hover, setHover] = useState(false);
  const { hoverProps } = useHover({ onHoverChange: setHover });
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setHover });
  const [actionState, actionCallback] = useAsyncCallback(
    useCallback(async () => {
      await action?.onClick();
    }, [action])
  );
  const actionInProgress =
    actionState.status === AsyncStatus.Loading || actionState.status === AsyncStatus.Success;

  return (
    <NavItem
      variant="Background"
      radii="400"
      aria-selected={selected}
      {...hoverProps}
      {...focusWithinProps}
    >
      <NavLink to={getExploreServerPath(server)}>
        <NavItemContent>
          <Box as="span" grow="Yes" alignItems="Center" gap="200">
            <Avatar size="200" radii="400">
              <Icon src={icon} size="100" filled={selected} />
            </Avatar>
            <Box as="span" grow="Yes">
              <Text as="span" size="Inherit" truncate>
                {server}
              </Text>
            </Box>
          </Box>
        </NavItemContent>
      </NavLink>
      {action !== undefined && (hover || actionInProgress || action.alwaysVisible) && (
        <NavItemOptions>
          <IconButton
            onClick={actionCallback}
            variant={selected ? 'Background' : 'Surface'}
            fill="None"
            outlined={action.alwaysVisible}
            size="300"
            radii="300"
            disabled={actionInProgress}
          >
            {actionInProgress ? (
              <Spinner variant="Secondary" fill="Solid" size="50" />
            ) : (
              <Icon size="50" src={action.icon} filled={action.filled} />
            )}
          </IconButton>
        </NavItemOptions>
      )}
    </NavItem>
  );
}

export function Explore() {
  const mx = useMatrixClient();
  const navigate = useNavigate();
  useNavToActivePathMapper('explore');
  const userId = mx.getUserId();
  const userServer = userId ? getMxIdServer(userId) : undefined;
  const [bookmarkedServers, addServerBookmark, removeServerBookmark] = useBookmarkedServers();

  const selectedServer = useExploreServer();
  const exploringFeaturedRooms = useExploreFeaturedRooms();
  const exploringUnlistedServer = useMemo(
    () =>
      !(
        selectedServer === undefined ||
        selectedServer === userServer ||
        bookmarkedServers.includes(selectedServer)
      ),
    [bookmarkedServers, selectedServer, userServer]
  );

  const viewServerCallback = useCallback(
    async (server: string, saveBookmark: boolean) => {
      if (saveBookmark && server !== userServer && selectedServer) {
        await addServerBookmark(server);
      }
      navigate(getExploreServerPath(server));
    },
    [addServerBookmark, navigate, userServer, selectedServer]
  );

  const removeServerBookmarkCallback = useCallback(
    async (server: string) => {
      await removeServerBookmark(server);
    },
    [removeServerBookmark]
  );

  return (
    <PageNav>
      <PageNavHeader>
        <Box grow="Yes" gap="300">
          <Box grow="Yes">
            <Text size="H4" truncate>
              Explore Community
            </Text>
          </Box>
        </Box>
      </PageNavHeader>

      <PageNavContent>
        <Box direction="Column" gap="300">
          <NavCategory>
            <NavItem variant="Background" radii="400" aria-selected={exploringFeaturedRooms}>
              <NavLink to={getExploreFeaturedPath()}>
                <NavItemContent>
                  <Box as="span" grow="Yes" alignItems="Center" gap="200">
                    <Avatar size="200" radii="400">
                      <Icon src={Icons.Bulb} size="100" filled={exploringFeaturedRooms} />
                    </Avatar>
                    <Box as="span" grow="Yes">
                      <Text as="span" size="Inherit" truncate>
                        Featured
                      </Text>
                    </Box>
                  </Box>
                </NavItemContent>
              </NavLink>
            </NavItem>
            {userServer && (
              <ExploreServerNavItem
                server={userServer}
                selected={userServer === selectedServer}
                icon={Icons.Home}
              />
            )}
            {exploringUnlistedServer && selectedServer !== undefined && (
              <ExploreServerNavItem
                server={selectedServer}
                selected
                icon={Icons.Eye}
                action={{
                  alwaysVisible: true,
                  icon: Icons.Bookmark,
                  onClick: () => viewServerCallback(selectedServer, true),
                }}
              />
            )}
          </NavCategory>
          <NavCategory>
            <NavCategoryHeader>
              <Text size="O400" style={{ paddingLeft: config.space.S200 }}>
                Bookmarks
              </Text>
            </NavCategoryHeader>
            {bookmarkedServers.map((server) => (
              <ExploreServerNavItem
                key={server}
                server={server}
                selected={server === selectedServer}
                icon={Icons.Server}
                action={{
                  alwaysVisible: false,
                  icon: Icons.Minus,
                  onClick: () => removeServerBookmarkCallback(server),
                }}
              />
            ))}
            <ExploreServerPrompt
              onSubmit={viewServerCallback}
              header={<Text size="H4">Add Server</Text>}
            >
              <Box as="span" grow="Yes" alignItems="Center" gap="200">
                <Avatar size="200" radii="400">
                  <Icon src={Icons.Plus} size="100" />
                </Avatar>
                <Box as="span" grow="Yes">
                  <Text as="span" size="Inherit" truncate>
                    Add Server
                  </Text>
                </Box>
              </Box>
            </ExploreServerPrompt>
          </NavCategory>
        </Box>
      </PageNavContent>
    </PageNav>
  );
}
