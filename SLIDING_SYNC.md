# Sliding Sync Implementation

This document describes the sliding sync integration added to Cinny.

## Overview

Cinny now supports Matrix's sliding sync protocol as an alternative to the traditional `/sync` endpoint. Sliding sync provides more efficient synchronization, better performance for large accounts, and fine-grained control over data loading.

## Configuration

To enable sliding sync, update your `config.json`:

```json
{
  "slidingSync": {
    "enabled": true,
    "proxyUrl": "https://your-sliding-sync-proxy.example.com",
    "defaultLists": {
      "allRooms": {
        "ranges": [[0, 49]],
        "sort": ["by_recency", "by_name"],
        "timeline_limit": 1,
        "required_state": [
          ["m.room.name", ""],
          ["m.room.avatar", ""],
          ["m.room.canonical_alias", ""],
          ["m.room.topic", ""],
          ["m.room.encryption", ""],
          ["m.room.member", "$ME"]
        ]
      },
      "directMessages": {
        "ranges": [[0, 49]],
        "sort": ["by_recency"],
        "timeline_limit": 1,
        "filters": {
          "is_dm": true
        },
        "required_state": [
          ["m.room.name", ""],
          ["m.room.avatar", ""],
          ["m.room.member", "$ME"]
        ]
      }
    }
  }
}
```

### Configuration Options

- `enabled`: Boolean to enable/disable sliding sync
- `proxyUrl`: URL of your sliding sync proxy server
- `defaultLists`: Configuration for different room lists
  - `ranges`: Array of [start, end] ranges for room pagination
  - `sort`: Array of sort methods (`by_recency`, `by_name`)
  - `timeline_limit`: Number of timeline events to fetch per room
  - `required_state`: State events to include in room data
  - `filters`: Filters to apply to the list (e.g., `is_dm` for direct messages)

## Technical Implementation

### Architecture

```
SlidingSync → Event Handlers → Jotai Atoms → Bridge → Existing Room List Atoms → UI Components
```

### Key Components

1. **Client Initialization** (`src/client/initMatrix.ts`)
   - Conditionally creates SlidingSync instance based on config
   - Falls back to traditional sync if sliding sync is disabled

2. **State Management** (`src/app/state/sliding-sync/`)
   - `slidingSync.ts`: Core atoms for sliding sync state
   - `useSlidingSync.ts`: Hooks for binding sliding sync events to atoms
   - `roomListBridge.ts`: Bridge between sliding sync data and existing room list atoms

3. **Integration** (`src/app/state/hooks/useBindAtoms.ts`)
   - Conditionally binds either sliding sync or traditional sync atoms
   - Maintains compatibility with existing UI components

### State Atoms

- `slidingSyncAtom`: Stores the SlidingSync instance
- `slidingSyncStateAtom`: Current sync state (PREPARED, SYNCING, STOPPED, ERROR)
- `slidingSyncEnabledAtom`: Boolean indicating if sliding sync is active
- `slidingSyncRoomListAtom`: Room lists from sliding sync
- `slidingSyncRoomDataAtom`: Room metadata from sliding sync
- `slidingSyncErrorAtom`: Error state

## Usage

### Enabling Sliding Sync

1. **Configuration**: Edit `config.json` to enable sliding sync and set proxy URL
2. **Restart**: Restart the Cinny application for changes to take effect
3. **Verification**: Check the settings UI to verify sliding sync is active

### Settings Interface

Cinny provides a comprehensive settings interface for sliding sync:

- **General Settings**: View sliding sync status in Settings → General → Synchronization
- **Dedicated Page**: Access detailed configuration in Settings → Sliding Sync
- **Status Indicator**: Real-time sync status displayed in the top bar
- **URL Validation**: Built-in validation for proxy URLs with helpful error messages

### Settings Features

- **Status Monitoring**: Real-time status display (Active, Syncing, Error, etc.)
- **Configuration View**: Display current proxy URL and enabled status
- **URL Examples**: Pre-configured examples of common sliding sync proxies
- **Error Reporting**: Detailed error messages when sliding sync fails
- **Validation**: URL format validation with security requirements (HTTPS)

When sliding sync is enabled:

1. The client will use sliding sync instead of traditional `/sync`
2. Room lists are populated via sliding sync events
3. Existing UI components continue to work via the bridge layer
4. Fallback to traditional sync occurs if sliding sync fails or is disabled
5. Status indicators show real-time sync state

## Requirements

- Matrix JS SDK v37.5.0+
- Sliding sync proxy server
- Compatible homeserver (Matrix 1.4+)

## Benefits

- **Performance**: Faster sync for large accounts
- **Efficiency**: Only loads visible rooms and timelines
- **Scalability**: Better handling of large room lists
- **Flexibility**: Fine-grained control over data loading

## Backward Compatibility

The implementation maintains full backward compatibility:
- Traditional sync works when sliding sync is disabled
- All existing UI components function without changes
- Progressive enhancement approach