import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_BASE_URL = 'http://192.168.0.102:5000';

type Achievement = {
    id: string;
    title: string;
    status: 'achieved' | 'pending';
    icon: string;
};

type User = {
    _id: string;
    name: string;
    avatarUrl: string;
    backgroundColor: string;
    coursesInProgress: { courseId: string; image: string; progress: number }[];
    streak: number;
    totalActiveMinutes: number;
};

const AchievementCard = ({ title, status, icon }: Achievement) => (
    <View style={styles.card}>
        <View style={styles.iconContainer}>
            <FontAwesome5
                name={icon}
                size={26}
                color={status === 'achieved' ? '#FFD700' : '#A0A0A0'}
            />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.statusText, { color: status === 'achieved' ? '#4CAF50' : '#666' }]}>
                {status === 'achieved' ? '🎉 Đã đạt được' : '⏳ Tiếp tục cố gắng!'}
            </Text>
        </View>
    </View>
);

const AchievementsScreen = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [filter, setFilter] = useState<'all' | 'achieved' | 'pending'>('all');
    const [loading, setLoading] = useState(true);
    const userId = 'USER001';
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/users/${userId}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error('Lỗi tải user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const achievements: Achievement[] = user
        ? [
            {
                id: '1',
                title: 'Hoàn thành bài học đầu tiên',
                status: user.coursesInProgress.some(c => c.progress > 0)
                    ? 'achieved'
                    : 'pending',
                icon: 'star',
            },
            {
                id: '2',
                title: `Duy trì streak ${user.streak} ngày liên tiếp`,
                status: user.streak >= 3 ? 'achieved' : 'pending',
                icon: 'fire',
            },
            {
                id: '3',
                title: `Học hơn ${user.totalActiveMinutes} phút`,
                status: user.totalActiveMinutes >= 120 ? 'achieved' : 'pending',
                icon: 'clock',
            },
            {
                id: '4',
                title: `Hoàn thành 1 khóa học`,
                status: user.coursesInProgress.some(c => c.progress === 1)
                    ? 'achieved'
                    : 'pending',
                icon: 'award',
            },
        ]
        : [];

    const filteredAchievements = achievements.filter(a =>
        filter === 'all' ? true : a.status === filter
    );

    if (loading)
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A4AFF" />
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thành tựu</Text>
                <View style={{ width: 24 }} />
            </View>
            {user && (
                <View style={[styles.userCard, { backgroundColor: user.backgroundColor }]}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                    <View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userSubtitle}>
                            🔥 {user.streak} ngày liên tiếp | ⏱ {user.totalActiveMinutes} phút
                        </Text>
                    </View>
                </View>
            )}

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.filterBar}>
                    {[
                        { label: 'Tất cả', value: 'all' },
                        { label: 'Đã đạt', value: 'achieved' },
                        { label: 'Chưa đạt', value: 'pending' },
                    ].map(({ label, value }) => (
                        <TouchableOpacity
                            key={value}
                            style={[styles.filterButton, filter === value && styles.activeFilter]}
                            onPress={() => setFilter(value as any)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    filter === value && { color: '#4A4AFF', fontWeight: '700' },
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.listContainer}>
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map(a => (
                            <AchievementCard key={a.id} {...a} />
                        ))
                    ) : (
                        <Text style={styles.noResultText}>Không có thành tựu nào.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    header: {
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContainer: { flex: 1 },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    activeFilter: { backgroundColor: '#E0E0FF' },
    filterText: { color: '#666', fontWeight: '600' },
    listContainer: { paddingHorizontal: 20, marginTop: 10 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: { marginRight: 15 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: '#333' },
    statusText: { fontSize: 13, marginTop: 2 },
    noResultText: { textAlign: 'center', color: '#999', fontSize: 14, marginTop: 20 },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        margin: 15,
        borderRadius: 15,
    },
    avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    userSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
});

export default AchievementsScreen;
