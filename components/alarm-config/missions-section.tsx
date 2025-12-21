import type { Activity } from '@/types/types';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface MissionsSectionProps {
    activities: Activity[];
    setShowAddActivityModal: () => void;
    onEditActivity: (activity: Activity, index: number) => void;
}

export default function MissionsSection({ activities, setShowAddActivityModal, onEditActivity }: MissionsSectionProps) {
    const handleAddActivity = () => {
        setShowAddActivityModal();
    };

    const getActivityDetails = (activity: Activity): string => {
        switch (activity.type) {
            case 'math':
                return `${activity.times}x ${activity.difficulty}`;
            case 'steps':
                return `${activity.stepsNumber} steps`;
            case 'squat':
                return `${activity.squatsNumber} squats`;
            case 'shake':
                return `${activity.shakeNumber}x ${activity.difficulty}`;
            case 'photo':
                return 'Photo';
            case 'qrcode':
                return 'QR Code';
            default:
                return '';
        }
    };

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
                        const details = getActivityDetails(activity);
                        return (
                            <Pressable 
                                key={key} 
                                onPress={() => onEditActivity(activity, idx)}
                                style={({ pressed }) => ({
                                    backgroundColor: pressed ? "#2f4f4f" : "darkslategrey",
                                    padding: 10,
                                    borderRadius: 10,
                                    minWidth: 100,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5,
                                })}
                            >
                                {activity.type === 'math' ? (<MaterialIcons name="calculate" size={24} color="mediumturquoise" />) : 
                                activity.type === 'steps' ? (<MaterialIcons name="directions-walk" size={24} color="mediumturquoise" />) : 
                                activity.type === 'qrcode' ? (<MaterialIcons name="qr-code-scanner" size={24} color="mediumturquoise" />) : 
                                activity.type === 'photo' ? (<MaterialIcons name="camera-alt" size={24} color="mediumturquoise" />) : 
                                activity.type === 'shake' ? (<MaterialIcons name="vibration" size={24} color="mediumturquoise" />) : 
                                activity.type === 'squat' ? (<MaterialIcons name="fitness-center" size={24} color="mediumturquoise" />) : 
                                (<MaterialIcons name="question-mark" size={24} color="mediumturquoise" />
                                )}
                                <Text style={{
                                    color: "mediumturquoise",
                                    fontSize: 11,
                                    textAlign: "center",
                                    fontWeight: "600",
                                }} numberOfLines={2}>
                                    {details}
                                </Text>
                            </Pressable>
                        );
                    })}
                    
                    {/* Add New Activity Button */}
                    <Pressable 
                        onPress={handleAddActivity}
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? "#2f4f4f" : "darkslategrey",
                            padding: 10,
                            borderRadius: 10,
                            height: 70,
                            width: 70,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 2,
                            borderColor: "mediumturquoise",
                            borderStyle: "dashed",
                        })}
                    >
                        <MaterialIcons name="add" size={32} color="mediumturquoise" />
                    </Pressable>
    
                </View>
            </ScrollView>
        </View>
    );
}
