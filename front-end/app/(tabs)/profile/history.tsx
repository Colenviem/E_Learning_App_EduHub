import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function LichSuScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Lịch sử thực hành', headerShown: true }} />
            <View style={styles.center}>
                <Text>Bạn chưa thực hành bài học nào.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
