import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ExtendedProfile } from '../../../hooks/useExtendedProfile';

const ProfileFieldContext = createContext<{
  busy: boolean;
  fieldDefaults: ExtendedProfile;
  fields: ExtendedProfile;
  setField: (key: string, value: unknown) => void;
} | null>(null);

export type ProfileFieldContextProviderProps = {
  fieldDefaults: ExtendedProfile;
  save: (fields: ExtendedProfile) => void;
  busy: boolean;
  children: (save: () => void, reset: () => void, hasChanges: boolean, fields: ExtendedProfile) => ReactNode;
};

export function ProfileFieldContextProvider({
  fieldDefaults,
  save,
  busy,
  children,
}: ProfileFieldContextProviderProps) {
  const [fields, setFields] = useState<ExtendedProfile>(fieldDefaults);

  const reset = useCallback(() => {
    setFields(fieldDefaults);
  }, [fieldDefaults]);

  useEffect(() => {
    reset()
  }, [reset]);

  const setField = useCallback(
    (key: string, value: unknown) => {
      setFields({
        ...fields,
        [key]: value,
      });
    },
    [fields]
  );

  const providerValue = useMemo(
    () => ({ busy, fieldDefaults, fields, setField }),
    [busy, fieldDefaults, fields, setField]
  );

  const hasChanges = useMemo(
    () => Object.entries(fields).find(([key, value]) => fieldDefaults[key as keyof ExtendedProfile] !== value) !== undefined,
    [fields, fieldDefaults]
  );

  return (
    <ProfileFieldContext.Provider value={providerValue}>
      {children(() => save(fields), reset, hasChanges, fields)}
    </ProfileFieldContext.Provider>
  );
}

export function useProfileField<K extends keyof ExtendedProfile>(field: K): { busy: boolean, defaultValue: ExtendedProfile[K], value: ExtendedProfile[K], setValue: (value: ExtendedProfile[K]) => void } {
  const context = useContext(ProfileFieldContext);
  if (context === null) {
    throw new Error("useProfileField() called without context");
  }

  return {
    busy: context.busy,
    defaultValue: context.fieldDefaults[field],
    value: context.fields[field],
    setValue(value) {
      context.setField(field, value);
    },
  };
}