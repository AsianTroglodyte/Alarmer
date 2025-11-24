import { Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <SafeAreaView style={{
        flex: 1
    }}>
        <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
        }}>
            <Text style={{
                color: "white",
            }}>
                Bruh
            </Text>
        </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });
