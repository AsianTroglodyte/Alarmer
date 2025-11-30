import GentleWakeupModal from "@/components/modals/gentle-wakeup-modal";
import SnoozeModal from "@/components/modals/snooze-modal";
import WallpaperModal from "@/components/modals/wallpaper-modal";
import { AlarmsDataContext } from '@/context/alarms-data';
import type { Activity, AlarmDatum, AlarmsData } from '@/types/types';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
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
            
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                // backgroundColor: "blue",
                height: 70
            }}>
                <TextInput style={{
                    color: "white",
                    fontSize: 18,
                }}
                placeholder="Enter Alarm Name Here!"
                placeholderTextColor={'grey'}
                value={alarmName}
                onChangeText={(newString) => {setAlarmName(newString)}}>
                </TextInput>
                <View style={{
                    marginLeft: 10,}}>
                    <MaterialIcons name="edit" size={25} color="gray" />
                </View>
            </View>
            
            <Pressable 
                onPress={() => (setShowTimePicker(true))}
                style= {{
                    marginTop: 20,
                    marginBottom: 20,
                    padding: 10,
                    backgroundColor: "#212121",
                    borderRadius: 20,
                }} 
                >
                <Text style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 64,
                    // fontWeight: "bold",
                }}>
                    {// the following method has options. no need for sub-stringing
                    alarmTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // or false for 24-hour
                    })}
                </Text>
            </Pressable>

            {showTimePicker && 
            <DateTimePicker 
                value={alarmTime} 
                mode="time" 
                display="default"
                onChange={timePickerModalHandler}>
            </DateTimePicker>}

            {/* https://github.com/react-native-datetimepicker/datetimepicker/blob/master/docs/android-styling.md
                we need to go to the app.json, configure, then run "yarn expo prebuild -p android --clean"
                We are stuck with this design for Android. Too bad*/}

            {/* Day Selection */}
            <View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}>
                    <Text style={{
                        color: "white",
                        fontSize: 14}}>
                        {
                        activeDaysOfWeek.filter((day) => day.active).length === 7 ? "Daily" : 
                        activeDaysOfWeek.filter((day) => day.active).length === 0 ? "One-Time": 
                        activeDaysOfWeek.map((day) => 
                            day.active 
                            ? day.name.charAt(0).toUpperCase() + day.name.slice(1,3)  
                            : "").filter((item) => item !== "").join(", ")}
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}>
                        <Checkbox style={{
                            borderColor: "gray",
                            borderWidth: 2,
                        }}
                        value={daily}
                        onValueChange={dailyToggleHandler}/>
                        <Text style={{
                            color: "gray",
                            fontSize: 14}} >
                            Daily
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                }}>
                    {activeDaysOfWeek.map((dayOfWeek) => {
                        return <Pressable key={dayOfWeek.name} style={{
                            height: 42,
                            width: 43,
                            backgroundColor: dayOfWeek.active ? "#2f4f4f" : "#212121",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                        }}
                        onPress={() => activeDaysOfWeekHandler(dayOfWeek.name)}>
                            <Text style={{
                                color: dayOfWeek.active ? "white" : "gray",
                            }}>
                                {dayOfWeek.name[0].toUpperCase()}
                            </Text>
                        </Pressable>
                    })}
                </View>
            </View>


            {/* MISSION SECTION */}
            <View style={{
                backgroundColor: "#212121",
                marginTop: 20,
                padding: 20,
                borderRadius: 20,
                gap: 20
            }}>

                <Text style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                }}>
                    Select
                    Missions
                </Text>
                <ScrollView horizontal={true} style={{
                    marginTop: 10,
                }}
                >   
                {/* FOR MORE ON COLOR: https://reactnative.dev/docs/colors */}
                    <View style={{
                        flexDirection: "row",
                        gap: 10,
                        marginBottom: 10, // so that scroll bar doesn't overlap with items
                    }}>
                        {activities.map((activity, idx) => {
                            const key = `${activity.type}-${idx}`;
                            return (
                                <View key={key} style={{
                                    backgroundColor: "darkslategrey",
                                    padding: 10,
                                    borderRadius: 10,
                                    height: 70,
                                    width: 70,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    {activity.type === 'math' ? (<MaterialIcons name="calculate" size={24} color="mediumturquoise" />) : 
                                    activity.type === 'steps' ? (<MaterialIcons name="directions-walk" size={24} color="mediumturquoise" />) : 
                                    activity.type === 'qrcode' ? (<MaterialIcons name="qr-code-scanner" size={24} color="mediumturquoise" />) : 
                                    activity.type === 'photo' ? (<MaterialIcons name="camera-alt" size={24} color="mediumturquoise" />) : 
                                    activity.type === 'shake' ? (<MaterialIcons name="vibration" size={24} color="mediumturquoise" />) : 
                                    activity.type === 'squat' ? (<MaterialIcons name="fitness-center" size={24} color="mediumturquoise" />) : 
                                    (<MaterialIcons name="question-mark" size={24} color="mediumturquoise" />
                                    )}
                                </View>
                            );
                        })}
        
                    </View>
                </ScrollView>
            </View>


            {/* SOUND SECTION */}
            <View style={{
                backgroundColor: "#212121",
                marginTop: 20,
                padding: 20,
                borderRadius: 20,
                gap: 20
            }}>
                <Text style={{
                    color: "white",
                    fontSize: 18,   }}>
                        Alarm Sound
                </Text>


                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center",
                        gap: 10
                    }}>
                        <View style={{
                            backgroundColor: "darkslategrey",
                            padding: 5,
                            borderRadius: 100,
                        }}>
                            <MaterialIcons name="play-arrow" size={24} color="lightgray" />
                        </View>
                        <Text style={{
                            color: "lightgray",
                            fontSize: 16,
                        }}>
                            Digital Alarm Clock
                        </Text>
                    </View>
                </View>


                {/* Volume Slider */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center",
                    }}>
                        <MaterialIcons name="volume-up" size={24} color="lightgray" />
                        <Slider 
                            style={{width: 230, height: 40, }}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            value={volume}
                            onValueChange={(value) => {setVolume(value)}}/>
                    </View>
                    <Pressable onPress={vibrationToggleHandler}
                    style={{gap: 10, flexDirection: "row", alignItems: "center"}}>
                        <MaterialIcons name="vibration" size={24} color="lightgray" />
                        <Checkbox style={{
                            borderColor: "gray",
                            borderWidth: 2,
                        }} 
                            value={vibrationsEnabled}
                            onValueChange={vibrationToggleHandler}>

                        </Checkbox>
                    </Pressable>
                </View>


                {/*Gentle Wakeup  */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Text style={{
                        color: "lightgray",
                        fontSize: 16,
                    }}>
                        Gentle Wake-Up
                    </Text>
                    <Pressable style={{flexDirection: "row", alignItems: "center", gap: 10}}
                        onPress={() => {setShowGentleWakeupModal(true)}}>
                        <Text style={{color: gentleWakeUp.active ? "white" : "grey"}}>
                            {gentleWakeUp.active ? 
                            (
                                gentleWakeUp.rampDurationSeconds <= 60 
                                ? `${gentleWakeUp.rampDurationSeconds} seconds` 
                                : `${gentleWakeUp.rampDurationSeconds / 60} min`
                            )
                            : 
                            "Off"}
                        </Text>
                        <MaterialIcons name="arrow-forward" size={24} color="gray" />
                    </Pressable>
                        <GentleWakeupModal
                            animationType='fade'
                            transparent={true}
                            visible={showGentleWakeupModal}
                            setShowGentleWakeupModal={setShowGentleWakeupModal}
                            onRequestClose={() => {
                                setShowGentleWakeupModal(false);
                            }}
                            gentleWakeUp={gentleWakeUp}
                            setGentleWakeup={setGentleWakeup}
                        />
                    {/* } */}
                </View>

                {/*Extra Loud */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Text style={{
                        color: "lightgray",
                        fontSize: 16,
                    }}>
                        Exra Loud Effect
                    </Text>
                    <Switch
                        value={extraLoudEnabled}
                        onValueChange={() => setExtraLoudEnabled((prev) => !prev)} 
                    ></Switch>
                </View>
            </View>

            <View style={{
                backgroundColor: "#212121",
                marginTop: 20,
                padding: 20,
                borderRadius: 20,
                gap: 20
            }}>
                <Text style={{
                    color: "white",
                    fontSize: 18,   
                }}>
                    Other Settings
                </Text>

                {/* Snooze */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between" }}>
                    <Text style={{
                        color: "lightgray",
                        fontSize: 16,
                    }}>
                        Snooze
                    </Text>
                    <Pressable style={{flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 10}}
                        onPress={() => (setShowSnoozeModal(true))}>
                        <Text style={{ color: snooze.active ? "white" : "gray"}}>
                            {snooze.active ? `${snooze.intervalMinutes} min, ` +
                            `${snooze.maxSnores === -1 ? "Unlimited" : snooze.maxSnores} times`: "Off"}
                        </Text>
                        <MaterialIcons name="arrow-forward" size={24} color="gray" />
                    </Pressable>
                    <SnoozeModal 
                        animationType="fade"
                        transparent={false}
                        visible={showSnoozeModal}
                        setShowSnoozeModal={setShowSnoozeModal}
                        active={snooze.active}
                        intervalMinutes={snooze.intervalMinutes}
                        maxSnores={snooze.maxSnores}
                        snooze={snooze}
                        setSnooze={setSnooze}
                    />
                        
                </View>

                {/* Alarm Wallpaper */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between" }}>
                    <Text style={{
                        color: "lightgray",
                        fontSize: 16,
                    }}>
                        Alarm Wallpaper
                    </Text>
                    <Pressable style={{flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 10}}
                        onPress={() => setShowWallpaperModal(true)}>
                        <Text style={{color: "white"}}></Text>
                        <MaterialIcons name="arrow-forward" size={24} color="gray" />
                    </Pressable>
                    <WallpaperModal
                        animationType="fade"
                        transparent={false}
                        visible={showWallpaperModal}
                        setShowWallpaperModal={setShowWallpaperModal}/>
                </View>
            </View>
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