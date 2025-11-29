import type { SnoozeSettings } from "@/types/types";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface SnoozeModalProps extends ModalProps {
    active: boolean,
    intervalMinutes: number, 
    maxSnores: number,
    setShowSnoozeModal: (visible: boolean) => void,
    setSnooze: React.Dispatch<React.SetStateAction<SnoozeSettings>>,
    snooze: {
        active: boolean,
        intervalMinutes: number,
        maxSnores: number 
    }
}


export default function SnoozeModal(props: SnoozeModalProps) {
    const {snooze, setSnooze, animationType, 
        transparent, visible, setShowSnoozeModal} = props;

    const [intervalListExpanded, setIntervalListExpanded] = useState(false);

    const [maxSnoreListExpanded, setMaxSnoreListExpanded] = useState(false);


    function snoozeIntervalHandler(value: string) {
        let newIntervalsMinutes = -1;

        // NOTE: parseInt stops until it reaches a non-Int number
        const minutes = parseInt(value);
        if (!isNaN(minutes)) {
            newIntervalsMinutes = minutes;
        }
        else {
            throw new Error("snoozeIntervalhandler not getting an integer. Fix it pronto");
        }

        setSnooze({...snooze, intervalMinutes: newIntervalsMinutes});
    }

    function maxSnoozeHandler(value: string) {
        let newMaxSnores = -1;

        // NOTE: parseInt stops until it reaches a non-Int number
        const minutes = parseInt(value);
        if (!isNaN(minutes)) {
            newMaxSnores = minutes;
        }
        else {
            throw new Error("snoozeIntervalhandler not getting an integer. Fix it pronto");
        }

        setSnooze({...snooze, maxSnores: newMaxSnores});
    }


    return (
    <Modal 
    animationType={animationType}
    transparent={transparent}
    visible={visible}>
        <ScrollView style={{flex: 1, padding: 20, paddingTop: 70,backgroundColor: "#121212"}}>
            <SafeAreaView style={{flex: 1, backgroundColor: "#121212"}}>
                {/* Switch */}
                <View style={styles.Header}>
                    <Pressable onPress={() => setShowSnoozeModal(false)}
                    style={styles.backButton}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                    </Pressable>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold"}}>
                        Snooze
                    </Text>
                </View>

                {/* Snooze Button */}
                <View style={{
                    flexDirection: "row", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: 15,
                    backgroundColor: "#212121",
                    borderRadius: 20,
                    marginBottom: 20
                }}>
                    <Text style={{color: "white", fontSize: 20}}>Snooze</Text>
                    <Switch 
                        value ={snooze.active}
                        onChange={() => setSnooze((prev : SnoozeSettings) => ({...prev, active: !prev.active}))}
                        // value
                    />
                </View>

                {/* Interval */}
                <View style={{
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    padding: 20,
                    backgroundColor: "#212121",
                    borderRadius: 20,
                    marginBottom: 20,
                }}>
                    <Text style={{fontSize: 18, color: "white", marginBottom: 20}}>
                        Interval
                    </Text>

                    <RadioButton.Group onValueChange={value => snoozeIntervalHandler(value)} 
                    value={snooze.intervalMinutes + " min"}>
                        {/* deliberately hardcoded; used list with map earlier and didn't like it */}
                        <RadioButton.Item label="1 min" value="1 min" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="3 min" value="3 min" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="5 min" value="5 min" labelStyle={{ color: "white" }} />

                        {intervalListExpanded && (
                            <>
                            <RadioButton.Item label="10 min" value="10 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="15 min" value="15 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="20 min" value="20 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="25 min" value="25 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="30 min" value="30 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="45 min" value="45 min" labelStyle={{ color: "white" }} />
                            <RadioButton.Item label="60 min" value="60 min" labelStyle={{ color: "white" }} />
                            </>
                        )}
                    </RadioButton.Group>

                    <Pressable onPress={() => setIntervalListExpanded(prev => !prev)}>
                        <Text style={{fontSize: 16, color: "grey", paddingLeft: 15}}>
                            {intervalListExpanded ? 'Show less' : 'Show more'}
                        </Text>
                    </Pressable>
                </View>


                {/* Max Snoozes */}
                <View style={{
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    padding: 15,
                    backgroundColor: "#212121",
                    borderRadius: 20,
                    marginBottom: 100
                }}>
                    <Text style={{fontSize: 18, color: "white", marginBottom: 20}}>
                        Max Snoozes
                    </Text>
                    <RadioButton.Group onValueChange={value => {maxSnoozeHandler(value)}} 
                    value={snooze.maxSnores === -1 ? "Unlimited" : snooze.maxSnores + " times"}>
                        {/* deliberately hardcoded; used list with map earlier and didn't like it */}
                        <RadioButton.Item label="Unlimited" value="Unlimited" labelStyle={{color: "white"}} />
                        <RadioButton.Item label="1 times" value="1 times" labelStyle={{color: "white"}} />
                        <RadioButton.Item label="2 times" value="2 times" labelStyle={{color: "white"}}/>
                        <RadioButton.Item label="3 times" value="3 times" labelStyle={{color: "white"}}/>
                        
                        {maxSnoreListExpanded && (
                            <>
                            <RadioButton.Item label="5 times" value="5 times" labelStyle={{color: "white"}}/>
                            <RadioButton.Item label="10 times" value="10 times" labelStyle={{color: "white"}}/>
                            </>
                        )}
                    </RadioButton.Group>

                    <Pressable onPress={() => setMaxSnoreListExpanded(prev => !prev)}>
                        <Text style={{fontSize: 16, color: "grey", paddingLeft: 15}}>
                            {maxSnoreListExpanded ? 'Show less' : 'Show more'}
                        </Text>
                    </Pressable>
                </View>

            </SafeAreaView>
        </ScrollView>
    </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: 15,
        backgroundColor: "#212121",
        borderRadius: 20,
        color: "white"
    },
    Header: {
        flexDirection: "row",
        gap: 30,
        alignItems: "center",
        marginBottom: 30
    },
    backButton: {
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        width: 40,
    }
})