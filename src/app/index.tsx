import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { EntryCard } from '@/components/entry-card';
import { ErrorMessage } from '@/components/error-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useEntries } from '@/hooks/use-entries';
import { useTheme } from '@/hooks/use-theme';

export default function EntriesScreen() {
  const { entries, isLoading, loadError, reload } = useEntries();
  const theme = useTheme();
  const hasEntries = entries.length > 0;

  if (isLoading && !hasEntries) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
        <ThemedText themeColor="textSecondary">Loading entries…</ThemedText>
      </ThemedView>
    );
  }

  if (loadError && !hasEntries) {
    return (
      <ThemedView style={styles.centered}>
        <View style={styles.content}>
          <ErrorMessage title="Could not load entries" message={loadError} onRetry={reload} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={entries}
        keyExtractor={(entry) => String(entry.id)}
        renderItem={({ item }) => <EntryCard entry={item} />}
        refreshing={isLoading}
        onRefresh={reload}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, styles.list]}
        ListHeaderComponent={
          loadError ? (
            <ErrorMessage title="Could not refresh entries" message={loadError} onRetry={reload} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText type="smallBold">No entries yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Entries you add will show up here.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  list: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.six,
  },
});
