import { Checkbox } from 'expo-checkbox';
import { Pressable, Text, View } from "react-native";

interface DayOfWeek {
    name: string;
    active: boolean;
}

interface DaysOfWeekSelectorProps {
    activeDaysOfWeek: DayOfWeek[];
    daily: boolean;
    activeDaysOfWeekHandler: (name: string) => void;
    dailyToggleHandler: () => void;
}

export default function DaysOfWeekSelector({
    activeDaysOfWeek,
    daily,
    activeDaysOfWeekHandler,
    dailyToggleHandler
}: DaysOfWeekSelectorProps) {
    return (
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
    );
}
