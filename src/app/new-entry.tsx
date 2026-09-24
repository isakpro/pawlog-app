import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { ErrorMessage } from '@/components/error-message';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useEntries } from '@/context/entries';
import { useTheme } from '@/hooks/use-theme';

type FormError = {
  title: string;
  message: string;
};

// Today's date in local time. toISOString() would give the UTC date, which is
// yesterday in Sweden between midnight and 01:00 or 02:00.
function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validate(date: string, title: string): FormError | null {
  if (!isValidDate(date)) {
    return { title: 'Check the date', message: 'Write the date as YYYY-MM-DD, for example 2026-09-24.' };
  }
  if (!title.trim()) {
    return { title: 'The entry needs a title', message: 'Write a short title for the day.' };
  }
  return null;
}

export default function NewEntryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addEntry } = useEntries();

  const [date, setDate] = useState(today);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [trainingGoal, setTrainingGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);

  function close() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  async function handleSave() {
    const validationError = validate(date, title);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await addEntry({
        date,
        title: title.trim(),
        story: story.trim(),
        trainingGoal: trainingGoal.trim(),
        goalCompleted: false,
      });
      close();
    } catch (error) {
      setFormError({ title: 'Could not save the entry', message: getErrorMessage(error) });
      setIsSaving(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.form}>
        <FormField
          label="Date"
          value={date}
          onChangeText={setDate}
          hint="YYYY-MM-DD"
          placeholder="2026-09-24"
          autoCorrect={false}
          maxLength={10}
        />
        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="First swim of the autumn"
          maxLength={80}
        />
        <FormField
          label="What happened today?"
          value={story}
          onChangeText={setStory}
          placeholder="Stood in the shallows for ten minutes before deciding the water was fine."
          maxLength={1000}
          multiline
        />
        <FormField
          label="Training goal"
          value={trainingGoal}
          onChangeText={setTrainingGoal}
          placeholder="Come back on recall near water"
          maxLength={120}
        />

        {formError && <ErrorMessage title={formError.title} message={formError.message} />}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving }}
            disabled={isSaving}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accent, opacity: isSaving ? 0.6 : pressed ? 0.8 : 1 },
            ]}>
            <ThemedText type="smallBold" style={styles.saveLabel}>
              {isSaving ? 'Saving…' : 'Save entry'}
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={close}
            style={({ pressed }) => [
              styles.button,
              { borderColor: theme.border, borderWidth: 1, opacity: pressed ? 0.6 : 1 },
            ]}>
            <ThemedText type="smallBold">Cancel</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  saveLabel: {
    color: '#ffffff',
  },
});
