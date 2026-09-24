import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

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
};

export function EntryCard({ entry }: EntryCardProps) {
  const { date, title, story, trainingGoal, goalCompleted, photoUrl } = entry;
  const theme = useTheme();

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
              {goalCompleted ? `✓ ${trainingGoal}` : trainingGoal}
            </ThemedText>
          </View>
        ) : null}
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
});
