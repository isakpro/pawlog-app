import { Platform } from 'react-native';

import type { DiaryEntry, EntryRequest, PhotoUpload } from '@/types/entry';
import { request, resolveUrl } from './client';

const jsonHeaders = { 'Content-Type': 'application/json' };

function withFullPhotoUrl(entry: DiaryEntry): DiaryEntry {
  return entry.photoUrl ? { ...entry, photoUrl: resolveUrl(entry.photoUrl) } : entry;
}

export async function getEntries() {
  const entries = await request<DiaryEntry[]>('/api/entries');
  return entries.map(withFullPhotoUrl);
}

export async function createEntry(entry: EntryRequest) {
  const created = await request<DiaryEntry>('/api/entries', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
  return withFullPhotoUrl(created);
}

export async function uploadPhoto(id: number, photo: PhotoUpload) {
  const body = new FormData();

  // In the browser FormData needs a real File. On iOS and Android, React
  // Native's FormData reads the file from disk given its uri, name and type.
  if (Platform.OS === 'web' && photo.file) {
    body.append('photo', photo.file);
  } else {
    body.append('photo', { uri: photo.uri, name: photo.name, type: photo.mimeType } as unknown as Blob);
  }

  const updated = await request<DiaryEntry>(`/api/entries/${id}/photo`, {
    method: 'POST',
    body,
  });
  return withFullPhotoUrl(updated);
}
