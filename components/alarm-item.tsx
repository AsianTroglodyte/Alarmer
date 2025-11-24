import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from "react";
import { Switch, Text, View } from "react-native";

import type { AlarmDatum } from "@/types/types";

type DayOfWeekInitial = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export default function AlarmItem (props : {key: number, alarmDatum: AlarmDatum})  {
    const colorScheme = useColorScheme();
    
    const {key, alarmDatum} = props;

    const [isEnabled, setIsEnabled] = useState<boolean>(false);

    const allDaysOfWeekInitials: DayOfWeekInitial[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const activeDaysOfWeekInitials = alarmDatum.daysOfWeek.map((dayOfWeek) => {
        switch (dayOfWeek) {
            case "sunday":
              return "Sun";
            case "monday":
                return "Mon";
            case "tuesday":
                return "Tue";
            case "wednesday":
                return "Wed";
            case "thursday":
                return "Thu";
            case "friday":
                return "Fri";
            case "saturday":
                return "Sat";
            }
    })

    return(
        <View 
            key = {alarmDatum.id}    
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#212121",
                height: 120,
                // width: "100%",
                borderRadius: 12,
                padding: 15,
        }}>
            <View>
                <View style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                    {allDaysOfWeekInitials.map((dayOfWeekInitial : DayOfWeekInitial) => (
                        <Text key={dayOfWeekInitial} 
                        style={{
                            color: activeDaysOfWeekInitials.includes(dayOfWeekInitial) 
                            ? "white" 
                            : "#606060",
                        }}> 
                            {dayOfWeekInitial[0]}
                        </Text>
                        ))}
                </View>
                <Text
                    style={{
                        color: "white",
                        fontSize: 32,
                    }}> 
                    {alarmDatum.time}
                </Text>
            </View>
            
            <View>
                <Switch 
                    onValueChange={() => setIsEnabled(prevState => !prevState)}
                    value={isEnabled}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                />
            </View>
        </View>
    )
}
     