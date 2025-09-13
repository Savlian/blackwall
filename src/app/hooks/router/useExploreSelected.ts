import { useMatch, useParams } from 'react-router-dom';
import { getExploreFeaturedPath, getExplorePath } from '../../pages/pathUtils';
import { useClientConfig } from '../useClientConfig';

export const useExploreSelected = (): boolean => {
  const match = useMatch({
    path: getExplorePath(),
    caseSensitive: true,
    end: false,
  });

  return !!match;
};

export const useExploreFeaturedRooms = (): boolean => {
  const match = useMatch({
    path: getExploreFeaturedPath(),
    caseSensitive: true,
    end: false,
  });

  return !!match;
};

export const useExploreServer = (): string | undefined => {
  const { server } = useParams();

  return server;
};

export const useDirectoryServer = (): string | undefined => {
  const { featuredCommunities } = useClientConfig();
  return featuredCommunities?.directoryServer;
};
