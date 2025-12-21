import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type MathDifficulty = "very easy" | "easy" | "normal" | "hard" | "very hard" | "super hard" | "hell mode";

interface MathConfigModalProps extends ModalProps {
    setShowMathConfigModal: (visible: boolean) => void;
    onSave: (config: { difficulty: MathDifficulty; times: number }) => void;
    initialConfig?: { difficulty: MathDifficulty; times: number };
}

const difficultyOptions: MathDifficulty[] = [
    "very easy",
    "easy", 
    "normal",
    "hard",
    "very hard",
    "super hard",
    "hell mode"
];

const timesOptions = [1, 2, 3, 5, 10];

export default function MathConfigModal(props: MathConfigModalProps) {
    const { animationType, transparent, visible, setShowMathConfigModal, onSave, initialConfig } = props;

    const [difficulty, setDifficulty] = useState<MathDifficulty>(initialConfig?.difficulty ?? "normal");
    const [times, setTimes] = useState(initialConfig?.times ?? 3);
    const [difficultyExpanded, setDifficultyExpanded] = useState(false);
    const [timesExpanded, setTimesExpanded] = useState(false);

    // Reset state when modal opens with new initial config
    useEffect(() => {
        if (visible) {
            setDifficulty(initialConfig?.difficulty ?? "normal");
            setTimes(initialConfig?.times ?? 3);
            setDifficultyExpanded(false);
            setTimesExpanded(false);
        }
    }, [visible, initialConfig]);

    const handleSave = () => {
        onSave({ difficulty, times });
        setShowMathConfigModal(false);
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
                            onPress={() => setShowMathConfigModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            Math Problem
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 30 }}>
                        Configure your math problem challenge
                    </Text>

                    {/* Difficulty Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Difficulty</Text>
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
                                <RadioButton.Group onValueChange={(value) => setDifficulty(value as MathDifficulty)} value={difficulty}>
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

                    {/* Number of Problems */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Number of Problems</Text>
                        <Pressable 
                            onPress={() => setTimesExpanded(!timesExpanded)}
                            style={styles.selector}
                        >
                            <Text style={styles.selectorText}>{times} problem{times > 1 ? 's' : ''}</Text>
                            <MaterialIcons 
                                name={timesExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                size={24} 
                                color="white" 
                            />
                        </Pressable>

                        {timesExpanded && (
                            <View style={styles.optionsList}>
                                <RadioButton.Group onValueChange={(value) => setTimes(Number(value))} value={times.toString()}>
                                    {timesOptions.map((option) => (
                                        <Pressable 
                                            key={option}
                                            onPress={() => setTimes(option)}
                                            style={styles.radioOption}
                                        >
                                            <RadioButton value={option.toString()} color="mediumturquoise" />
                                            <Text style={styles.radioText}>{option} problem{option > 1 ? 's' : ''}</Text>
                                        </Pressable>
                                    ))}
                                </RadioButton.Group>
                            </View>
                        )}
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
