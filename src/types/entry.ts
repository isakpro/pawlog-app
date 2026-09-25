export interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  story: string;
  trainingGoal: string;
  goalCompleted: boolean;
  photoUrl: string | null;
}

export type EntryRequest = Omit<DiaryEntry, 'id' | 'photoUrl'>;

// A photo picked with expo-image-picker. On web the picker also gives a File.
export interface PhotoUpload {
  uri: string;
  name: string;
  mimeType: string;
  file?: File;
}
