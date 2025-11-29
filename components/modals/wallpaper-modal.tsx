import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Modal, ModalProps, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WallpaperModalProps extends ModalProps {
    setShowWallpaperModal: (visible: boolean) => void 
}

export default function WallpaperModal(props: WallpaperModalProps) {
    const router = useRouter();

    return (
    <Modal 
        animationType={props.animationType}
        transparent={props.transparent}
        visible={props.visible}>
        <SafeAreaView style={{flex: 1, padding: 20, paddingTop: 70, backgroundColor: "#121212"}}>
            <View style={{
                flexDirection: "row",
                gap: 30,
                alignItems: "center",
                marginBottom: 30,
            }}>
                <Pressable onPress={() => props.setShowWallpaperModal(false)}
                style={{
                    // backgroundColor: "#2f4f4f",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    height: 40,
                    width: 40,
                }}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </Pressable>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold"}}>
                    Wallpaper
                </Text>
            </View>
            <Text style={{color: "white"}}
            >Wallpaper Screen</Text>
        </SafeAreaView>
    </Modal>
    );
}