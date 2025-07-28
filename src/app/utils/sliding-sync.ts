/**
 * Validates a sliding sync proxy URL
 */
export const validateSlidingSyncProxyUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Must be HTTPS for security
    if (parsed.protocol !== 'https:') return false;
    // Must have a hostname
    if (!parsed.hostname) return false;
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets a human-readable error message for invalid proxy URLs
 */
export const getSlidingSyncProxyUrlError = (url: string): string | null => {
  if (!url) return 'Proxy URL is required';
  
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return 'Proxy URL must use HTTPS for security';
    }
    if (!parsed.hostname) {
      return 'Proxy URL must have a valid hostname';
    }
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Common sliding sync proxy URLs for reference
 */
export const SLIDING_SYNC_PROXY_EXAMPLES = [
  'https://syncv3.matrix.org',
  'https://sliding-sync.matrix.org',
  'https://your-server.com/_matrix/sliding-sync',
];

/**
 * Default sliding sync list configurations
 */
export const DEFAULT_SLIDING_SYNC_LISTS = {
  allRooms: {
    ranges: [[0, 49]],
    sort: ['by_recency', 'by_name'],
    timeline_limit: 1,
    required_state: [
      ['m.room.name', ''],
      ['m.room.avatar', ''],
      ['m.room.canonical_alias', ''],
      ['m.room.topic', ''],
      ['m.room.encryption', ''],
      ['m.room.member', '$ME'],
    ],
  },
  directMessages: {
    ranges: [[0, 49]],
    sort: ['by_recency'],
    timeline_limit: 1,
    filters: {
      is_dm: true,
    },
    required_state: [
      ['m.room.name', ''],
      ['m.room.avatar', ''],
      ['m.room.member', '$ME'],
    ],
  },
};