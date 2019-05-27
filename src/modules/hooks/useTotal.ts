import { useMemo } from "react";

export function getTotal<T>(data: T[], toMap: (v: T) => number) {
  if (!data) return 0;

  return Number(data.map(toMap).reduce((a, b) => (a || 0) + (b || 0), 0));
}

export function useTotal<T>(data: T[], toMap: (v: T) => number) {
  return useMemo(() => getTotal(data, toMap), [data, toMap]);
}
