import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../_layout';

const API_BASE_URL = 'http://192.168.0.102:5000';

export default function DanhGiaScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();

    const colors = {
        background: isDarkMode ? '#121212' : '#F7F7F7',
        card: isDarkMode ? '#1E1E1E' : '#fff',
        text: isDarkMode ? '#fff' : '#333',
        subText: isDarkMode ? '#AAA' : '#666',
        headerBorder: isDarkMode ? '#333' : '#f0f0f0',
    };

    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');

                const [userRes, coursesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`),
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
                    date: c.lastAccessed?.split('T')[0] || '-',
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
                return { color: colors.subText };
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <View style={styles.infoRow}>
                <Text style={[styles.info, { color: colors.subText }]}>📅 Ngày đánh giá: {item.date}</Text>
                <Text style={[styles.info, { color: colors.subText }]}>📊 Điểm: {item.score}</Text>
            </View>
            <Text style={[styles.level, getLevelStyle(item.level)]}>🧠 Cấp độ: {item.level}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#5E72E4" />
                <Text style={{ marginTop: 12, color: colors.subText }}>Đang tải đánh giá...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.header, { borderBottomColor: colors.headerBorder }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Đánh giá kỹ năng</Text>
                <View style={{ width: 24 }} />
            </View>

            {assessments.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ color: colors.subText }}>Bạn chưa thực hiện bài đánh giá nào.</Text>
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
    container: { flex: 1 },
    header: {
        paddingTop: 30,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    info: { fontSize: 14 },
    level: { fontSize: 14, marginTop: 4 },
});
