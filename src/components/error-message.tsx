import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ErrorMessageProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: theme.dangerSoft, borderColor: theme.danger }]}>
      <View style={styles.text}>
        <ThemedText type="smallBold" themeColor="danger">
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="danger">
          {message}
        </ThemedText>
      </View>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retry,
            { borderColor: theme.danger, opacity: pressed ? 0.6 : 1 },
          ]}>
          <ThemedText type="smallBold" themeColor="danger">
            Try again
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  text: {
    gap: Spacing.one,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.sm,
  },
});
