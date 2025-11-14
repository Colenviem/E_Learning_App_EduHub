import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../_layout';

const API_BASE_URL = 'http://192.168.0.102:5000';

export default function LichSuScreen() {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

    const colors = {
        background: isDarkMode ? '#121212' : '#F5F7FF',
        cardBg: isDarkMode ? '#1E1E1E' : '#fff',
        cardGradientStart: isDarkMode ? '#2A2A2A' : '#FFFFFF',
        cardGradientEnd: isDarkMode ? '#1A1A1A' : '#F8F9FF',
        text: isDarkMode ? '#FFF' : '#1F2937',
        subText: isDarkMode ? '#AAA' : '#6B7280',
        accent: '#5E72E4',
        border: isDarkMode ? '#333' : '#E5E7EB',
        completedBadge: '#10B981',
        expandIcon: '#5E72E4',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (!storedUserId) return;

                const [userRes, coursesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`),
                    fetch(`${API_BASE_URL}/courses`),
                ]);

                const userData = await userRes.json();
                const coursesData = await coursesRes.json();

                const courseMap = Object.fromEntries(
                    coursesData.map((c: any) => [c._id, c.title.replace(/^Learn\s+/i, '')])
                );

                const groupedCourses = (userData.coursesInProgress || []).map((c: any) => {
                    const completed = c.completedLessons || 0;
                    const total = c.totalLessons || 1;
                    const progress = Math.round((completed / total) * 100);

                    const lessons = Array.from({ length: completed }, (_, i) => {
                        const lessonNum = completed - i;
                        return {
                            id: `${c.courseId}-${lessonNum}`,
                            title: `Bài ${lessonNum}`,
                            date: c.lastAccessed
                                ? format(new Date(c.lastAccessed), 'dd/MM/yyyy')
                                : '-',
                            duration: `${Math.floor(Math.random() * 15 + 10)} phút`,
                            score: `${Math.min(100, Math.round((lessonNum / total) * 100))}%`,
                        };
                    });

                    return {
                        courseId: c.courseId,
                        title: courseMap[c.courseId] || c.courseId,
                        progress,
                        totalLessons: total,
                        completedLessons: completed,
                        lastAccessed: c.lastAccessed,
                        lessons,
                        isCompleted: progress === 100,
                    };
                });

                const sorted = groupedCourses.sort((a: any, b: any) => {
                    if (a.isCompleted && !b.isCompleted) return 1;
                    if (!a.isCompleted && b.isCompleted) return -1;
                    return 0;
                });

                setUser(userData);
                setCourses(sorted);
            } catch (err) {
                console.error('Lỗi fetch dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleExpand = (courseId: string) => {
        setExpandedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={[styles.loadingText, { color: colors.subText }]}>Đang tải lịch sử...</Text>
            </View>
        );
    }

    if (!user || courses.length === 0) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={[styles.emptyText, { color: colors.subText }]}>Bạn chưa thực hành bài học nào.</Text>
            </View>
        );
    }

    const totalCompletedLessons = courses.reduce(
        (sum, c) => sum + c.completedLessons,
        0
    );

    const renderCourse = ({ item }: { item: any }) => {
        const isExpanded = expandedCourses.includes(item.courseId);

        return (
            <View style={[styles.courseCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggleExpand(item.courseId)} activeOpacity={0.8}>
                    <LinearGradient
                        colors={item.isCompleted
                            ? [colors.cardGradientStart, colors.cardGradientEnd]
                            : [colors.cardGradientStart, colors.cardGradientEnd]}
                        style={styles.courseHeaderGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.courseHeader}>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.courseTitle, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.progressText, { color: colors.subText }]}>
                                    {item.completedLessons}/{item.totalLessons} bài
                                </Text>
                            </View>
                            <View style={styles.rightSection}>
                                {item.isCompleted && (
                                    <View style={[styles.completedBadge, { backgroundColor: colors.completedBadge }]}>
                                        <Text style={styles.completedText}>Hoàn thành</Text>
                                    </View>
                                )}
                                <Text style={[styles.expandIcon, { color: colors.expandIcon }]}>{isExpanded ? '−' : '+'}</Text>
                            </View>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: colors.accent }]}
                                />
                            </View>
                            <Text style={[styles.progressLabel, { color: colors.accent }]}>{item.progress}%</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={[styles.lessonsContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FAFBFF' }]}>
                        {item.lessons.map((lesson: any, idx: number) => (
                            <View
                                key={lesson.id}
                                style={[
                                    styles.lessonRow,
                                    idx === 0 && styles.firstLesson,
                                    idx === item.lessons.length - 1 && styles.lastLesson,
                                ]}
                            >
                                <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                                <Text style={[styles.lessonInfo, { color: colors.subText }]}>
                                    {lesson.date} • {lesson.duration} • {lesson.score}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Lịch sử</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={[styles.userHeader, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                </View>
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Người học'}</Text>
                    <Text style={[styles.statsText, { color: colors.subText }]}>
                        Đã hoàn thành {totalCompletedLessons} bài học
                    </Text>
                </View>
            </View>

            <FlatList
                data={courses}
                keyExtractor={(item) => item.courseId}
                renderItem={renderCourse}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
    emptyText: { fontSize: 16, textAlign: 'center', paddingHorizontal: 32 },
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
    userHeader: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
    },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    userInfo: { marginLeft: 12, justifyContent: 'center' },
    userName: { fontSize: 18, fontWeight: '600' },
    statsText: { fontSize: 14, marginTop: 2 },

    listContent: { padding: 16 },
    courseCard: { borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 6 },
    courseHeaderGradient: { padding: 16, borderRadius: 16 },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    titleContainer: { flex: 1 },
    courseTitle: { fontSize: 17, fontWeight: '700' },
    progressText: { fontSize: 13, marginTop: 4 },
    rightSection: { alignItems: 'flex-end' },
    completedBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginBottom: 4 },
    completedText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    expandIcon: { fontSize: 28, fontWeight: '300' },

    progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    progressBar: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    progressLabel: { marginLeft: 8, fontSize: 13, fontWeight: '600' },

    lessonsContainer: { paddingHorizontal: 16, paddingBottom: 12 },
    lessonRow: { paddingVertical: 10, paddingLeft: 12, borderLeftWidth: 3, marginLeft: 4 },
    firstLesson: { paddingTop: 12 },
    lastLesson: { paddingBottom: 8 },
    lessonTitle: { fontSize: 15, fontWeight: '600' },
    lessonInfo: { fontSize: 13, marginTop: 3 },
});
