import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AlarmsDataProvider from '@/context/alarms-data';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AlarmsDataProvider>
        <Stack screenOptions={{
            contentStyle: { backgroundColor: '#000' },
            headerStyle: { backgroundColor: '#000' },
            headerTitleStyle: { color: '#fff' },
        }}>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              animation: 'none',
            }} 
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

          <Stack.Screen
            name="(modals)/new-alarm-config"
            options={{
              presentation: 'modal',
            //   animation: 'slide_from_bottom',
              title: 'Add New Alarm',
            }}
          />
          <Stack.Screen
            name="(modals)/edit-alarm/[alarmEditId]"
            options={{
              presentation: 'modal',
            //   animation: 'slide_from_bottom',
              title: 'Edit Alarm',
            }}
          />
        </Stack>
      </AlarmsDataProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
