import GentleWakeupModal from "@/components/modals/gentle-wakeup-modal";
import SnoozeModal from "@/components/modals/snooze-modal";
import WallpaperModal from "@/components/modals/wallpaper-modal";
import { AlarmsDataContext } from '@/context/alarms-data';
import type { Activity } from '@/types/types';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
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
                    {
                // the following method has options. no need for sub-stringing
                    (alarmTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // or false for 24-hour
                    }))}
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
                            day.active ? day.name.charAt(0).toUpperCase() + day.name.slice(1,3) : "").
                            filter((item) => item !== "").join(", ")}
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
                    Create Missions
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
                            // Render based on the discriminated union `Activity.type`
                            const key = `${activity.type}-${idx}`;
                            let iconName: string = 'question-mark';

                            switch (activity.type) {
                                case 'math':
                                    iconName = 'calculate';
                                    break;
                                case 'steps':
                                    iconName = 'directions-walk';
                                    break;
                                case 'qrcode':
                                    iconName = 'qr-code-scanner';
                                    break;
                                case 'photo':
                                    iconName = 'camera-alt';
                                    break;
                                case 'shake':
                                    iconName = 'vibration';
                                    break;
                                case 'squat':
                                    iconName = 'fitness-center';
                                    break;
                                case 'gotolocation':
                                    iconName = 'place';
                                    break;
                                default:
                                    iconName = 'question-mark';
                            }

                            return (
                                <View key={key} style={{
                                    backgroundColor: 'darkslategrey',
                                    padding: 10,
                                    borderRadius: 10,
                                    height: 70,
                                    width: 70,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <MaterialIcons name={iconName as any} size={24} color="mediumturquoise" />
                                </View>
                            );
                        })}
                        <View style={{
                            backgroundColor: '#3b3b3b',
                            padding: 10,
                            borderRadius: 10,
                            height: 70,
                            width: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name={"add"} size={24} color="mediumturquoise" />
                        </View>
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