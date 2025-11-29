import { getAlarmData } from '@/dummy-data/dummy-data';
import type { AlarmsData } from '@/types/types';
import { Stack } from 'expo-router';
import React, { createContext, useState } from 'react';
import 'react-native-reanimated';

type AlarmsDataContextType = {
  alarmsData: AlarmsData;
  setAlarmsData: React.Dispatch<React.SetStateAction<AlarmsData>>;
};

export const AlarmsDataContext = createContext<AlarmsDataContextType | null>(null);

export default function RootLayout() {

    const [alarmsData, setAlarmsData] = useState<AlarmsData>(getAlarmData());

  return (
    <AlarmsDataContext.Provider value={{ alarmsData, setAlarmsData }}>
      <Stack
        screenOptions={{
          // headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="new-alarm-config"
          options={{
            title: "Add New Alarm",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="[alarmEditId]"
          options={{
            title: "Edit Alarm",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </AlarmsDataContext.Provider>
  );
}
