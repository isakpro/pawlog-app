import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { getErrorMessage } from '@/api/client';
import { createEntry, getEntries } from '@/api/entries';
import type { DiaryEntry, EntryRequest } from '@/types/entry';

// Same order as the API: newest date first, and the newest entry first within a day.
function sortNewestFirst(entries: DiaryEntry[]) {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

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

  async function addEntry(entry: EntryRequest) {
    const created = await createEntry(entry);
    setEntries((current) => sortNewestFirst([created, ...current]));
    return created;
  }

  return { entries, isLoading, loadError, reload, addEntry };
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
