import { AlarmsDataContext } from '@/context/alarms-data';
import type { AlarmDatum } from "@/types/types";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from "react";
import { Modal, Pressable, Switch, Text, View } from "react-native";
type DayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

type AlarmItemsProps = {
    key: number, 
    alarmDatum: AlarmDatum,
    activeSwitchHandler: (id: number) => void
}

export default function AlarmItem (props : AlarmItemsProps)  {

    const {key, alarmDatum, activeSwitchHandler} = props;

    const router = useRouter();

    const context = useContext(AlarmsDataContext);
    if (!context) {
        throw new Error("AlarmsDataContext is not available");
    }
    const {alarmsData, setAlarmsData} = context;

    // console.log("alarmsData: ", alarmsData);
    // console.log("alarmDatum", alarmDatum);
    // console.log("alarmDatum.time", alarmDatum.time);
    // console.log("alarmDatum.time", typeof alarmDatum.time);


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    function deleteHandler() {
        setAlarmsData((prev : any) => 
            (prev.filter((alarm : any) =>
                    (alarm.id !== alarmDatum.id))))
    }

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
                router.push(`/edit-alarm/${alarmDatum.id}`)}}>
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
                <Pressable style={{padding: 5}} onPress={() => (setDeleteModalVisible(prev => !prev))}>
                    <MaterialIcons size={24} name="delete" color="white" ></MaterialIcons>
                </Pressable>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={deleteModalVisible}>
                    <Pressable style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'rgba(0,0,0,0.5)', // dim background
                    }}
                    onPress={() => setDeleteModalVisible(prev => !prev)}>
                        <Pressable style={{
                            margin: 20,
                            backgroundColor: '#212121',
                            borderRadius: 20,
                            paddingTop: 35,
                            width: 270,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            gap: 10
                        }}>
                            <View style ={{marginBottom: 30}}>
                                <Text style ={{color: "white", fontSize: 18}}>
                                    Delete Alarm?
                                </Text>
                            </View>

                            <View style={{
                                width: "100%",
                                flexDirection: "row", 
                                }}>
                                <Pressable style={({pressed}) => [{flex: 1, 
                                    alignItems: "center", 
                                    paddingVertical: 20, 
                                    borderTopWidth: 0.5,
                                    borderTopColor: "grey",
                                    borderBottomLeftRadius: 20
                                }, 
                                    {backgroundColor: pressed ? "#3b3b3b": "#212121"}]}
                                onPress={() => setDeleteModalVisible(prev => !prev)}>
                                    <Text style={{color: "white"}}>
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable style={({pressed}) => [{flex: 1, 
                                    alignItems: "center", 
                                    paddingVertical: 20, 
                                    borderTopWidth: 0.5,
                                    borderTopColor: "grey",
                                    borderLeftWidth: 0.5,
                                    borderLeftColor: "grey",
                                    borderBottomRightRadius: 20
                                }, 
                                    {backgroundColor: pressed ? "#3b3b3b": "#212121"}]}
                                onPress={() => {
                                    deleteHandler()
                                    setDeleteModalVisible(prev => !prev)}}>
                                    <Text style ={{color: "#EE4B2B"}}>
                                        Delete
                                    </Text>
                                </Pressable>
                            </View>
                        </Pressable>
                        
                    </Pressable>
                </Modal>
            </View>
        </Pressable>
    )
}
     