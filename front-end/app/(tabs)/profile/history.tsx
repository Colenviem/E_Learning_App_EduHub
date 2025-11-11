import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LichSuScreen() {
    const practiceHistory = [
        {
            id: '1',
            title: 'Bài 1: Cấu trúc điều kiện trong Java',
            date: '09/11/2025',
            duration: '15 phút',
            score: '90%',
        },
        {
            id: '2',
            title: 'Bài 2: Vòng lặp for nâng cao',
            date: '08/11/2025',
            duration: '12 phút',
            score: '80%',
        },
        {
            id: '3',
            title: 'Bài 3: Lập trình hướng đối tượng cơ bản',
            date: '06/11/2025',
            duration: '20 phút',
            score: '95%',
        },
    ];

    const renderItem = ({ item } : any) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.info}>📅 {item.date}</Text>
                <Text style={styles.info}>⏱ {item.duration}</Text>
                <Text style={styles.info}>🏆 {item.score}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Lịch sử thực hành', headerShown: true ,   headerTitleAlign: "center", }} />
            
            {practiceHistory.length === 0 ? (
                <View style={styles.center}>
                    <Text>Bạn chưa thực hành bài học nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={practiceHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    info: {
        fontSize: 14,
        color: '#666',
    },
});
