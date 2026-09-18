"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  type DocumentData,
  type Query,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../config";

export type CollectionState<T> = {
  status: "idle" | "loading" | "success" | "error";
  data: (T & { id: string })[];
  loading: boolean;
  error: Error | null;
  retryKey: number;
  retry: () => void;
};

/**
 * Universal useCollection hook supporting both:
 * 1. (path: string, constraints?: QueryConstraint[])
 * 2. (target: Query<T> | null)
 *
 * Provides { data, loading, error, status, retry } with full resilience.
 */
export function useCollection<T extends DocumentData = DocumentData>(
  pathOrQuery: string | Query<T> | null,
  constraints?: Parameters<typeof query>[1][] | QueryConstraint[]
): CollectionState<T> {
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  const targetQuery = useMemo(() => {
    if (!pathOrQuery) return null;
    if (typeof pathOrQuery === "string") {
      try {
        if (constraints && constraints.length > 0) {
          return query(collection(db, pathOrQuery), ...(constraints as any)) as Query<T>;
        }
        return collection(db, pathOrQuery) as unknown as Query<T>;
      } catch (err) {
        console.warn("Failed to construct query for collection:", pathOrQuery, err);
        return null;
      }
    }
    return pathOrQuery;
  }, [pathOrQuery, constraints]);

  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(targetQuery));
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    targetQuery ? "loading" : "idle"
  );

  useEffect(() => {
    if (!targetQuery) {
      setData([]);
      setLoading(false);
      setError(null);
      setStatus("idle");
      return;
    }

    setLoading(true);
    setStatus("loading");
    setError(null);

    const unsub = onSnapshot(
      targetQuery as any,
      (snap: any) => {
        const items = snap.docs.map((d: any) => ({
          id: d.id,
          ...(d.data() as T),
        }));
        setData(items);
        setLoading(false);
        setError(null);
        setStatus("success");
      },
      (err: any) => {
        setError(err as Error);
        setLoading(false);
        setStatus("error");
      }
    );

    return () => unsub();
  }, [targetQuery, retryKey]);

  return {
    data,
    loading,
    error,
    status,
    retryKey,
    retry,
  };
}
