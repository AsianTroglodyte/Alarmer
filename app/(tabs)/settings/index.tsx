import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Notifications from 'expo-notifications';

export default function AlarmScreen() {
    const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "undetermined">('undetermined');

    useEffect(() => {
        // Check on mount
        checkPermissions();

        // Listen for app coming back to foreground
        // https://reactnative.dev/docs/appstate
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                console.log('App came to foreground');

                checkPermissions()
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    async function checkPermissions() {
        const { status } = await Notifications.getPermissionsAsync();
        console.log("Notification permission status: ", status);
        setPermissionStatus(status);
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <View>
            <Text style={{
                color: "white",
                padding: 15,
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 20,
            }}>Settings</Text>
        </View>
        <View style={{
            backgroundColor: "#212121",
            marginTop: 20,
            padding: 20,
            borderRadius: 20,
            gap: 20
        }}>
            <View style={{
                gap: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <View style={{ gap: 10 }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                        Notifications
                    </Text>
                    <Text style={{ color: "#808080", fontSize: 14, flexWrap: 'wrap', maxWidth: 200 }}>
                        To enable alarms, please allow notifications for this app in system settings
                    </Text>
                </View>
                <View>
                    <Text style={{ 
                        color: permissionStatus === 'granted' ? '#4CAF50' // Material green-500
                            : permissionStatus === 'denied' ? '#F44336' // Material red-500
                            : '#FFC107', // Material amber-500
                        fontSize: 18,
                        fontWeight: '600',
                        marginVertical: 8,
                        textAlign: 'center',
                        letterSpacing: 0.3,
                    }}> 
                        {permissionStatus === 'granted' ? 'Enabled' 
                        : permissionStatus === 'denied' ? 'Disabled' 
                        : 'Not Determined'}</Text>
                    <Pressable style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "white"                        }}>
                        <Text style={{ color: "white", fontSize: 14 }} onPress={() => Linking.openSettings()}> 
                            {permissionStatus === 'undetermined'? 'Enable Notifications' 
                            : 'Open Settings'}</Text>
                    </Pressable>
                </View>
            </View>

        </View>



    </SafeAreaView>
  );
}


