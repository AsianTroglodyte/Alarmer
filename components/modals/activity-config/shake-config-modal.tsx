import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ShakeDifficulty = "very easy" | "easy" | "normal" | "hard" | "very hard";

interface ShakeConfigModalProps extends ModalProps {
    setShowShakeConfigModal: (visible: boolean) => void;
    onSave: (config: { difficulty: ShakeDifficulty; shakeNumber: number }) => void;
    initialConfig?: { difficulty: ShakeDifficulty; shakeNumber: number };
}

const difficultyOptions: ShakeDifficulty[] = [
    "very easy",
    "easy", 
    "normal",
    "hard",
    "very hard"
];

export default function ShakeConfigModal(props: ShakeConfigModalProps) {
    const { animationType, transparent, visible, setShowShakeConfigModal, onSave, initialConfig } = props;

    const [difficulty, setDifficulty] = useState<ShakeDifficulty>(initialConfig?.difficulty ?? "normal");
    const [shakeNumber, setShakeNumber] = useState(initialConfig?.shakeNumber ?? 20);
    const [difficultyExpanded, setDifficultyExpanded] = useState(false);

    // Reset state when modal opens with new initial config
    useEffect(() => {
        if (visible) {
            setDifficulty(initialConfig?.difficulty ?? "normal");
            setShakeNumber(initialConfig?.shakeNumber ?? 20);
            setDifficultyExpanded(false);
        }
    }, [visible, initialConfig]);

    const handleSave = () => {
        onSave({ difficulty, shakeNumber });
        setShowShakeConfigModal(false);
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
                            onPress={() => setShowShakeConfigModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            Shake Challenge
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 30 }}>
                        Configure shake intensity and count
                    </Text>

                    {/* Difficulty Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shake Intensity</Text>
                        <Pressable 
                            onPress={() => setDifficultyExpanded(!difficultyExpanded)}
                            style={styles.selector}
                        >
                            <Text style={styles.selectorText}>{difficulty}</Text>
                            <MaterialIcons 
                                name={difficultyExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                size={24} 
                                color="white" 
                            />
                        </Pressable>

                        {difficultyExpanded && (
                            <View style={styles.optionsList}>
                                <RadioButton.Group onValueChange={(value) => setDifficulty(value as ShakeDifficulty)} value={difficulty}>
                                    {difficultyOptions.map((option) => (
                                        <Pressable 
                                            key={option}
                                            onPress={() => setDifficulty(option)}
                                            style={styles.radioOption}
                                        >
                                            <RadioButton value={option} color="mediumturquoise" />
                                            <Text style={styles.radioText}>{option}</Text>
                                        </Pressable>
                                    ))}
                                </RadioButton.Group>
                            </View>
                        )}
                    </View>

                    {/* Shake Count */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Number of Shakes</Text>
                        <TextInput
                            style={styles.input}
                            value={shakeNumber.toString()}
                            onChangeText={(text) => {
                                const num = parseInt(text) || 0;
                                setShakeNumber(num);
                            }}
                            keyboardType="number-pad"
                            placeholder="Enter shake count"
                            placeholderTextColor="#666"
                        />
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
    selector: {
        backgroundColor: "#212121",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    selectorText: {
        color: "white",
        fontSize: 16,
        textTransform: "capitalize",
    },
    optionsList: {
        backgroundColor: "#212121",
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    radioText: {
        color: "white",
        fontSize: 16,
        marginLeft: 10,
        textTransform: "capitalize",
    },
    input: {
        backgroundColor: "#212121",
        color: "white",
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        textAlign: "center",
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
