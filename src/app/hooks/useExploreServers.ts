import { AccountDataEvent } from '../../types/matrix/accountData';
import { useAccountData } from './useAccountData';
import { useMatrixClient } from './useMatrixClient';

export type InCinnyExploreServersContent = {
  servers?: string[];
};

export type ExploreServerListAction =
  | {
      type: 'APPEND';
      server: string;
    }
  | {
      type: 'DELETE';
      server: string;
    };

export const useExploreServers = (): [string[], (action: ExploreServerListAction) => void] => {
  const mx = useMatrixClient();
  const userAddedServers =
    useAccountData(AccountDataEvent.CinnyExploreServers)?.getContent<InCinnyExploreServersContent>()
      ?.servers ?? [];

  const setUserAddedServers = (action: ExploreServerListAction) => {
    if (action.type === 'APPEND') {
      mx.setAccountData(AccountDataEvent.CinnyExploreServers, {
        servers: [...userAddedServers, action.server],
      });
    } else if (action.type === 'DELETE') {
      mx.setAccountData(AccountDataEvent.CinnyExploreServers, {
        servers: userAddedServers.filter((server) => server !== action.server),
      });
    }
  };

  return [userAddedServers, setUserAddedServers];
};
