import { useRouter } from "next/dist/client/router";
import qs from "query-string";
import { useState, useCallback } from "react";

export const useQueryString = (
  key: string,
  initialValue: string
): [string, (v: string) => void] => {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  const onSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue];
};

const setQueryStringWithoutPageReload = (qsValue: string) => {
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${qsValue}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
};

const setQueryStringValue = (
  key: string,
  value: string,
  queryString?: string
) => {
  const values = qs.parse(queryString || window.location.search);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

const getQueryStringValue = (key: string, queryString?: string) => {
  const router = useRouter();
  const values = queryString ? qs.parse(queryString) : router.query;
  return values[key] as string | null;
};
