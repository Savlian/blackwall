# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cinny is a Matrix client built with React, TypeScript, and Vite. It focuses on providing a simple, elegant, and secure interface for Matrix messaging. The application uses modern web technologies including React 18, Matrix JS SDK, and Jotai for state management.

## Development Commands

```bash
# Install dependencies
npm ci

# Start development server (runs on port 8080)
npm start

# Build for production
npm run build

# Lint code (ESLint + Prettier)
npm run lint

# Type checking
npm run typecheck

# Individual lint checks
npm run check:eslint    # ESLint only
npm run check:prettier  # Prettier only
npm run fix:prettier    # Auto-fix Prettier issues
```

## Architecture Overview

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Matrix SDK WASM support
- **State Management**: Jotai atoms with custom hooks for Matrix client binding
- **Styling**: Vanilla Extract CSS-in-JS + SCSS
- **Matrix SDK**: matrix-js-sdk with IndexedDB storage and Rust crypto
- **Routing**: React Router v6
- **Data Fetching**: React Query (TanStack Query)

### Key Directories Structure

- `src/app/` - Main application code
  - `atoms/` - Base UI components (buttons, inputs, modals, etc.)
  - `components/` - Reusable business logic components
  - `features/` - Feature-specific components and logic
  - `hooks/` - Custom React hooks
  - `pages/` - Route components and app setup
  - `state/` - Jotai atoms and state management
  - `utils/` - Utility functions
- `src/client/` - Matrix client initialization and management
- `public/` - Static assets (icons, fonts, locales)

### State Management Architecture

Cinny uses Jotai for state management with a unique pattern:
- **Atoms**: Defined in `src/app/state/` for different data types (rooms, invites, unread counts, etc.)
- **Binding**: Matrix client events are bound to atoms via `useBindAtoms` hooks
- **Hooks**: Custom hooks in `src/app/state/hooks/` provide convenient access to atom values

Key state atoms:
- `allRoomsAtom` - All joined rooms
- `allInvitesAtom` - Room invitations  
- `roomToUnreadAtom` - Unread message counts
- `mDirectAtom` - Direct message room mappings
- `roomToParentsAtom` - Space/room hierarchies

### Matrix Client Integration

The Matrix client is initialized in `src/client/initMatrix.ts`:
- Uses IndexedDB for message storage and crypto store
- Enables Rust crypto for end-to-end encryption
- Lazy loads room members for performance
- Custom crypto callbacks for secret storage

### Component Architecture

- **Atoms**: Basic UI building blocks in `src/app/atoms/`
- **Components**: Business logic components in `src/app/components/`
- **Features**: Complete feature implementations in `src/app/features/`
- **Styling**: Mix of Vanilla Extract (`.css.ts`) and SCSS files

### Key Features

- **Rooms & Spaces**: Full Matrix rooms and spaces support
- **End-to-End Encryption**: Device verification and cross-signing
- **Message Types**: Text, images, files, audio, video with rich content
- **Themes**: Light/dark mode support
- **PWA**: Service worker with offline capabilities
- **Internationalization**: i18next with multiple language support
- **Sliding Sync**: Matrix sliding sync protocol support for improved performance

### Sliding Sync Integration

Cinny now supports Matrix's sliding sync protocol as implemented in `src/app/state/sliding-sync/`:

- **Configuration**: Enabled via `config.json` with proxy URL and list configurations
- **State Management**: Dedicated Jotai atoms for sliding sync state and data
- **Bridge**: Transparent integration with existing room list atoms for UI compatibility
- **Fallback**: Automatic fallback to traditional sync when disabled

Key files:
- `src/client/initMatrix.ts` - Client initialization with sliding sync support
- `src/app/state/sliding-sync/` - Sliding sync state management and bridge logic
- `SLIDING_SYNC.md` - Detailed implementation documentation

## Configuration Files

- `config.json` - Client configuration (homeservers, features)
- `build.config.ts` - Build-time configuration (base path)
- `vite.config.js` - Vite build configuration with Matrix SDK WASM support
- `tsconfig.json` - TypeScript configuration

## Development Notes

### Matrix SDK Integration
- WASM files for Matrix SDK crypto are served via custom Vite plugin
- IndexedDB is used for persistent storage of messages and crypto data
- Client state is bound to Jotai atoms for reactive UI updates

### Styling Approach
- Primary styling uses Vanilla Extract for type-safe CSS-in-JS
- Legacy SCSS files exist in some components
- CSS custom properties for theming support

### Testing & Quality
- ESLint with Airbnb config + TypeScript rules
- Prettier for code formatting
- TypeScript strict mode enabled
- No test framework currently configured

### Build Process
- Vite handles bundling with React plugin
- Service worker built with vite-plugin-pwa
- Static files copied from public/ and node_modules/
- WASM support for Matrix SDK crypto functionality