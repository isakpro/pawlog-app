import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function NewEntryButton() {
  const theme = useTheme();

  // The styles sit on an inner View. On web, Link with asChild turned the
  // Pressable into an <a> without its background and padding.
  return (
    <Link href="/new-entry" asChild>
      <Pressable accessibilityLabel="New entry" hitSlop={8}>
        <View style={[styles.button, { backgroundColor: theme.accentSoft }]}>
          <ThemedText type="smallBold" themeColor="accent">
            + New
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
});
