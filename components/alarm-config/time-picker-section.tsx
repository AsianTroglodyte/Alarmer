import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Pressable, Text, TextInput, View } from "react-native";

interface TimePickerSectionProps {
    alarmName: string;
    setAlarmName: (name: string) => void;
    alarmTime: Date;
    showTimePicker: boolean;
    setShowTimePicker: (show: boolean) => void;
    timePickerModalHandler: (event: DateTimePickerEvent, date: Date | undefined) => void;
}

export default function TimePickerSection({
    alarmName,
    setAlarmName,
    alarmTime,
    showTimePicker,
    setShowTimePicker,
    timePickerModalHandler
}: TimePickerSectionProps) {
    return (
        <>
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
        </>
    );
}
