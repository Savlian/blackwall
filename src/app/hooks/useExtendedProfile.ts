import { useCallback, useEffect } from 'react';
import z from 'zod';
import { AsyncCallback, AsyncState, useAsyncCallback } from './useAsyncCallback';
import { useMatrixClient } from './useMatrixClient';
import { useSpecVersions } from './useSpecVersions';
import { useCapabilities } from './useCapabilities';
import { IProfileFieldsCapability } from '../../types/matrix/common';

const extendedProfile = z.looseObject({
  displayname: z.string().optional(),
  avatar_url: z.string().optional(),
  'io.fsky.nyx.pronouns': z
    .object({
      language: z.string(),
      summary: z.string(),
    })
    .array()
    .optional()
    .catch(undefined),
  'us.cloke.msc4175.tz': z.string().optional().catch(undefined),
});

export type ExtendedProfile = z.infer<typeof extendedProfile>;

export function useExtendedProfileSupported(): boolean {
  const { versions, unstable_features: unstableFeatures } = useSpecVersions();

  return unstableFeatures?.['uk.tcpip.msc4133'] || versions.includes('v1.15');
}

export function useExtendedProfile(
  userId: string
): [
  AsyncState<ExtendedProfile | undefined, unknown>,
  AsyncCallback<[], ExtendedProfile | undefined>
] {
  const mx = useMatrixClient();
  const extendedProfileSupported = useExtendedProfileSupported();
  const [extendedProfileData, refresh] = useAsyncCallback(
    useCallback(async () => {
      if (extendedProfileSupported) {
        return extendedProfile.parse(await mx.getExtendedProfile(userId));
      }
      return undefined;
    }, [mx, userId, extendedProfileSupported])
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [extendedProfileData, refresh];
}

const LEGACY_FIELDS = ['displayname', 'avatar_url'];

export function useProfileFieldAllowed(field: string): boolean {
  const capabilities = useCapabilities();
  const extendedProfileSupported = useExtendedProfileSupported();

  if (LEGACY_FIELDS.includes(field)) {
    // this field might have a pre-msc4133 capability. check that first
    if (capabilities[`m.set_${field}`]?.enabled === false) {
      return false;
    }
  }

  if (extendedProfileSupported) {
    // the homeserver has msc4133 support
    const extendedProfileCapability = capabilities[
      'uk.tcpip.msc4133.profile_fields'
    ] as IProfileFieldsCapability;

    if (extendedProfileCapability === undefined) {
      // the capability is missing, assume modification is allowed
      return true;
    }

    if (!extendedProfileCapability.enabled) {
      // the capability is set to disable profile modifications
      return false;
    }

    if (
      extendedProfileCapability.allowed !== undefined &&
      !extendedProfileCapability.allowed.includes(field)
    ) {
      // the capability includes an allowlist and `field` isn't in it
      return false;
    }

    if (extendedProfileCapability.disallowed?.includes(field)) {
      // the capability includes an blocklist and `field` is in it
      return false;
    }

    // the capability is enabled and `field` isn't blocked
    return true;
  }

  // `field` is an extended profile key and the homeserver lacks msc4133 support
  return false;
}
