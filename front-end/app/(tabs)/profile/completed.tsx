import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function XemLaiScreen() {
    const completedExercises = [
        {
            id: '1',
            title: 'Bài tập 1: Tính tổng mảng số nguyên',
            dateCompleted: '09/11/2025',
            score: '100%',
        },
        {
            id: '2',
            title: 'Bài tập 2: Kiểm tra số nguyên tố',
            dateCompleted: '08/11/2025',
            score: '95%',
        },
        {
            id: '3',
            title: 'Bài tập 3: Xử lý chuỗi ký tự',
            dateCompleted: '06/11/2025',
            score: '85%',
        },
    ];

    const renderItem = ({ item } : any) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.score}>{item.score}</Text>
            </View>
            <Text style={styles.info}>📅 Ngày hoàn thành: {item.dateCompleted}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Bài tập đã hoàn thành', headerShown: true,   headerTitleAlign: "center",  }} />

            {completedExercises.length === 0 ? (
                <View style={styles.center}>
                    <Text>Bạn chưa hoàn thành bài tập nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={completedExercises}
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    score: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4CAF50',
    },
    info: {
        fontSize: 14,
        color: '#666',
    },
});
