import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItemScreen() {
    return (
        <SafeAreaView style={{
            flex: 1,
            // justifyContent: "center",
            alignItems: "center"
        }}>
            <View>

            </View>
            
            <Text style={{
                color: "white",
                fontSize: 20
            }}>
                Alarm Configuration
            </Text>
            
            <Text>
                You can name you alarm here
            </Text>

            <DateTimePicker value={new Date()} mode="time" display="default" ></DateTimePicker>

        </SafeAreaView>
    )
}