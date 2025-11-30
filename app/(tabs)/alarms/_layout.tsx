import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,\
        contentStyle: { backgroundColor: '#000' },
        headerStyle: { backgroundColor: '#000' },
        headerTitleStyle: { color: '#fff' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="new-alarm-config"
        options={{
          title: 'Add New Alarm',
          // presentation handled at root modal route
        }}
      />

      <Stack.Screen
        name="[alarmEditId]"
        options={{
          title: 'Edit Alarm',
          // presentation handled at root modal route
        }}
      />
    </Stack>
  );
}
