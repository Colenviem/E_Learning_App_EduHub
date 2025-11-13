import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextStyle, View } from 'react-native';

const API_BASE_URL = 'http://192.168.0.102:5000';
const USER_ID = 'USER010';

export default function DanhGiaScreen() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const [userRes, coursesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/${USER_ID}`),
                    fetch(`${API_BASE_URL}/courses`)
                ]);

                const userData = await userRes.json();
                const coursesData = await coursesRes.json();

                const courseMap = Object.fromEntries(
                    coursesData.map((c: any) => [c._id, c.title])
                );

                const mapped = userData.coursesInProgress.map((c: any) => ({
                    id: c.courseId,
                    title: `Đánh giá ${courseMap[c.courseId] || c.courseId}`,
                    level: c.progress >= 0.8 ? 'Giỏi' : c.progress >= 0.5 ? 'Khá' : 'Trung bình',
                    score: `${Math.round(c.progress * 100)}%`,
                    date: c.lastAccessed.split('T')[0],
                }));

                setAssessments(mapped);
            } catch (err) {
                console.error('Lỗi fetch dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

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

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.info}>📅 Ngày đánh giá: {item.date}</Text>
                <Text style={styles.info}>📊 Điểm: {item.score}</Text>
            </View>
            <Text style={[styles.level, getLevelStyle(item.level)]}>🧠 Cấp độ: {item.level}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#5E72E4" />
                <Text style={{ marginTop: 12, color: '#666' }}>Đang tải đánh giá...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Đánh giá kỹ năng', headerShown: true, headerTitleAlign: 'center' }} />

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
    title: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    info: { fontSize: 14, color: '#666' },
    level: { fontSize: 14, marginTop: 4 },
});
