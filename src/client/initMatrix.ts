import { createClient, MatrixClient, IndexedDBStore, IndexedDBCryptoStore } from 'matrix-js-sdk';
import { SlidingSync } from 'matrix-js-sdk/lib/sliding-sync';
import { SlidingSyncSdk } from 'matrix-js-sdk/lib/sliding-sync-sdk';

import { cryptoCallbacks } from './state/secretStorageKeys';
import { clearNavToActivePathStore } from '../app/state/navToActivePath';
import { ClientConfig } from '../app/hooks/useClientConfig';

type Session = {
  baseUrl: string;
  accessToken: string;
  userId: string;
  deviceId: string;
};

export const initClient = async (session: Session, clientConfig?: ClientConfig): Promise<MatrixClient> => {
  const indexedDBStore = new IndexedDBStore({
    indexedDB: global.indexedDB,
    localStorage: global.localStorage,
    dbName: 'web-sync-store',
  });

  const legacyCryptoStore = new IndexedDBCryptoStore(global.indexedDB, 'crypto-store');

  const mx = createClient({
    baseUrl: session.baseUrl,
    accessToken: session.accessToken,
    userId: session.userId,
    store: indexedDBStore,
    cryptoStore: legacyCryptoStore,
    deviceId: session.deviceId,
    timelineSupport: true,
    cryptoCallbacks: cryptoCallbacks as any,
    verificationMethods: ['m.sas.v1'],
  });

  await indexedDBStore.startup();
  await mx.initRustCrypto();

  mx.setMaxListeners(50);

  return mx;
};

// Store sliding sync instance globally for atom access
let globalSlidingSync: SlidingSync | null = null;

export const getSlidingSync = (): SlidingSync | null => globalSlidingSync;

export const startClient = async (mx: MatrixClient, clientConfig?: ClientConfig) => {
  // Check if sliding sync is enabled
  if (clientConfig?.slidingSync?.enabled) {
    try {
      const lists = new Map();
      Object.entries(clientConfig.slidingSync.defaultLists || {}).forEach(([key, config]) => {
        lists.set(key, {
          ranges: config.ranges,
          sort: config.sort || ['by_recency'],
          timeline_limit: config.timeline_limit || 1,
          required_state: config.required_state || [],
          filters: config.filters,
        });
      });

      // Use native sliding sync if no proxy URL, otherwise use proxy
      const proxyUrl = clientConfig.slidingSync.proxyUrl;
      const slidingSync = new SlidingSync(
        proxyUrl || mx.baseUrl, // Use homeserver base URL for native sliding sync
        lists,
        {},
        mx,
        5000 // timeout
      );

      // Store globally for atom access
      globalSlidingSync = slidingSync;

      // Use SlidingSyncSdk as a drop-in replacement for traditional sync
      const slidingSyncSdk = new SlidingSyncSdk(slidingSync, mx);
      
      // Start sliding sync with timeout and error handling
      const slidingSyncPromise = slidingSync.start();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sliding sync timeout')), 10000)
      );
      
      await Promise.race([slidingSyncPromise, timeoutPromise]);
      
      console.log('Sliding sync started successfully');
      return;
    } catch (error) {
      console.warn('Sliding sync failed, falling back to traditional sync:', error);
      globalSlidingSync = null;
      // Fall through to traditional sync
    }
  }

  // Reset global sliding sync for traditional sync
  globalSlidingSync = null;

  // Fallback to traditional sync
  await mx.startClient({
    lazyLoadMembers: true,
  });
};

export const clearCacheAndReload = async (mx: MatrixClient) => {
  mx.stopClient();
  clearNavToActivePathStore(mx.getSafeUserId());
  await mx.store.deleteAllData();
  window.location.reload();
};

export const logoutClient = async (mx: MatrixClient) => {
  mx.stopClient();
  try {
    await mx.logout();
  } catch {
    // ignore if failed to logout
  }
  await mx.clearStores();
  window.localStorage.clear();
  window.location.reload();
};

export const clearLoginData = async () => {
  const dbs = await window.indexedDB.databases();

  dbs.forEach((idbInfo) => {
    const { name } = idbInfo;
    if (name) {
      window.indexedDB.deleteDatabase(name);
    }
  });

  window.localStorage.clear();
  window.location.reload();
};
