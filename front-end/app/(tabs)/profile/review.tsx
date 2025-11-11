import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnTapScreen() {
    const reviewLessons = [
        {
            id: '1',
            title: 'Bài 5: Hàm và phương thức trong Java',
            lastReviewed: '09/11/2025',
            progress: '60%',
        },
        {
            id: '2',
            title: 'Bài 8: Kế thừa và đa hình',
            lastReviewed: '07/11/2025',
            progress: '45%',
        },
        {
            id: '3',
            title: 'Bài 10: Xử lý ngoại lệ (Exception Handling)',
            lastReviewed: '05/11/2025',
            progress: '80%',
        },
    ];

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.info}>📅 Lần ôn gần nhất: {item.lastReviewed}</Text>
                <Text style={styles.info}>📖 Tiến độ: {item.progress}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Ôn tập', headerShown: true ,   headerTitleAlign: "center", }} />
            
            {reviewLessons.length === 0 ? (
                <View style={styles.center}>
                    <Text>Bạn chưa có bài học nào để ôn tập.</Text>
                </View>
            ) : (
                <FlatList
                    data={reviewLessons}
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
        marginTop: 4,
    },
    info: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});
