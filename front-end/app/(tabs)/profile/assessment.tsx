import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';

export default function DanhGiaScreen() {
    const assessments = [
        {
            id: '1',
            title: 'Đánh giá Java cơ bản',
            level: 'Trung bình',
            score: '75%',
            date: '09/11/2025',
        },
        {
            id: '2',
            title: 'Đánh giá OOP nâng cao',
            level: 'Khá',
            score: '88%',
            date: '07/11/2025',
        },
        {
            id: '3',
            title: 'Đánh giá cấu trúc dữ liệu & giải thuật',
            level: 'Giỏi',
            score: '92%',
            date: '05/11/2025',
        },
    ];

    const getLevelStyle = (level: string): TextStyle => {
        switch (level) {
            case 'Giỏi':
                return { color: '#4CAF50', fontWeight: 'bold' };
            case 'Khá':
                return { color: '#2196F3', fontWeight: 'bold' };
            case 'Trung bình':
                return { color: '#FF9800', fontWeight: 'bold' };
            default:
                return { color: '#666' };
        }
    };

    const renderItem = ({ item } : any) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.info}>📅 Ngày đánh giá: {item.date}</Text>
                <Text style={styles.info}>📊 Điểm: {item.score}</Text>
            </View>
            <Text style={[styles.level, getLevelStyle(item.level)]}>
                🧠 Cấp độ: {item.level}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Đánh giá kỹ năng lập trình', headerShown: true,   headerTitleAlign: "center",  }} />

            {assessments.length === 0 ? (
                <View style={styles.center}>
                    <Text>Bạn chưa thực hiện bài đánh giá nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={assessments}
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
        color: '#333',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    info: {
        fontSize: 14,
        color: '#666',
    },
    level: {
        fontSize: 14,
        marginTop: 4,
    },
});
