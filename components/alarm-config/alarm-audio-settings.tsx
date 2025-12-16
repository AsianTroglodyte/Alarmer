import GentleWakeupModal from "@/components/modals/gentle-wakeup-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import React from 'react';
import { Pressable, Switch, Text, View } from "react-native";

interface AlarmAudioSettingsProps {
    volume: number;
    setVolume: (value: number) => void;
    vibrationsEnabled: boolean;
    vibrationToggleHandler: () => void;
    gentleWakeUp: {
        active: boolean;
        rampDurationSeconds: number;
    };
    setGentleWakeup: React.Dispatch<React.SetStateAction<{ active: boolean; rampDurationSeconds: number }>>;
    showGentleWakeupModal: boolean;
    setShowGentleWakeupModal: (show: boolean) => void;
    extraLoudEnabled: boolean;
    setExtraLoudEnabled: (fn: (prev: boolean) => boolean) => void;
}

export default function AlarmAudioSettings({
    volume,
    setVolume,
    vibrationsEnabled,
    vibrationToggleHandler,
    gentleWakeUp,
    setGentleWakeup,
    showGentleWakeupModal,
    setShowGentleWakeupModal,
    extraLoudEnabled,
    setExtraLoudEnabled
}: AlarmAudioSettingsProps) {
    return (
        <>
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
        </>
    );
}
