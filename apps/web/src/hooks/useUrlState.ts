import { useCallback, useState } from "react";
import qs from "query-string";

/**
 * A custom hook to use URL as state
 * @param key The query parameter key.
 */
export function useUrlState(key: string, defaultValue: string | null = null) {
  const [state, setState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const queryValue = qs.parse(window.location.search)[key];
    if (queryValue !== undefined) {
      return (Array.isArray(queryValue) ? queryValue[0] : queryValue) ?? null;
    }
    return defaultValue;
  });

  // Update URL when state changes
  const setUrlState = useCallback(
    (newValue: string | null) => {
      setState(newValue);
      const newQuery = {
        ...qs.parse(window.location.search),
        [key]: newValue,
      };
      const newUrl = qs.stringifyUrl({
        url: window.location.href,
        query: newQuery,
      });
      window.history.replaceState({}, "", newUrl);
    },
    [key]
  );

  return [state, setUrlState] as const;
}
