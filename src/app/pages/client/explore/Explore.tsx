import React, { ReactNode, useCallback, useRef, useState } from 'react';
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
import { useClientConfig } from '../../../hooks/useClientConfig';
import {
  useExploreFeaturedSelected,
  useExploreServer,
} from '../../../hooks/router/useExploreSelected';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { getMxIdServer } from '../../../utils/matrix';
import { AsyncStatus, useAsyncCallback } from '../../../hooks/useAsyncCallback';
import { useNavToActivePathMapper } from '../../../hooks/useNavToActivePathMapper';
import { PageNav, PageNavContent, PageNavHeader } from '../../../components/page';
import { stopPropagation } from '../../../utils/keyboard';
import { useExploreServers } from '../../../hooks/useExploreServers';

type AddExploreServerPromptProps = {
  onSubmit: (server: string) => Promise<void>;
  children: ReactNode;
};
export function AddExploreServerPrompt({ onSubmit, children }: AddExploreServerPromptProps) {
  const [dialog, setDialog] = useState(false);
  const serverInputRef = useRef<HTMLInputElement>(null);

  const getInputServer = (): string | undefined => {
    const serverInput = serverInputRef.current;
    if (!serverInput) return undefined;
    const server = serverInput.value.trim();
    return server || undefined;
  };

  const [submitState, handleSubmit] = useAsyncCallback(
    useCallback(async () => {
      const server = getInputServer();
      if (!server) return;

      await onSubmit(server);
      setDialog(false);
    }, [onSubmit])
  );

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
                <Box grow="Yes">
                  <Text size="H4">Add Server</Text>
                </Box>
                <IconButton size="300" onClick={() => setDialog(false)} radii="300">
                  <Icon src={Icons.Cross} />
                </IconButton>
              </Header>
              <Box
                as="form"
                onSubmit={(evt) => {
                  evt.preventDefault();
                  handleSubmit();
                }}
                style={{ padding: config.space.S400 }}
                direction="Column"
                gap="400"
              >
                <Text priority="400">Add server name to explore public communities.</Text>
                <Box direction="Column" gap="100">
                  <Text size="L400">Server Name</Text>
                  <Input ref={serverInputRef} name="serverInput" variant="Background" required />
                  {submitState.status === AsyncStatus.Error && (
                    <Text style={{ color: color.Critical.Main }} size="T300">
                      Failed to load public rooms. Please try again.
                    </Text>
                  )}
                </Box>
                <Box direction="Column" gap="200">
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    variant="Secondary"
                    fill="Soft"
                    before={
                      submitState.status === AsyncStatus.Loading && (
                        <Spinner fill="Solid" variant="Secondary" size="200" />
                      )
                    }
                    disabled={submitState.status === AsyncStatus.Loading}
                  >
                    <Text size="B400">View</Text>
                  </Button>
                </Box>
              </Box>
            </Dialog>
          </FocusTrap>
        </OverlayCenter>
      </Overlay>
      <NavItem variant="Secondary">
        <NavButton onClick={() => setDialog(true)}>
          <NavItemContent>{children}</NavItemContent>
        </NavButton>
      </NavItem>
    </>
  );
}

type ExploreServerNavItemProps = {
  server: string;
  selected: boolean;
  onRemove?: (() => Promise<void>) | null;
};
export function ExploreServerNavItem({
  server,
  selected,
  onRemove = null,
}: ExploreServerNavItemProps) {
  const [hover, setHover] = useState(false);
  const { hoverProps } = useHover({ onHoverChange: setHover });
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setHover });
  const [removeState, removeCallback] = useAsyncCallback(
    useCallback(async () => {
      if (onRemove !== null) {
        await onRemove();
      }
    }, [onRemove])
  );
  const removeInProgress =
    removeState.status === AsyncStatus.Loading || removeState.status === AsyncStatus.Success;

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
              <Icon src={Icons.Category} size="100" filled={selected} />
            </Avatar>
            <Box as="span" grow="Yes">
              <Text as="span" size="Inherit" truncate>
                {server}
              </Text>
            </Box>
          </Box>
        </NavItemContent>
      </NavLink>
      {onRemove !== null && (hover || removeInProgress) && (
        <NavItemOptions>
          <IconButton
            onClick={removeCallback}
            variant="Background"
            fill="None"
            size="300"
            radii="300"
            disabled={removeInProgress}
          >
            {removeInProgress ? (
              <Spinner variant="Secondary" fill="Solid" size="200" />
            ) : (
              <Icon size="50" src={Icons.Minus} />
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
  const featuredServers =
    clientConfig.featuredCommunities?.servers?.filter((server) => server !== userServer) ?? [];
  const [exploreServers, addServer, removeServer] = useExploreServers();

  const featuredSelected = useExploreFeaturedSelected();
  const selectedServer = useExploreServer();

  const addServerCallback = useCallback(
    async (server: string) => {
      await addServer(server);
      navigate(getExploreServerPath(server));
    },
    [addServer, navigate]
  );

  const removeServerCallback = useCallback(
    async (server: string) => {
      navigate(getExploreFeaturedPath());
      await removeServer(server);
    },
    [removeServer, navigate]
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
            <NavItem variant="Background" radii="400" aria-selected={featuredSelected}>
              <NavLink to={getExploreFeaturedPath()}>
                <NavItemContent>
                  <Box as="span" grow="Yes" alignItems="Center" gap="200">
                    <Avatar size="200" radii="400">
                      <Icon src={Icons.Bulb} size="100" filled={featuredSelected} />
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
              <ExploreServerNavItem server={userServer} selected={userServer === selectedServer} />
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
              />
            ))}
            {exploreServers.map((server) => (
              <ExploreServerNavItem
                key={server}
                server={server}
                selected={server === selectedServer}
                onRemove={() => removeServerCallback(server)}
              />
            ))}
          </NavCategory>
          <Box direction="Column">
            <AddExploreServerPrompt onSubmit={addServerCallback}>
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
          </Box>
        </Box>
      </PageNavContent>
    </PageNav>
  );
}
