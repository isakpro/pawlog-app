import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

import { NewEntryButton } from '@/components/new-entry-button';
import { Colors } from '@/constants/theme';
import { EntriesProvider } from '@/context/entries';

function navigationTheme(scheme: 'light' | 'dark'): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={navigationTheme(colorScheme === 'dark' ? 'dark' : 'light')}>
      <EntriesProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ title: 'Pawlog', headerRight: () => <NewEntryButton /> }}
          />
          <Stack.Screen name="new-entry" options={{ title: 'New entry', presentation: 'modal' }} />
        </Stack>
      </EntriesProvider>
    </ThemeProvider>
  );
}
