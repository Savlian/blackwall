import React, { useCallback, useRef, useState } from 'react';
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

export function AddExploreServerPrompt() {
  const mx = useMatrixClient();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(false);
  const [, addServer] = useExploreServers();
  const serverInputRef = useRef<HTMLInputElement>(null);

  const [exploreState] = useAsyncCallback(
    useCallback((server: string) => mx.publicRooms({ server, limit: 1 }), [mx])
  );

  const getInputServer = (): string | undefined => {
    const serverInput = serverInputRef.current;
    if (!serverInput) return undefined;
    const server = serverInput.value.trim();
    return server || undefined;
  };

  const handleSubmit = useCallback(() => {
    const server = getInputServer();
    if (!server) return;

    setDialog(false);
    addServer(server);
    navigate(getExploreServerPath(server));
  }, [navigate, addServer]);

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
                  {exploreState.status === AsyncStatus.Error && (
                    <Text style={{ color: color.Critical.Main }} size="T300">
                      Failed to load public rooms. Please try again.
                    </Text>
                  )}
                </Box>
                <Box direction="Column" gap="200">
                  {/* <Button
                    type="submit"
                    variant="Secondary"
                    before={
                      exploreState.status === AsyncStatus.Loading ? (
                        <Spinner fill="Solid" variant="Secondary" size="200" />
                      ) : undefined
                    }
                    aria-disabled={exploreState.status === AsyncStatus.Loading}
                  >
                    <Text size="B400">Save</Text>
                  </Button> */}

                  <Button type="submit" onClick={handleSubmit} variant="Secondary" fill="Soft">
                    <Text size="B400">View</Text>
                  </Button>
                </Box>
              </Box>
            </Dialog>
          </FocusTrap>
        </OverlayCenter>
      </Overlay>
      <Button
        variant="Secondary"
        fill="Soft"
        size="300"
        before={<Icon size="100" src={Icons.Plus} />}
        onClick={() => setDialog(true)}
      >
        <Text size="B300" truncate>
          Add Server
        </Text>
      </Button>
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
  useNavToActivePathMapper('explore');
  const userId = mx.getUserId();
  const clientConfig = useClientConfig();
  const userServer = userId ? getMxIdServer(userId) : undefined;
  const featuredServers =
    clientConfig.featuredCommunities?.servers?.filter((server) => server !== userServer) ?? [];
  const [exploreServers, , removeServer] = useExploreServers();

  const featuredSelected = useExploreFeaturedSelected();
  const selectedServer = useExploreServer();

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
              <NavItem
                variant="Background"
                radii="400"
                aria-selected={selectedServer === userServer}
              >
                <NavLink to={getExploreServerPath(userServer)}>
                  <NavItemContent>
                    <Box as="span" grow="Yes" alignItems="Center" gap="200">
                      <Avatar size="200" radii="400">
                        <Icon
                          src={Icons.Category}
                          size="100"
                          filled={selectedServer === userServer}
                        />
                      </Avatar>
                      <Box as="span" grow="Yes">
                        <Text as="span" size="Inherit" truncate>
                          {userServer}
                        </Text>
                      </Box>
                    </Box>
                  </NavItemContent>
                </NavLink>
              </NavItem>
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
                onRemove={() => removeServer(server)}
              />
            ))}
          </NavCategory>
          <Box direction="Column">
            <AddExploreServerPrompt />
          </Box>
        </Box>
      </PageNavContent>
    </PageNav>
  );
}
