import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { getErrorMessage } from '@/api/client';
import { getEntries } from '@/api/entries';
import type { DiaryEntry } from '@/types/entry';

function useEntriesState() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const loaded = await getEntries();
        if (!ignore) setEntries(loaded);
      } catch (error) {
        if (!ignore) setLoadError(getErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [loadAttempt]);

  function reload() {
    setIsLoading(true);
    setLoadError(null);
    setLoadAttempt((current) => current + 1);
  }

  return { entries, isLoading, loadError, reload };
}

const EntriesContext = createContext<ReturnType<typeof useEntriesState> | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const value = useEntriesState();
  return <EntriesContext value={value}>{children}</EntriesContext>;
}

export function useEntries() {
  const context = use(EntriesContext);

  if (!context) {
    throw new Error('useEntries must be used inside EntriesProvider.');
  }

  return context;
}
