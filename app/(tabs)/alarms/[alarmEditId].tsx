import AlarmAudioSettings from "@/components/alarm-config/alarm-audio-settings";
import AlarmSoundSelector from "@/components/alarm-config/alarm-sound-selector";
import DaysOfWeekSelector from "@/components/alarm-config/days-of-week-selector";
import MissionsSection from "@/components/alarm-config/missions-section";
import OtherSettingsSection from "@/components/alarm-config/other-settings-section";
import TimePickerSection from "@/components/alarm-config/time-picker-section";
import { AlarmsDataContext } from '@/context/alarms-data';
import type { Activity } from '@/types/types';
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditAlarmScreen() {
    // context for the canonical data. Updated when confirmed
    const context = useContext(AlarmsDataContext);
    if (!context) {
        throw new Error('AlarmsDataContext is not available');
    }
    const { alarmsData, setAlarmsData } = context;


    // Route's params may either be an array of string or just an array
    // so just do some proper type checking
    const {alarmEditId} = useLocalSearchParams();
    const routeIdString = Array.isArray(alarmEditId) ? alarmEditId[0] : alarmEditId;


    // useState for determining whehter to show modals
    const [showTimePicker, setShowTimePicker] =  useState(false);
    const [showGentleWakeupModal, setShowGentleWakeupModal] = useState(false);
    const [showSnoozeModal, setShowSnoozeModal] = useState(false);
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);


    // useState for the forms
    // consider memoizing the currentAlarmData as it runs on every rerender
    const currentAlarmData = useMemo(
    () => alarmsData.filter((alarmData) => alarmData.id === parseInt(routeIdString))[0],
    [alarmsData, routeIdString]
    );
    // let currentAlarmData = alarmsData.filter((alarmData) => (alarmData.id === parseInt(routeIdString)))[0];

    const [gentleWakeUp, setGentleWakeup] = useState(currentAlarmData.gentleWakeUp);
    const [extraLoudEnabled, setExtraLoudEnabled] = useState(currentAlarmData.extraLoudEnabled);
    const [alarmName, setAlarmName] = useState(currentAlarmData.alarmName);
    const [alarmTime, setAlarmTime] = useState<Date>(currentAlarmData.time);
    const [daily, setDaily] = useState(currentAlarmData.daily);
    const [vibrationsEnabled, setvibrationsEnabled] = useState(currentAlarmData.vibrationsEnabled);
    const [volume, setVolume] = useState(currentAlarmData.volume);
    const [snooze, setSnooze] = useState(currentAlarmData.snooze);
    const [activeDaysOfWeek, setActiveDaysOfWeek] = useState<{ name: string; active: boolean }[]>(currentAlarmData.daysOfWeek);
    const [activities, setActivities] = useState<Activity[]>(
        currentAlarmData?.activities ?? []
    );

    // reference setActivities to avoid unused variable linting
    void setActivities;



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



    function activeDaysOfWeekHandler(key: string) {
        const updatedDaysOfWeek = activeDaysOfWeek.map((dayOfWeek) => 
            dayOfWeek.name === key ? { ...dayOfWeek, active: !dayOfWeek.active } : dayOfWeek);

        setActiveDaysOfWeek(updatedDaysOfWeek);
        
        if (updatedDaysOfWeek.filter((dayOfWeek) => dayOfWeek.active === true).length === 7) {
            setDaily(true);
        }
        else {
            setDaily(false);
        }

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

        setActiveDaysOfWeek(prev => [
            { ...prev[0], active: newDaily },
            { ...prev[1], active: newDaily },
            { ...prev[2], active: newDaily },
            { ...prev[3], active: newDaily },
            { ...prev[4], active: newDaily },
            { ...prev[5], active: newDaily },
            { ...prev[6], active: newDaily },
        ]);
    }

    // Save handler: build updated alarm and write to context, then go back
    const router = useRouter();

    function handleSave() {
        const id = currentAlarmData.id;

        const updatedAlarm = {
            ...currentAlarmData,
            alarmName,
            time: alarmTime,
            daily,
            daysOfWeek: activeDaysOfWeek,
            gentleWakeUp,
            vibrationsEnabled,
            extraLoudEnabled,
            volume,
            snooze,
            activities,
        };

        setAlarmsData((prev) => prev.map((alarm) => (alarm.id === id ? (updatedAlarm as any) : alarm)));
        router.back();
    }



    return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120, // Space for the fixed save button
        }}
      >
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

      {/* Confirmation Button - Fixed at bottom */}
    <Pressable style={({pressed}) => [
        {
          backgroundColor: pressed ? "#EE4B2B" : "#FF5722",
        },
        {
        //   height: ,
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          borderRadius: 10,  
        }
      ]}
                onPress={handleSave}>
        <Text style={{fontWeight: "bold", fontSize: 18, color: "white"}}>
          Save
        </Text>
      </Pressable>
    </View>
    )
}