import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { getErrorMessage } from '@/api/client';
import { createEntry, getEntries, updateEntry, uploadPhoto } from '@/api/entries';
import type { DiaryEntry, EntryRequest, PhotoUpload } from '@/types/entry';

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

  // The photo is uploaded in a second request because the upload needs the
  // entry's id. If only the upload fails, the entry is still saved and shown.
  async function addEntry(entry: EntryRequest, photo: PhotoUpload | null) {
    const created = await createEntry(entry);
    let saved = created;
    let photoError: string | null = null;

    if (photo) {
      try {
        saved = await uploadPhoto(created.id, photo);
      } catch (error) {
        photoError = getErrorMessage(error);
      }
    }

    setEntries((current) => sortNewestFirst([saved, ...current]));
    return { photoError };
  }

  // PUT replaces the whole entry, so every field is sent, with only
  // goalCompleted flipped. The card then shows what the API saved.
  async function toggleGoal(id: number) {
    const entry = entries.find((candidate) => candidate.id === id);

    if (!entry) return;

    const updated = await updateEntry(id, {
      date: entry.date,
      title: entry.title,
      story: entry.story,
      trainingGoal: entry.trainingGoal,
      goalCompleted: !entry.goalCompleted,
    });

    setEntries((current) =>
      current.map((candidate) => (candidate.id === updated.id ? updated : candidate)),
    );
  }

  return { entries, isLoading, loadError, reload, addEntry, toggleGoal };
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
