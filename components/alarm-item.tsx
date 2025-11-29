import { Pressable, Switch, Text, View } from "react-native";

import type { AlarmDatum } from "@/types/types";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type DayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

type AlarmItemsProps = {
    key: number, 
    alarmDatum: AlarmDatum,
    activeSwitchHandler: (id: number) => void
}

export default function AlarmItem (props : AlarmItemsProps)  {    
    const {key, alarmDatum, activeSwitchHandler} = props;

    const router = useRouter();


    return(
        <Pressable 
            key = {alarmDatum.id}    
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#212121",
                height: 120,
                borderRadius: 12,
                padding: 15,
            }}
            onPress={() => {
                router.push(`/(tabs)/alarms/${alarmDatum.id}`)}}>
            <View >
                <View style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                    {
                    alarmDatum.daysOfWeek.map((dayOfWeek) => (
                        <Text key={dayOfWeek.name} style={{ color: 
                        dayOfWeek.active ? "white" 
                        : "#606060"}}> 
                            {dayOfWeek.name[0].toUpperCase()}
                        </Text>    
                    ))}
                </View>
                <Text style={{
                        color: "white",
                        fontSize: 32,
                    }}> 
                    {// the following method has options. no need for sub-stringing
                    alarmDatum.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // or false for 24-hour
                    })
                    }
                </Text>
                <Text style={{
                    color: "white",
                    fontSize: 16,
                }}>
                    {alarmDatum.alarmName} 
                </Text>
            </View>
            
            <View style={{
                alignSelf: "stretch",
                flexDirection: "column", 
                justifyContent: "space-between", 
                alignItems: "flex-end", 
                paddingVertical: 5}}>
                <Switch 
                    onValueChange={() => activeSwitchHandler(alarmDatum.id)}
                    value={alarmDatum.active}
                    style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }}
                />
                <MaterialIcons size={24} name="delete" color="white" ></MaterialIcons>
            </View>
        </Pressable>
    )
}
     