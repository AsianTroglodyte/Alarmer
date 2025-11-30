import AlarmItem from '@/components/alarm-item';
import { AlarmsDataContext } from '@/context/alarms-data';
import { AlarmDatum } from '@/types/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function AlarmScreen() {
    const router = useRouter();
    
    const context = useContext(AlarmsDataContext);
    if (!context) {
        throw new Error('AlarmsDataContext is not available');
    }
    const { alarmsData, setAlarmsData } = context;
    
    // const alarms = getAlarm();
    
    // const [alarms, setAlarms] = useState<AlarmsData>(alarmsData);

    function activeSwitchHandler (id: number) {
        setAlarmsData(prev =>
            prev.map(alarm =>
            alarm.id === id
                ? { ...alarm, active: !alarm.active }
                : alarm
            )
        );
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
            }}>Ring in 5 hours</Text>
        </View>
        <ScrollView style={{
        }}>
            <View style={{
                gap: 12,
                padding: 12,
                borderRadius: 12,
                justifyContent: "center",
                paddingBottom: 90
            }}>
                {alarmsData.map((alarmDatum: AlarmDatum) => (
                    <AlarmItem key={alarmDatum.id} alarmDatum={alarmDatum} activeSwitchHandler={activeSwitchHandler}></AlarmItem>
                ))}
            </View>

        </ScrollView>

        <Pressable style={({pressed}) => [
            {
                backgroundColor: pressed ? "#EE4B2B" : "#FF5722",
            },
            {
                borderRadius: 100,
                height: 60,
                width: 60,
                position: "absolute",
                bottom: 30,
                right: 30,
                justifyContent: "center",
                alignItems: "center"
            }
        ]}
        onPress={() => {
            router.push('/new-alarm-config');
        }}>
            <MaterialIcons name="add" size={36} color="white" />
        </Pressable>


    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
