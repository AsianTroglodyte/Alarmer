import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StepsConfigModalProps extends ModalProps {
    setShowStepsConfigModal: (visible: boolean) => void;
    onSave: (config: { stepsNumber: number }) => void;
    initialConfig?: { stepsNumber: number };
}

const presetSteps = [25, 50, 100, 200, 500];

export default function StepsConfigModal(props: StepsConfigModalProps) {
    const { animationType, transparent, visible, setShowStepsConfigModal, onSave, initialConfig } = props;

    const [stepsNumber, setStepsNumber] = useState(initialConfig?.stepsNumber ?? 50);

    // Reset state when modal opens with new initial config
    useEffect(() => {
        if (visible) {
            setStepsNumber(initialConfig?.stepsNumber ?? 50);
        }
    }, [visible, initialConfig]);

    const handleSave = () => {
        onSave({ stepsNumber });
        setShowStepsConfigModal(false);
    };

    return (
        <Modal 
            animationType={animationType}
            transparent={transparent}
            visible={visible}
        >
            <ScrollView style={{ flex: 1, backgroundColor: "#121212" }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", padding: 20, paddingTop: 70 }}>
                    {/* Header */}
                    <View style={styles.Header}>
                        <Pressable 
                            onPress={() => setShowStepsConfigModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            Steps Challenge
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 30 }}>
                        Set the number of steps required to dismiss the alarm
                    </Text>

                    {/* Steps Input */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Number of Steps</Text>
                        <TextInput
                            style={styles.input}
                            value={stepsNumber.toString()}
                            onChangeText={(text) => {
                                const num = parseInt(text) || 0;
                                setStepsNumber(num);
                            }}
                            keyboardType="number-pad"
                            placeholder="Enter steps"
                            placeholderTextColor="#666"
                        />
                    </View>

                    {/* Preset Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Select</Text>
                        <View style={styles.presetContainer}>
                            {presetSteps.map((preset) => (
                                <Pressable
                                    key={preset}
                                    onPress={() => setStepsNumber(preset)}
                                    style={({ pressed }) => [
                                        styles.presetButton,
                                        stepsNumber === preset && styles.presetButtonActive,
                                        { opacity: pressed ? 0.7 : 1 }
                                    ]}
                                >
                                    <Text style={[
                                        styles.presetText,
                                        stepsNumber === preset && styles.presetTextActive
                                    ]}>
                                        {preset}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Save Button */}
                    <Pressable 
                        onPress={handleSave}
                        style={({ pressed }) => [
                            styles.saveButton,
                            { backgroundColor: pressed ? "#EE4B2B" : "#FF5722" }
                        ]}
                    >
                        <Text style={styles.saveButtonText}>Add Mission</Text>
                    </Pressable>
                </SafeAreaView>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    Header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#212121",
        color: "white",
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        textAlign: "center",
    },
    presetContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    presetButton: {
        backgroundColor: "#212121",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    presetButtonActive: {
        borderColor: "mediumturquoise",
        backgroundColor: "#2a4a4a",
    },
    presetText: {
        color: "#999",
        fontSize: 16,
        fontWeight: "600",
    },
    presetTextActive: {
        color: "mediumturquoise",
    },
    saveButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
