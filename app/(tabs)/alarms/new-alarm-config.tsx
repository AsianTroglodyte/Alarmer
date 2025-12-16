import AlarmAudioSettings from "@/components/alarm-config/alarm-audio-settings";
import AlarmSoundSelector from "@/components/alarm-config/alarm-sound-selector";
import DaysOfWeekSelector from "@/components/alarm-config/days-of-week-selector";
import MissionsSection from "@/components/alarm-config/missions-section";
import OtherSettingsSection from "@/components/alarm-config/other-settings-section";
import TimePickerSection from "@/components/alarm-config/time-picker-section";
import { AlarmsDataContext } from '@/context/alarms-data';
import type { Activity, AlarmDatum, AlarmsData } from '@/types/types';
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AddAlarnScreen() {
    // useState for determinign whehter to show modals
    const [showTimePicker, setShowTimePicker] =  useState(false);
    const [showGentleWakeupModal, setShowGentleWakeupModal] = useState(false);
    const [showSnoozeModal, setShowSnoozeModal] = useState(false);
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);



    // useState for the alarm config
    const [gentleWakeUp, setGentleWakeup] = useState({
        active: true,
        rampDurationSeconds: 60
    });
    const [extraLoudEnabled, setExtraLoudEnabled] = useState(false);
    const [alarmName, setAlarmName] = useState("");
    const [alarmTime, setAlarmTime] = useState<Date>(new Date(2024, 2, 8, 0));
    const [daily, setDaily] = useState(false);
    const [vibrationsEnabled, setvibrationsEnabled] = useState(true);
    const [volume, setVolume] = useState(1);
    const [snooze, setSnooze] = useState({
        active: true,
        intervalMinutes: 5,
        maxSnores: 3
    },);
    const [activeDaysOfWeek, setActiveDaysOfWeek] = useState([
      { name: "sunday", active: true },
      { name: "monday", active: false },
      { name: "tuesday", active: false },
      { name: "wednesday", active: false },
      { name: "thursday", active: false },
      { name: "friday", active: false },
      { name: "saturday", active: true },
    ]);
    // initialize activities from canonical alarm data (dummy data via context) when available
    const context = useContext(AlarmsDataContext);
    const setAlarmsData = context?.setAlarmsData;
    const defaultAlarm = useMemo(() => (context?.alarmsData ?? [])[0], [context?.alarmsData]);

    const [activities, setActivities] = useState<Activity[]>(defaultAlarm?.activities ?? []);


    // Handler for forms
    function timePickerModalHandler (event: DateTimePickerEvent, date: Date | undefined) {
        if (event.type === "dismissed" || event.type === "set") {
            setShowTimePicker(false);
        }

        if (date !== undefined) {
            setAlarmTime(date);
        }
 
    }
    
    function vibrationToggleHandler() {
        setvibrationsEnabled((prev) => !prev);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }


    function activeDaysOfWeekHandler(name: string) {
        const updatedDaysOfWeek = [...activeDaysOfWeek];
        const targetDayOfWeekIndex = activeDaysOfWeek.findIndex((day) => day.name === name);

        updatedDaysOfWeek[targetDayOfWeekIndex].active = !updatedDaysOfWeek[targetDayOfWeekIndex].active;
        
        if (updatedDaysOfWeek.filter((day) => day.active).length === 7) {
            setDaily(true);
        }
        else {
            setDaily(false);
        }

        setActiveDaysOfWeek(updatedDaysOfWeek);
    }

    function dailyToggleHandler() {
        // the reason we define the new values first then pass it to the set functions
        // is because the two sets are updated asynchronously that means that we have 
        // negate the previous daily boolean both in setDaily and in setActiveDaysOfWeek
        // this may be kind of unreadable because we are seem to be setting daily to a new
        // value earlier but still negate it when we pass it to the next set function.
        // Alternatively, we can use a useEffect to declare the dependency and properly order
        // and queue this sort of dependency no matter where Daily is changed, 
        // but useEffect has all sorts of baggage and it slighly breaks how people might expect
        // setStates to work. we only have the dependency here
        const newDaily = !daily;

        setDaily(newDaily);

        setActiveDaysOfWeek((prev => prev.map(day => ({
            ...day,
            active: newDaily
        }))));
    }


    useEffect(() => {
        // reference setActivities to avoid unused variable linting
        void setActivities;

        return () => {

        }
    }, [])


    const router = useRouter();

    function handleSave() {
        setAlarmsData?.((prev: AlarmsData | undefined) => {
            const nextId = prev && prev.length ? Math.max(...prev.map((a: AlarmDatum) => a.id)) + 1 : 0;
            const newAlarm: AlarmDatum = {
                id: nextId,
                alarmName,
                daily,
                // @ts-ignore loose shape from activeDaysOfWeek
                daysOfWeek: activeDaysOfWeek as any,
                time: alarmTime,
                active: true,
                activities,
                snooze,
                gentleWakeUp,
                vibrationsEnabled: vibrationsEnabled,
                extraLoudEnabled: extraLoudEnabled,
                volume,
            };
            return prev ? [...prev, newAlarm] : [newAlarm];
        });
        router.back();
    }

    return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <SafeAreaView style={{
            padding: 20,
            // layout header has too much space between the header and the body
            paddingTop: -50,
            }}>
            
            <TimePickerSection
                alarmName={alarmName}
                setAlarmName={setAlarmName}
                alarmTime={alarmTime}
                showTimePicker={showTimePicker}
                setShowTimePicker={setShowTimePicker}
                timePickerModalHandler={timePickerModalHandler}
            />

            {/* Day Selection */}
            <DaysOfWeekSelector
                activeDaysOfWeek={activeDaysOfWeek}
                daily={daily}
                activeDaysOfWeekHandler={activeDaysOfWeekHandler}
                dailyToggleHandler={dailyToggleHandler}
            />


            {/* MISSION SECTION */}
            <MissionsSection activities={activities} />


            {/* SOUND SECTION */}
            <View style={{
                backgroundColor: "#212121",
                marginTop: 20,
                padding: 20,
                borderRadius: 20,
                gap: 20
            }}>
                <AlarmSoundSelector />
                <AlarmAudioSettings
                    volume={volume}
                    setVolume={setVolume}
                    vibrationsEnabled={vibrationsEnabled}
                    vibrationToggleHandler={vibrationToggleHandler}
                    gentleWakeUp={gentleWakeUp}
                    setGentleWakeup={setGentleWakeup}
                    showGentleWakeupModal={showGentleWakeupModal}
                    setShowGentleWakeupModal={setShowGentleWakeupModal}
                    extraLoudEnabled={extraLoudEnabled}
                    setExtraLoudEnabled={setExtraLoudEnabled}
                />
            </View>

            <OtherSettingsSection
                snooze={snooze}
                setSnooze={setSnooze}
                showSnoozeModal={showSnoozeModal}
                setShowSnoozeModal={setShowSnoozeModal}
                showWallpaperModal={showWallpaperModal}
                setShowWallpaperModal={setShowWallpaperModal}
            />
                </SafeAreaView>
            </ScrollView>

            <Pressable style={({pressed}) => [
                { backgroundColor: pressed ? "#EE4B2B" : "#FF5722" },
                {
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    right: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    borderRadius: 10,
                }
            ]}
                onPress={handleSave}>
                <Text style={{fontWeight: "bold", fontSize: 18, color: "white"}}>Save</Text>
            </Pressable>

        </View>
        )
}