"use client";

import { onSnapshot, type DocumentData, type Query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type State<T> = {
  status: "idle" | "loading" | "success" | "error";
  data: T[];
  error: Error | null;
  retryKey: number;
};

export function useCollection<T extends DocumentData>(
  target: Query<T> | null
) {
  const [state, setState] = useState<State<T>>({
    status: target ? "loading" : "idle",
    data: [],
    error: null,
    retryKey: 0,
  });

  const retry = useCallback(() => {
    setState((current) => ({
      ...current,
      status: target ? "loading" : "idle",
      error: null,
      retryKey: current.retryKey + 1,
    }));
  }, [target]);

  useEffect(() => {
    if (!target) {
      setState({
        status: "idle",
        data: [],
        error: null,
        retryKey: 0,
      });
      return;
    }

    setState((current) => ({
      ...current,
      status: "loading",
      error: null,
    }));

    return onSnapshot(
      target,
      (snapshot) => {
        setState((current) => ({
          ...current,
          status: "success",
          data: snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          })) as T[],
          error: null,
        }));
      },
      (error) => {
        setState((current) => ({
          ...current,
          status: "error",
          data: [],
          error,
        }));
      }
    );
  }, [target, state.retryKey]);

  return {
    ...state,
    retry,
  };
}
