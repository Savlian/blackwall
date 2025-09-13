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
import { useExploreServers } from '../../../hooks/useExploreServers';
import { useAlive } from '../../../hooks/useAlive';
import { useClientConfig } from '../../../hooks/useClientConfig';

type AddExploreServerPromptProps = {
  onSubmit: (server: string, save: boolean) => Promise<void>;
  header: ReactNode;
  children: ReactNode;
  selected?: boolean;
};
export function AddExploreServerPrompt({
  onSubmit,
  header,
  children,
  selected = false,
}: AddExploreServerPromptProps) {
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

  const submit = useCallback(
    async (save: boolean) => {
      const server = getInputServer();
      if (!server) return;

      await mx.publicRooms({ server, limit: 1 });
      await onSubmit(server, save);
      if (alive()) {
        setDialog(false);
      }
    },
    [alive, onSubmit, mx]
  );

  const [viewState, handleView] = useAsyncCallback(() => submit(false));
  const [saveViewState, handleSaveView] = useAsyncCallback(() => submit(true));
  const busy =
    viewState.status === AsyncStatus.Loading || saveViewState.status === AsyncStatus.Loading;

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
              <Box style={{ padding: config.space.S400 }} direction="Column" gap="400">
                <Text priority="400">Add server name to explore public communities.</Text>
                <Box direction="Column" gap="100">
                  <Text size="L400">Server Name</Text>
                  <Input ref={serverInputRef} name="serverInput" variant="Background" required />
                  {viewState.status === AsyncStatus.Error && (
                    <Text style={{ color: color.Critical.Main }} size="T300">
                      Failed to load public rooms. Please try again.
                    </Text>
                  )}
                </Box>
                <Box direction="Column" gap="200">
                  <Button
                    type="submit"
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
                    <Text size="B400">Save & View</Text>
                  </Button>
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
            variant="Background"
            fill="None"
            size="300"
            radii="300"
            disabled={actionInProgress}
          >
            {actionInProgress ? (
              <Spinner variant="Secondary" fill="Solid" size="200" />
            ) : (
              <Icon size="50" src={action.icon} />
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
  const clientConfig = useClientConfig();
  const userServer = userId ? getMxIdServer(userId) : undefined;
  const featuredServers = useMemo(
    () =>
      clientConfig.featuredCommunities?.servers?.filter((server) => server !== userServer) ?? [],
    [clientConfig, userServer]
  );
  const [exploreServers, addServer, removeServer] = useExploreServers(featuredServers);

  const selectedServer = useExploreServer();
  const exploringFeaturedRooms = useExploreFeaturedRooms();
  const exploringUnlistedServer = useMemo(
    () =>
      !(
        selectedServer === undefined ||
        selectedServer === userServer ||
        featuredServers.includes(selectedServer) ||
        exploreServers.includes(selectedServer)
      ),
    [exploreServers, selectedServer, userServer, featuredServers]
  );

  const addServerCallback = useCallback(
    async (server: string, save: boolean) => {
      if (save && server !== userServer && !featuredServers.includes(server) && selectedServer) {
        await addServer(server);
      }
      navigate(getExploreServerPath(server));
    },
    [addServer, navigate, userServer, featuredServers, selectedServer]
  );

  const removeServerCallback = useCallback(
    async (server: string) => {
      await removeServer(server);
    },
    [removeServer]
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
                icon={Icons.Server}
                action={{
                  alwaysVisible: true,
                  icon: Icons.Plus,
                  onClick: () => addServerCallback(selectedServer, true),
                }}
              />
            )}
          </NavCategory>
          <NavCategory>
            <NavCategoryHeader>
              <Text size="O400" style={{ paddingLeft: config.space.S200 }}>
                Servers
              </Text>
            </NavCategoryHeader>
            {featuredServers.map((server) => (
              <ExploreServerNavItem
                key={server}
                server={server}
                selected={server === selectedServer}
                icon={Icons.Server}
              />
            ))}
            {exploreServers.map((server) => (
              <ExploreServerNavItem
                key={server}
                server={server}
                selected={server === selectedServer}
                icon={Icons.Server}
                action={{
                  alwaysVisible: false,
                  icon: Icons.Minus,
                  onClick: () => removeServerCallback(server),
                }}
              />
            ))}
            <AddExploreServerPrompt
              onSubmit={addServerCallback}
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
            </AddExploreServerPrompt>
          </NavCategory>
        </Box>
      </PageNavContent>
    </PageNav>
  );
}
