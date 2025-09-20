import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ExtendedProfile } from '../../../../hooks/useExtendedProfile';

type ExtendedProfileKeys = keyof {
  [Property in keyof ExtendedProfile as string extends Property
    ? never
    : Property]: ExtendedProfile[Property];
};

type ProfileFieldElementRawProps<V, C> = {
  defaultValue: V;
  value: V;
  setValue: (value: V) => void;
} & C;

export type ProfileFieldElementProps<
  K extends ExtendedProfileKeys,
  C
> = ProfileFieldElementRawProps<ExtendedProfile[K], C>;

type ProfileFieldElements<C> = {
  [Property in ExtendedProfileKeys]?: FunctionComponent<ProfileFieldElementProps<Property, C>>;
};

type ProfileFieldContextProps<C> = {
  fieldDefaults: ExtendedProfile;
  fieldElements: ProfileFieldElements<C>;
  children: (
    reset: () => void,
    hasChanges: boolean,
    fields: ExtendedProfile,
    fieldElements: ReactNode
  ) => ReactNode;
  context: C;
};

export function ProfileFieldContext<C>({
  fieldDefaults,
  fieldElements: fieldElementConstructors,
  children,
  context,
}: ProfileFieldContextProps<C>): ReactNode {
  const [fields, setFields] = useState<ExtendedProfile>(fieldDefaults);

  const reset = useCallback(() => {
    setFields(fieldDefaults);
  }, [fieldDefaults]);

  useEffect(() => {
    reset();
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

  const hasChanges = useMemo(
    () =>
      Object.entries(fields).find(
        ([key, value]) =>
          // this is a hack but ExtendedProfile is always valid JSON anyway
          JSON.stringify(fieldDefaults[key as keyof ExtendedProfile]) !== JSON.stringify(value)
      ) !== undefined,
    [fields, fieldDefaults]
  );

  const createElement = useCallback(
    <K extends ExtendedProfileKeys>(key: K, element: ProfileFieldElements<C>[K]) => {
      const props: ProfileFieldElementRawProps<ExtendedProfile[K], C> = {
        ...context,
        defaultValue: fieldDefaults[key],
        value: fields[key],
        setValue: (value) => setField(key, value),
        key,
      };
      if (element !== undefined) {
        return React.createElement(element, props);
      }
      return undefined;
    },
    [context, fieldDefaults, fields, setField]
  );

  const fieldElements = Object.entries(fieldElementConstructors).map(([key, element]) =>
    // @ts-expect-error TypeScript doesn't quite understand the magic going on here
    createElement(key, element)
  );

  return children(reset, hasChanges, fields, fieldElements);
}
