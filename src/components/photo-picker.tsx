import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PhotoUpload } from '@/types/entry';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// The same file types the API accepts, with the extension it checks for.
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// The API checks the file extension, so the name must end in one it allows.
// iOS can name a photo IMG_0001.HEIC even after it has been converted to JPEG.
function photoName(name: string | null | undefined, extension: string) {
  const base = name?.replace(/\.[^.]*$/, '') || 'photo';
  return `${base}.${extension}`;
}

type PhotoPickerProps = {
  photo: PhotoUpload | null;
  disabled?: boolean;
  onChange: (photo: PhotoUpload | null) => void;
  onError: (message: string) => void;
};

export function PhotoPicker({ photo, disabled, onChange, onError }: PhotoPickerProps) {
  const theme = useTheme();

  async function pickPhoto() {
    let result: ImagePicker.ImagePickerResult;

    // On web the picker throws if the chosen file is not an image, which can
    // happen when "All files" is selected in the browser's file dialog.
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
    } catch {
      onError('Choose a jpg, png, webp or gif image.');
      return;
    }

    if (result.canceled) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? asset.file?.type ?? '';
    const extension = EXTENSIONS[mimeType];
    const size = asset.fileSize ?? asset.file?.size ?? 0;

    if (!extension) {
      onError('Choose a jpg, png, webp or gif image.');
      return;
    }
    if (size > MAX_PHOTO_BYTES) {
      onError('Choose a photo that is at most 5 MB.');
      return;
    }

    onChange({
      uri: asset.uri,
      name: photoName(asset.fileName ?? asset.file?.name, extension),
      mimeType,
      file: asset.file,
    });
  }

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">Photo</ThemedText>

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          accessibilityLabel="Selected photo"
          contentFit="cover"
          style={[styles.preview, { backgroundColor: theme.accentSoft }]}
        />
      )}

      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={pickPhoto}
          style={({ pressed }) => [
            styles.button,
            { borderColor: theme.accent, opacity: pressed ? 0.6 : 1 },
          ]}>
          <ThemedText type="smallBold" themeColor="accent">
            {photo ? 'Choose another photo' : 'Choose photo'}
          </ThemedText>
        </Pressable>
        {photo && (
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => onChange(null)}
            style={({ pressed }) => [
              styles.button,
              { borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
            ]}>
            <ThemedText type="smallBold">Remove</ThemedText>
          </Pressable>
        )}
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        Optional. jpg, png, webp or gif, at most 5 MB.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Radius.md,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  button: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.sm,
  },
});
