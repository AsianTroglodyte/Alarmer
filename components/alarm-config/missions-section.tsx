import type { Activity } from '@/types/types';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, Text, View } from "react-native";

interface MissionsSectionProps {
    activities: Activity[];
}

export default function MissionsSection({ activities }: MissionsSectionProps) {
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
    );
}
