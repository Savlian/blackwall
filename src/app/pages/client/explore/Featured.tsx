import React, { useCallback } from 'react';
import { Box, Button, color, Icon, IconButton, Icons, Scroll, Spinner, Text } from 'folds';
import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useClientConfig } from '../../../hooks/useClientConfig';
import { RoomCard, CardGrid, CardName, CardBase } from '../../../components/room-card';
import { allRoomsAtom } from '../../../state/room-list/roomList';
import { RoomSummaryLoader } from '../../../components/RoomSummaryLoader';
import {
  Page,
  PageContent,
  PageContentCenter,
  PageHeader,
  PageHero,
  PageHeroSection,
} from '../../../components/page';
import { RoomTopicViewer } from '../../../components/room-topic-viewer';
import * as css from './style.css';
import { useRoomNavigate } from '../../../hooks/useRoomNavigate';
import { ScreenSize, useScreenSizeContext } from '../../../hooks/useScreenSize';
import { BackRouteHandler } from '../../../components/BackRouteHandler';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { millify } from '../../../plugins/millify';
import { getExploreServerPath } from '../../pathUtils';

type ServerCardProps = {
  serverName: string;
  onExplore: () => unknown;
};

function ServerCard({ serverName, onExplore }: ServerCardProps) {
  const mx = useMatrixClient();

  const fetchPublicRooms = useCallback(
    () => mx.publicRooms({ server: serverName }),
    [mx, serverName]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [serverName, `publicRooms`],
    queryFn: fetchPublicRooms,
  });
  const publicRoomCount = data?.total_room_count_estimate;

  return (
    <CardBase>
      <CardName>{serverName}</CardName>
      <Box gap="100" grow="Yes" style={isError ? { color: color.Critical.Main } : undefined}>
        {isLoading ? (
          <Spinner size="50" />
        ) : (
          <>
            <Icon size="50" src={isError ? Icons.Warning : Icons.Category} />
            <Text size="T200">
              {publicRoomCount === undefined
                ? 'Error loading rooms'
                : `${millify(publicRoomCount)} Public Rooms`}
            </Text>
          </>
        )}
      </Box>
      <Button onClick={onExplore} variant="Secondary" fill="Soft" size="300">
        <Text size="B300" truncate>
          Explore Rooms
        </Text>
      </Button>
    </CardBase>
  );
}

export function FeaturedRooms() {
  const { featuredCommunities } = useClientConfig();
  const { rooms, spaces, servers } = featuredCommunities ?? {};
  const allRooms = useAtomValue(allRoomsAtom);
  const screenSize = useScreenSizeContext();
  const { navigateSpace, navigateRoom } = useRoomNavigate();
  const navigate = useNavigate();

  const exploreServer = useCallback(
    async (server: string) => {
      navigate(getExploreServerPath(server));
    },
    [navigate]
  );

  return (
    <Page>
      {screenSize === ScreenSize.Mobile && (
        <PageHeader>
          <Box shrink="No">
            <BackRouteHandler>
              {(onBack) => (
                <IconButton onClick={onBack}>
                  <Icon src={Icons.ArrowLeft} />
                </IconButton>
              )}
            </BackRouteHandler>
          </Box>
        </PageHeader>
      )}
      <Box grow="Yes">
        <Scroll hideTrack visibility="Hover">
          <PageContent>
            <PageContentCenter>
              <Box direction="Column" gap="200">
                <PageHeroSection>
                  <PageHero
                    icon={<Icon size="600" src={Icons.Bulb} />}
                    title="Featured"
                    subTitle="Find and explore public communities featured by your client provider."
                  />
                </PageHeroSection>
                <Box direction="Column" gap="700">
                  {servers && servers.length > 0 && (
                    <Box direction="Column" gap="400">
                      <Text size="H4">Featured Servers</Text>
                      <CardGrid>
                        {servers.map((serverName) => (
                          <ServerCard
                            serverName={serverName}
                            onExplore={() => exploreServer(serverName)}
                          />
                        ))}
                      </CardGrid>
                    </Box>
                  )}
                  {spaces && spaces.length > 0 && (
                    <Box direction="Column" gap="400">
                      <Text size="H4">Featured Spaces</Text>
                      <CardGrid>
                        {spaces.map((roomIdOrAlias) => (
                          <RoomSummaryLoader key={roomIdOrAlias} roomIdOrAlias={roomIdOrAlias}>
                            {(roomSummary) => (
                              <RoomCard
                                roomIdOrAlias={roomIdOrAlias}
                                allRooms={allRooms}
                                avatarUrl={roomSummary?.avatar_url}
                                name={roomSummary?.name}
                                topic={roomSummary?.topic}
                                memberCount={roomSummary?.num_joined_members}
                                onView={navigateSpace}
                                renderTopicViewer={(name, topic, requestClose) => (
                                  <RoomTopicViewer
                                    name={name}
                                    topic={topic}
                                    requestClose={requestClose}
                                  />
                                )}
                              />
                            )}
                          </RoomSummaryLoader>
                        ))}
                      </CardGrid>
                    </Box>
                  )}
                  {rooms && rooms.length > 0 && (
                    <Box direction="Column" gap="400">
                      <Text size="H4">Featured Rooms</Text>
                      <CardGrid>
                        {rooms.map((roomIdOrAlias) => (
                          <RoomSummaryLoader key={roomIdOrAlias} roomIdOrAlias={roomIdOrAlias}>
                            {(roomSummary) => (
                              <RoomCard
                                roomIdOrAlias={roomIdOrAlias}
                                allRooms={allRooms}
                                avatarUrl={roomSummary?.avatar_url}
                                name={roomSummary?.name}
                                topic={roomSummary?.topic}
                                memberCount={roomSummary?.num_joined_members}
                                onView={navigateRoom}
                                renderTopicViewer={(name, topic, requestClose) => (
                                  <RoomTopicViewer
                                    name={name}
                                    topic={topic}
                                    requestClose={requestClose}
                                  />
                                )}
                              />
                            )}
                          </RoomSummaryLoader>
                        ))}
                      </CardGrid>
                    </Box>
                  )}
                  {((spaces && spaces.length === 0 && rooms && rooms.length === 0) ||
                    (!spaces && !rooms)) && (
                    <Box
                      className={css.RoomsInfoCard}
                      direction="Column"
                      justifyContent="Center"
                      alignItems="Center"
                      gap="200"
                    >
                      <Icon size="400" src={Icons.Info} />
                      <Text size="T300" align="Center">
                        No rooms or spaces are featured.
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </PageContentCenter>
          </PageContent>
        </Scroll>
      </Box>
    </Page>
  );
}
