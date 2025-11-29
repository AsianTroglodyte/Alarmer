import { Tabs, useSegments } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  // Hide the tab bar when inside nested routes of the `alarms` tab.
  // This covers `alarms/new-alarm-config` and `alarms/[alarmEditId]`.
  console.log(segments);
  const isInsideAlarmSubroute = segments[0] === "(tabs)"
  && segments[1] === 'alarms' 
  && segments.length > 2;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: isInsideAlarmSubroute ? { display: 'none' } : undefined,
      }}>
      <Tabs.Screen
        name="alarms"
        options={{
          title: 'Alarms',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="alarm" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
