import type { Activity } from "@/types/types";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ModalProps, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MathConfigModal from "./activity-config/math-config-modal";
import PhotoConfigModal from "./activity-config/photo-config-modal";
import QRCodeConfigModal from "./activity-config/qrcode-config-modal";
import ShakeConfigModal from "./activity-config/shake-config-modal";
import SquatConfigModal from "./activity-config/squat-config-modal";
import StepsConfigModal from "./activity-config/steps-config-modal";

interface AddActivityModalProps extends ModalProps {
    setShowAddActivityModal: (visible: boolean) => void;
    onActivityAdd: (activity: Activity) => void;
    editingActivity?: Activity | null;
}

const activityOptions = [
    { type: 'math' as const, icon: 'calculate', label: 'Math Problem', description: 'Solve math problems to dismiss' },
    { type: 'steps' as const, icon: 'directions-walk', label: 'Steps', description: 'Walk a certain number of steps' },
    { type: 'qrcode' as const, icon: 'qr-code-scanner', label: 'QR Code', description: 'Scan a QR code to dismiss' },
    { type: 'photo' as const, icon: 'camera-alt', label: 'Photo', description: 'Take a specific photo' },
    { type: 'shake' as const, icon: 'vibration', label: 'Shake', description: 'Shake your phone vigorously' },
    { type: 'squat' as const, icon: 'fitness-center', label: 'Squat', description: 'Do squats to wake up' },
];

export default function AddActivityModal(props: AddActivityModalProps) {
    const { animationType, transparent, visible, setShowAddActivityModal, onActivityAdd, editingActivity } = props;

    const [showMathConfigModal, setShowMathConfigModal] = useState(false);
    const [showStepsConfigModal, setShowStepsConfigModal] = useState(false);
    const [showSquatConfigModal, setShowSquatConfigModal] = useState(false);
    const [showShakeConfigModal, setShowShakeConfigModal] = useState(false);
    const [showPhotoConfigModal, setShowPhotoConfigModal] = useState(false);
    const [showQRCodeConfigModal, setShowQRCodeConfigModal] = useState(false);

    const handleActivityPress = (activityType: Activity['type']) => {
        // Don't close the parent modal - config modals will overlay it
        switch (activityType) {
            case 'math':
                setShowMathConfigModal(true);
                break;
            case 'steps':
                setShowStepsConfigModal(true);
                break;
            case 'squat':
                setShowSquatConfigModal(true);
                break;
            case 'shake':
                setShowShakeConfigModal(true);
                break;
            case 'photo':
                setShowPhotoConfigModal(true);
                break;
            case 'qrcode':
                setShowQRCodeConfigModal(true);
                break;
        }
    };

    const handleSaveMathActivity = (config: { difficulty: any; times: number }) => {
        const newActivity: Activity = { type: 'math', ...config };
        onActivityAdd(newActivity);
    };

    const handleSaveStepsActivity = (config: { stepsNumber: number }) => {
        const newActivity: Activity = { type: 'steps', ...config };
        onActivityAdd(newActivity);
    };

    const handleSaveSquatActivity = (config: { squatsNumber: number }) => {
        const newActivity: Activity = { type: 'squat', ...config };
        onActivityAdd(newActivity);
    };

    const handleSaveShakeActivity = (config: { difficulty: any; shakeNumber: number }) => {
        const newActivity: Activity = { type: 'shake', ...config };
        onActivityAdd(newActivity);
    };

    const handleSavePhotoActivity = (config: { photos: [] }) => {
        const newActivity: Activity = { type: 'photo', ...config };
        onActivityAdd(newActivity);
    };

    const handleSaveQRCodeActivity = (config: { qrcode: string }) => {
        const newActivity: Activity = { type: 'qrcode', ...config };
        onActivityAdd(newActivity);
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
                            onPress={() => setShowAddActivityModal(false)}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                            Add Mission
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Text style={{ color: "#999", fontSize: 14, marginTop: 10, marginBottom: 20 }}>
                        Select an activity to add to your alarm
                    </Text>

                    {/* Activity Options */}
                    <View style={{ gap: 15 }}>
                        {activityOptions.map((activity) => (
                            <Pressable
                                key={activity.type}
                                onPress={() => handleActivityPress(activity.type)}
                                style={({ pressed }) => [
                                    styles.activityCard,
                                    { backgroundColor: pressed ? "#2a2a2a" : "#212121" }
                                ]}
                            >
                                <View style={styles.activityIconContainer}>
                                    <MaterialIcons 
                                        name={activity.icon as any} 
                                        size={32} 
                                        color="mediumturquoise" 
                                    />
                                </View>
                                <View style={styles.activityTextContainer}>
                                    <Text style={styles.activityLabel}>{activity.label}</Text>
                                    <Text style={styles.activityDescription}>{activity.description}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#666" />
                            </Pressable>
                        ))}
                    </View>
                </SafeAreaView>
            </ScrollView>

            {/* Config Modals */}
            <MathConfigModal
                visible={showMathConfigModal}
                animationType="slide"
                transparent={false}
                setShowMathConfigModal={setShowMathConfigModal}
                onSave={handleSaveMathActivity}
                initialConfig={editingActivity?.type === 'math' ? {
                    difficulty: editingActivity.difficulty,
                    times: editingActivity.times
                } : undefined}
            />

            <StepsConfigModal
                visible={showStepsConfigModal}
                animationType="slide"
                transparent={false}
                setShowStepsConfigModal={setShowStepsConfigModal}
                onSave={handleSaveStepsActivity}
                initialConfig={editingActivity?.type === 'steps' ? {
                    stepsNumber: editingActivity.stepsNumber
                } : undefined}
            />

            <SquatConfigModal
                visible={showSquatConfigModal}
                animationType="slide"
                transparent={false}
                setShowSquatConfigModal={setShowSquatConfigModal}
                onSave={handleSaveSquatActivity}
                initialConfig={editingActivity?.type === 'squat' ? {
                    squatsNumber: editingActivity.squatsNumber
                } : undefined}
            />

            <ShakeConfigModal
                visible={showShakeConfigModal}
                animationType="slide"
                transparent={false}
                setShowShakeConfigModal={setShowShakeConfigModal}
                onSave={handleSaveShakeActivity}
                initialConfig={editingActivity?.type === 'shake' ? {
                    difficulty: editingActivity.difficulty,
                    shakeNumber: editingActivity.shakeNumber
                } : undefined}
            />

            <PhotoConfigModal
                visible={showPhotoConfigModal}
                animationType="slide"
                transparent={false}
                setShowPhotoConfigModal={setShowPhotoConfigModal}
                onSave={handleSavePhotoActivity}
            />

            <QRCodeConfigModal
                visible={showQRCodeConfigModal}
                animationType="slide"
                transparent={false}
                setShowQRCodeConfigModal={setShowQRCodeConfigModal}
                onSave={handleSaveQRCodeActivity}
            />
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
    activityCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 15,
        gap: 15,
    },
    activityIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: "darkslategrey",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    activityTextContainer: {
        flex: 1,
        gap: 4,
    },
    activityLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    activityDescription: {
        color: "#999",
        fontSize: 13,
    },
});
