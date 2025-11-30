import { getAlarmData } from '@/dummy-data/dummy-data'
import type { AlarmDatum, AlarmsData } from '@/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import React, { createContext, useEffect, useRef, useState } from 'react'
// import {getAlarmData} from "@/dummy-data/dummy-data"

type AlarmsDataContextType = {
  alarmsData: AlarmsData
  setAlarmsData: React.Dispatch<React.SetStateAction<AlarmsData>>
}

export const AlarmsDataContext = createContext<AlarmsDataContextType | null>(null)

const ALARMS_LIST_STORAGE_KEY = '@alarmer/alarms'
const FIRST_LAUNCH_KEY = '@alarmer/firstLaunch'



export default function AlarmsDataProvider({ children }: { children: React.ReactNode }) {
  const [alarmsData, setAlarmsData] = useState<AlarmsData>([])
  const isInitialMount = useRef(true)

  useEffect(() => {


    // Loading Persistent Alarm Data
    let mounted = true
    ;(async () => {
      try {
        // Clear all scheduled notifications on app startup
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Cleared all scheduled notifications on startup');

        // if can't find should return null if data not found;
        const firstLaunchFlag = await AsyncStorage.getItem(FIRST_LAUNCH_KEY)
        const rawData = await AsyncStorage.getItem(ALARMS_LIST_STORAGE_KEY)

        // NOTE: we are setting up a default alarm on first launch 
        // the firstLaunch variable is basically flag we set after the first launch 
        // absence of the flag basically means that we are on the first launch
        if (!firstLaunchFlag) {
        // this means first launch ever
          const initialAlarms = [getAlarmData()[0]]
          await AsyncStorage.setItem(
            ALARMS_LIST_STORAGE_KEY,
            JSON.stringify(initialAlarms )
          )
          await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true')
          if (mounted) {setAlarmsData(initialAlarms)}
        } 
        else if (rawData) {
            // After first launch, only load saved alarms
          const parsed = JSON.parse(rawData)
          const parsedWithDate: AlarmsData = parsed.map((alarm: AlarmDatum) => ({
                ...alarm,
                time: new Date(alarm.time)
            }))
        //   console.log(parsedWithDate);
          if (mounted) {setAlarmsData(parsedWithDate)}
        } 
        else {
            // no Data and not first launch will have to add an empty state later. low prio tho
          if (mounted) {setAlarmsData([])}
        }
      } 
      catch {
        if (mounted) {setAlarmsData([])}
      }
    })();

    // Request Notifications Permission (only if not already determined)
    (async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        if (existingStatus === 'undetermined') {
            // Only request if user hasn't been asked before
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission for notifications not granted.');
            }
        }
    })();

    // cleanup function
    return () => {
        mounted = false
    }
  }, [])


    //   Persisting Alarm Data on Change. Separate lifecycle form first useEffect
    //   having two useEffects is just way more readable than combining the Logic
  useEffect(() => {
    console.log("updated alarmsData");
    // Skip saving on initial mount before load completes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!alarmsData) {return;}

    ;(async () => {
      // Cancel all existing scheduled notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Canceled all scheduled notifications');

      // Save to AsyncStorage
      await AsyncStorage.setItem(ALARMS_LIST_STORAGE_KEY, JSON.stringify(alarmsData));
      console.log('Saved alarms to storage');

      // Set up notification channel for Android with critical importance
      await Notifications.setNotificationChannelAsync('alarms', {
        name: 'Alarms',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
        bypassDnd: true, // Bypass Do Not Disturb
      });

      scheduleAlarm();

      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        console.log('Currently scheduled:', scheduled.length);
      // TODO: Implement proper alarm scheduling logic here
      // For each alarm in alarmsData that is enabled:
      // 1. Calculate next trigger time based on alarm.time and alarm.activeDaysOfWeek
      // 2. Schedule notification with trigger: { date: nextTriggerDate }
    })();

    }, [alarmsData]);



  return (
    <AlarmsDataContext.Provider value={{ alarmsData, setAlarmsData }}>
      {children}
    </AlarmsDataContext.Provider>
  )
}




async function scheduleAlarm() {
  // Schedule a test alarm for 5 seconds from now
  const triggerDate = new Date(Date.now() + 5000);
  
  const result = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Alarm',
      body: 'Time to wake up!',
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
      categoryIdentifier: 'alarm',
    },
    trigger: {
      date: triggerDate,
      channelId: 'alarms',
    },
  });
  console.log('Scheduled alarm notification for:', triggerDate, 'with ID:', result);
}