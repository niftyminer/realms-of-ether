import qs from "query-string";
import { useState, useCallback } from "react";

export const useQueryString = (key: string, initialValue: string) => {
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
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

const getQueryStringValue = (
  key: string,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};
