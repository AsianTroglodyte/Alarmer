import SnoozeModal from "@/components/modals/snooze-modal";
import WallpaperModal from "@/components/modals/wallpaper-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from 'react';
import { Pressable, Text, View } from "react-native";

interface OtherSettingsSectionProps {
    snooze: {
        active: boolean;
        intervalMinutes: number;
        maxSnores: number;
    };
    setSnooze: React.Dispatch<React.SetStateAction<{ active: boolean; intervalMinutes: number; maxSnores: number }>>;
    showSnoozeModal: boolean;
    setShowSnoozeModal: (show: boolean) => void;
    showWallpaperModal: boolean;
    setShowWallpaperModal: (show: boolean) => void;
}

export default function OtherSettingsSection({
    snooze,
    setSnooze,
    showSnoozeModal,
    setShowSnoozeModal,
    showWallpaperModal,
    setShowWallpaperModal
}: OtherSettingsSectionProps) {
    return (
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
    );
}
