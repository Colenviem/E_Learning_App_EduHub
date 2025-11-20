import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_BASE_URL } from '@/src/api';

export default function LichSuScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

    // -------- FETCH DỮ LIỆU -------- //
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
                    coursesData.map((c: any) => [c._id, c.title])
                );

                const groupedCourses = (userData.coursesInProgress || []).map((c: any) => {
                    const completed = c.completedLessons || 0;
                    const total = c.totalLessons || 1;

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
                        totalLessons: total,
                        completedLessons: completed,
                        progress: Math.round((completed / total) * 100),
                        lastAccessed: c.lastAccessed,
                        lessons,
                        isCompleted: completed === total,
                    };
                });

                setUser(userData);
                setCourses(groupedCourses);
            } catch (err) {
                console.log('Lỗi:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // -------- EXPAND -------- //
    const toggleExpand = (courseId: string) => {
        setExpandedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );
    };

    // -------- UI LOADING -------- //
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#5E72E4" />
                <Text style={{ marginTop: 10, color: '#888' }}>Đang tải lịch sử...</Text>
            </View>
        );
    }

    // -------- UI RỖNG -------- //
    if (!user || courses.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="chevron-left" size={26} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lịch sử</Text>
                    <View style={{ width: 30 }} />
                </View>

                <View style={styles.center}>
                    <Text style={{ color: '#777' }}>Bạn chưa thực hành bài học nào.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // -------- RENDER COURSE -------- //
    const renderCourse = ({ item }: any) => {
        const isExpanded = expandedCourses.includes(item.courseId);

        return (
            <View style={styles.courseCard}>
                <TouchableOpacity onPress={() => toggleExpand(item.courseId)}>
                    <LinearGradient
                        colors={['#FFFFFF', '#F0F2FF']}
                        style={styles.courseHeaderGradient}
                    >
                        <View style={styles.courseHeader}>
                            <Text style={styles.courseTitle}>{item.title}</Text>
                            <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
                        </View>

                        <Text style={styles.progressText}>
                            {item.completedLessons}/{item.totalLessons} bài — {item.progress}%
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.lessonsContainer}>
                        {item.lessons.map((lesson: any) => (
                            <View key={lesson.id} style={styles.lessonRow}>
                                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                <Text style={styles.lessonInfo}>
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
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={26} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử</Text>
                <View style={{ width: 30 }} />
            </View>

            {/* DANH SÁCH */}
            <FlatList
                data={courses}
                keyExtractor={(item) => item.courseId}
                renderItem={renderCourse}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        paddingTop: 30,
        paddingBottom: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

    courseCard: {
        marginBottom: 16,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    courseHeaderGradient: { padding: 16 },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    courseTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    expandIcon: { fontSize: 28, color: '#5E72E4' },
    progressText: { marginTop: 4, color: '#555' },

    lessonsContainer: { padding: 12, backgroundColor: '#FAFBFF' },
    lessonRow: { marginBottom: 10 },
    lessonTitle: { fontSize: 15, fontWeight: '600' },
    lessonInfo: { marginTop: 3, color: '#666' },
});
