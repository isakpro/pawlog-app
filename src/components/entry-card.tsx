import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { ErrorMessage } from '@/components/error-message';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DiaryEntry } from '@/types/entry';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

type EntryCardProps = {
  entry: DiaryEntry;
  onToggleGoal: (id: number) => Promise<void>;
};

export function EntryCard({ entry, onToggleGoal }: EntryCardProps) {
  const { id, date, title, story, trainingGoal, goalCompleted, photoUrl } = entry;
  const theme = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  async function handleToggle() {
    setIsSaving(true);
    setToggleError(null);

    try {
      await onToggleGoal(id);
    } catch (error) {
      setToggleError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function toggleLabel() {
    if (isSaving) return 'Saving…';
    return goalCompleted ? '✓ Done' : 'Mark as done';
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          accessibilityLabel={title}
          contentFit="cover"
          transition={200}
          style={styles.photo}
        />
      ) : (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.photo, styles.photoFallback, { backgroundColor: theme.accentSoft }]}>
          <ThemedText style={styles.paw}>🐾</ThemedText>
        </View>
      )}

      <View style={styles.body}>
        <ThemedText type="smallBold" themeColor="accent" style={styles.date}>
          {dateFormat.format(new Date(date))}
        </ThemedText>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {story ? <ThemedText themeColor="textSecondary">{story}</ThemedText> : null}

        {trainingGoal ? (
          <View style={[styles.goal, { backgroundColor: theme.background }]}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.goalLabel}>
              Training goal
            </ThemedText>
            <ThemedText
              themeColor={goalCompleted ? 'success' : 'text'}
              style={goalCompleted && styles.goalDone}>
              {trainingGoal}
            </ThemedText>
            <Pressable
              role="checkbox"
              aria-checked={goalCompleted}
              aria-disabled={isSaving}
              aria-label={`Training goal done: ${trainingGoal}`}
              disabled={isSaving}
              onPress={handleToggle}
              style={({ pressed }) => [
                styles.toggle,
                goalCompleted
                  ? { backgroundColor: theme.success, borderColor: theme.success }
                  : { borderColor: theme.accent },
                { opacity: isSaving ? 0.6 : pressed ? 0.7 : 1 },
              ]}>
              <ThemedText
                type="smallBold"
                themeColor={goalCompleted ? undefined : 'accent'}
                style={goalCompleted && { color: theme.surface }}>
                {toggleLabel()}
              </ThemedText>
            </Pressable>
          </View>
        ) : null}

        {toggleError && (
          <ErrorMessage title="Could not update the training goal" message={toggleError} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  photoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paw: {
    fontSize: 48,
    lineHeight: 56,
  },
  body: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  date: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts?.serif,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 600,
  },
  goal: {
    gap: Spacing.half,
    marginTop: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  goalLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalDone: {
    textDecorationLine: 'line-through',
  },
  toggle: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.sm,
  },
});
