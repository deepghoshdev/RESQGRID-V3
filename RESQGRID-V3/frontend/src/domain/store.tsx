import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { initialState } from "./fixtures";
import type { DemoState } from "./types";
const KEY = "resqgrid-v3-demo-v1";
const Context = createContext<{
  state: DemoState;
  mutate: (fn: (s: DemoState) => DemoState, action?: string) => void;
  reset: () => void;
  notice: string;
  notify: (s: string) => void;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      return saved?.rules &&
        Array.isArray(saved.incidents) &&
        Array.isArray(saved.agencies)
        ? saved
        : initialState();
    } catch {
      return initialState();
    }
  });
  const [notice, notify] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      notify(
        "Browser storage is unavailable. Demo changes will last for this session.",
      );
    }
  }, [state]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const mutate = (fn: (s: DemoState) => DemoState, action?: string) =>
    setState((s) => {
      const result = fn(s);
      return action
        ? {
            ...result,
            audit: [
              {
                id: crypto.randomUUID(),
                time: new Date().toISOString(),
                action,
              },
              ...result.audit,
            ].slice(0, 200),
          }
        : result;
    });
  return (
    <Context.Provider
      value={{
        state,
        mutate,
        reset: () => setState(initialState()),
        notice,
        notify,
      }}
    >
      {children}
      <div className={"toast " + (notice ? "visible" : "")} role="status">
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useDemo() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Demo provider unavailable");
  return ctx;
}
