import { MaterialIcons } from '@expo/vector-icons';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PhotoConfigModalProps extends ModalProps {
    setShowPhotoConfigModal: (visible: boolean) => void;
    onSave: (config: { photos: [] }) => void;
}

export default function PhotoConfigModal(props: PhotoConfigModalProps) {
    const { animationType, transparent, visible, setShowPhotoConfigModal, onSave } = props;

    const handleSave = () => {
        // For now, saving with empty photos array
        // User will configure the actual photo later
        onSave({ photos: [] });
        setShowPhotoConfigModal(false);
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
                            onPress={() => setShowPhotoConfigModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            Photo Challenge
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 30 }}>
                        Take a photo to dismiss your alarm
                    </Text>

                    {/* Placeholder Content */}
                    <View style={styles.placeholderContainer}>
                        <MaterialIcons name="camera-alt" size={80} color="#666" />
                        <Text style={styles.placeholderTitle}>Photo Configuration</Text>
                        <Text style={styles.placeholderText}>
                            Photo matching configuration will be added here. 
                            You'll be able to set a reference photo that must be matched when the alarm goes off.
                        </Text>
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
    placeholderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 20,
    },
    placeholderTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    placeholderText: {
        color: "#999",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
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
