import { getAlarmData } from '@/dummy-data/dummy-data'
import type { AlarmDatum, AlarmsData } from '@/types/types'
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import React, { createContext, useEffect, useRef, useState } from 'react'

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
        await notifee.cancelAllNotifications();
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
      // Cancel all existing alarms/notifications first
      await notifee.cancelAllNotifications();
      console.log('Canceled all Notifee alarms');

      // Save to AsyncStorage
      await AsyncStorage.setItem(ALARMS_LIST_STORAGE_KEY, JSON.stringify(alarmsData));
      console.log('Saved alarms to storage');

      createChannelById('sound', 'Alarms', 'alarm_sound');

      // Schedule a repeating interval alarm
      await scheduleRepeatingAlarm();
    })();

    }, [alarmsData]);



  return (
    <AlarmsDataContext.Provider value={{ alarmsData, setAlarmsData }}>
      {children}
    </AlarmsDataContext.Provider>
  )
}




// async function scheduleIntervalAlarm() {
//   // Single alarm that repeats every 3 seconds using IntervalTrigger
//   const trigger = {
//     type: TriggerType.INTERVAL as const,
//     interval: 3000, // Repeat every 3 seconds  
//     alarmManager: true, // Use AlarmManager for reliable delivery
//   };

//   const alarmId = await notifee.createTriggerNotification(
//     {
//       title: '⏰ ALARM',
//       body: 'Wake up! Tap to dismiss.',
//       android: {
//         channelId: 'sound',
//         importance: AndroidImportance.HIGH,
//         vibrationPattern: [1000, 500], // Strong vibration
//         ongoing: true, // Persistent notification
//         autoCancel: false, // Prevent accidental dismissal
//         tag: 'interval_alarm', // Unique tag
//         pressAction: {
//           id: 'dismiss_alarm',
//           launchActivity: 'default',
//         },
//         actions: [
//           {
//             title: 'DISMISS',
//             pressAction: {
//               id: 'dismiss_alarm',
//             },
//           },
//           {
//             title: 'SNOOZE',
//             pressAction: {
//               id: 'snooze_alarm',
//             },
//           },
//         ],
//         fullScreenAction: {
//           id: 'alarm_fullscreen',
//           launchActivity: 'default',
//         },
//       },
//     },
//     trigger
//   );

//   console.log('Scheduled interval alarm with ID:', alarmId);
//   return alarmId;
// }

async function scheduleRepeatingAlarm() {
  // Schedule multiple alarms to create a single persistent alarm experience
  const baseTime = Date.now() + 2000; // Start in 2 seconds
  const alarmIds = [];
  
  // Schedule 20 notifications, each 3 seconds apart (60 seconds total)
  for (let i = 0; i < 20; i++) {
    const triggerTime = baseTime + (i * 3000); // 3 second intervals
    
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime,
      alarmManager: true, // Use AlarmManager for reliable delivery even when app is closed
    };

    const alarmId = await notifee.createTriggerNotification(
      {
        title: '⏰ ALARM',
        body: 'Wake up! Tap to dismiss.',
        data: { alarmSequence: 'persistent', sequenceNumber: i + 1 },
        android: {
          channelId: 'sound',
          importance: AndroidImportance.HIGH,
          vibrationPattern: [1000, 500], // Consistent strong vibration
          ongoing: true, // Make all persistent
          autoCancel: false,
          tag: 'persistent_alarm', // Same tag replaces previous
          groupId: 'alarm_group', // Group related notifications
          groupSummary: i === 0, // First one is group summary
          pressAction: {
            id: 'dismiss_alarm',
            launchActivity: 'default',
          },
          actions: [
            {
              title: 'DISMISS ALL',
              pressAction: {
                id: 'dismiss_all_alarms',
              },
            },
            {
              title: 'SNOOZE',
              pressAction: {
                id: 'snooze_alarm',
              },
            },
          ],
          fullScreenAction: {
            id: 'alarm_fullscreen',
            launchActivity: 'default',
          },
        },
      },
      trigger
    );
    
    alarmIds.push(alarmId);
  }

  console.log('Scheduled repeating alarm sequence with IDs:', alarmIds);
  return alarmIds;
}


async function createChannelById(id : any, name: any, ringtone: any) {
  notifee.deleteChannel(id).then(async () => {
    notifee
      .createChannel({
        id: id,
        name: name,
        sound: ringtone,
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
        vibrationPattern: [700, 300],
        bypassDnd: true,
      })
      .then(async () => {
        console.log('Channel recreated', await notifee.getChannel(id));
      });
  });
}