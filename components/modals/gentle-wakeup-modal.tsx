import type { GentleWakeUpSettings } from '@/types/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, ModalProps, Pressable, Text, View } from "react-native";
import { RadioButton } from 'react-native-paper';

interface GentleWakeupProps extends ModalProps {
    setShowGentleWakeupModal: (visible: boolean) => void,
    gentleWakeUp: {active: boolean, rampDurationSeconds: number},
    setGentleWakeup: React.Dispatch<React.SetStateAction<GentleWakeUpSettings>>,
    
    // onRequestClose: (visible: boolean) => void;
    // Define any additional props if needed
}

export default function GentleWakeupModal(props: GentleWakeupProps)  {
    const {setShowGentleWakeupModal, gentleWakeUp, setGentleWakeup} = props;

    function gentleWakeupRadioHandler (value: string) {
        // NOTE: parseInt stops until it reaches a non-Int number
        let newGentlWakeupRampDuration = 0
        
        const number = parseInt(value);

        if (value === "Off") {
            newGentlWakeupRampDuration = 0;
            setGentleWakeup((prev) => ({...prev, active: false}));
        }
        else if (value.includes("seconds")) {
            newGentlWakeupRampDuration = number;
            setGentleWakeup((prev) => ({...prev, active: true}));
        }
        else if (value.includes("min")) {
            newGentlWakeupRampDuration = 60 * number;
            setGentleWakeup((prev) => ({...prev, active: true}));
        }
        else if (!isNaN(number)){
            throw new Error("gentleWakeupRadioHandler not getting an integer or 'Off' data. Fix it pronto");
        }
        
        setGentleWakeup((prev) => ({...prev, rampDurationSeconds: newGentlWakeupRampDuration}));
    }

    return (
    <Modal style={{backgroundColor: "#212121"}}
    animationType={props.animationType}
    transparent={props.transparent}
    visible={props.visible}>
        {/* This pressable acts as the dimmed background it closes modal on touch. 
        inner pressable prevents this behavior form bubbling up into it's inner components*/}
        <Pressable 
        onPress={() => setShowGentleWakeupModal(false)}
        style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.5)', // dim background
        }}>
            {/*inner pressable prevents parent pressable behavior 
            (close modal when "pressing outside of it") up into this inner component*/}
            <Pressable style={{
                padding: 10,
                backgroundColor: "#212121",
                borderRadius: 12,
                width: "100%",
                }}>
                
                <View style={{
                    flexDirection: "row",
                    gap: 30,
                    alignItems: "center",}}>
                    <Pressable onPress={() => setShowGentleWakeupModal(false)}
                    style={{
                        // backgroundColor: "#2f4f4f",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        height: 40,
                        width: 40,
                        paddingLeft: 10,
                    }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                    </Pressable>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold"}}>
                        Gentle Wake-Up
                    </Text>
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
                    <Text style={{fontSize: 14, color: "lightgrey", marginBottom: 20}}>
                        Volume gradually increases during the set time 
                    </Text>

                    <RadioButton.Group onValueChange={value => gentleWakeupRadioHandler(value)} 
                    value={gentleWakeUp.rampDurationSeconds === 0 ? "Off":
                        gentleWakeUp.rampDurationSeconds <= 60 ? gentleWakeUp.rampDurationSeconds + " seconds" 
                        : (gentleWakeUp.rampDurationSeconds / 60) + " min"}>
                        {/* deliberately hardcoded; used list with map earlier and didn't like it */}
                        <RadioButton.Item label="Off" value="Off" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="15 seconds" value="15 seconds" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="30 seconds" value="30 seconds" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="60 seconds" value="60 seconds" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="5 min" value="5 min" labelStyle={{ color: "white" }} />
                        <RadioButton.Item label="10 min" value="10 min" labelStyle={{ color: "white" }} />
                    </RadioButton.Group>

                </View>
            </Pressable>
        </Pressable>
    </Modal>
    );
}