import { useCallback, useMemo } from 'react';
import { AccountDataEvent } from '../../types/matrix/accountData';
import { useAccountData } from './useAccountData';
import { useMatrixClient } from './useMatrixClient';

export type InCinnyBookmarkedServersContent = {
  servers?: string[];
};

export const useBookmarkedServers = (): [
  string[],
  (server: string) => Promise<void>,
  (server: string) => Promise<void>
] => {
  const mx = useMatrixClient();
  const accountData = useAccountData(AccountDataEvent.CinnyBookmarkedServers);
  const bookmarkedServers = useMemo(
    () => accountData?.getContent<InCinnyBookmarkedServersContent>()?.servers ?? [],
    [accountData]
  );

  const addServerBookmark = useCallback(
    async (server: string) => {
      if (bookmarkedServers.indexOf(server) === -1) {
        await mx.setAccountData(AccountDataEvent.CinnyBookmarkedServers, {
          servers: [...bookmarkedServers, server],
        });
      }
    },
    [mx, bookmarkedServers]
  );

  const removeServerBookmark = useCallback(
    async (server: string) => {
      await mx.setAccountData(AccountDataEvent.CinnyBookmarkedServers, {
        servers: bookmarkedServers.filter((addedServer) => server !== addedServer),
      });
    },
    [mx, bookmarkedServers]
  );

  return [bookmarkedServers, addServerBookmark, removeServerBookmark];
};
