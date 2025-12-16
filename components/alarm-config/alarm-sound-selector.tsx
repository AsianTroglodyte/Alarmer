import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

export default function AlarmSoundSelector() {
    return (
        <>
            <Text style={{
                color: "white",
                fontSize: 18,   }}>
                    Alarm Sound
            </Text>


            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center",
                    gap: 10
                }}>
                    <View style={{
                        backgroundColor: "darkslategrey",
                        padding: 5,
                        borderRadius: 100,
                    }}>
                        <MaterialIcons name="play-arrow" size={24} color="lightgray" />
                    </View>
                    <Text style={{
                        color: "lightgray",
                        fontSize: 16,
                    }}>
                        Digital Alarm Clock
                    </Text>
                </View>
            </View>
        </>
    );
}
