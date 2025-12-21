import { MaterialIcons } from '@expo/vector-icons';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface QRCodeConfigModalProps extends ModalProps {
    setShowQRCodeConfigModal: (visible: boolean) => void;
    onSave: (config: { qrcode: string }) => void;
}

export default function QRCodeConfigModal(props: QRCodeConfigModalProps) {
    const { animationType, transparent, visible, setShowQRCodeConfigModal, onSave } = props;

    const handleSave = () => {
        // For now, saving with empty QR code string
        // User will scan/set the actual QR code later
        onSave({ qrcode: '' });
        setShowQRCodeConfigModal(false);
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
                            onPress={() => setShowQRCodeConfigModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            QR Code Challenge
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 30 }}>
                        Scan a specific QR code to dismiss your alarm
                    </Text>

                    {/* Placeholder Content */}
                    <View style={styles.placeholderContainer}>
                        <MaterialIcons name="qr-code-scanner" size={80} color="#666" />
                        <Text style={styles.placeholderTitle}>QR Code Configuration</Text>
                        <Text style={styles.placeholderText}>
                            QR code scanning configuration will be added here.
                            that must be scanned when the alarm goes off.
                        </Text>
                        <View style={styles.tipBox}>
                            <MaterialIcons name="lightbulb-outline" size={24} color="mediumturquoise" />
                            <Text style={styles.tipText}>
                                Tip: Place the QR code somewhere you need to walk to, ensuring you get out of bed!
                            </Text>
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
    tipBox: {
        backgroundColor: "#212121",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
        marginTop: 10,
    },
    tipText: {
        flex: 1,
        color: "#999",
        fontSize: 13,
        lineHeight: 20,
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
