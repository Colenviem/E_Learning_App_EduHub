import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../_layout';

import { API_BASE_URL } from '@/src/api';

export default function XemLaiScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    background: isDarkMode ? '#121212' : '#F8F9FA',
    cardBg: isDarkMode ? '#1E1E1E' : '#fff',
    text: isDarkMode ? '#FFF' : '#222',
    subText: isDarkMode ? '#AAA' : '#888',
    accent: '#5E72E4',
    border: isDarkMode ? '#333' : '#f0f0f0',
    emptyIcon: '#ccc',
    buttonText: '#fff',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          console.warn("Không tìm thấy userId trong AsyncStorage");
          setLoading(false);
          return;
        }

        const [userRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`),
          fetch(`${API_BASE_URL}/courses`),
        ]);

        if (!userRes.ok) throw new Error("Không lấy được dữ liệu người dùng");
        if (!coursesRes.ok) throw new Error("Không lấy được dữ liệu khóa học");

        const userData = await userRes.json();
        const coursesData = await coursesRes.json();

        const courseMap = Object.fromEntries(
          coursesData.map((c: any) => [c._id, c.title.replace(/^Learn\s+/i, '')])
        );

        const mergedCourses = userData.coursesInProgress.map((c: any) => {
          const title = courseMap[c.courseId] || c.courseId;
          const progressPercent = Math.round(c.progress * 100);
          return { ...c, title, progressPercent };
        });

        setUser(userData);
        setCourses(mergedCourses);
      } catch (e) {
        console.error('Lỗi fetch dữ liệu:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.subText }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const completedCourses = courses.filter(c => c.progressPercent === 100);
  const ongoingCourses = courses.filter(c => c.progressPercent < 100);

  const renderCourse = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="play-circle" size={28} color={colors.accent} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.lessonCount, { color: colors.subText }]}>Tiến độ: {item.progressPercent}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bài học</Text>
        <View style={{ width: 24 }} />
      </View>

      {completedCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color={colors.emptyIcon} />
          <Text style={[styles.emptyText, { color: colors.subText }]}>Bạn chưa có khóa học nào hoàn thành</Text>
          {ongoingCourses.length > 0 && (
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`../../saved`)}
            >
              <Text style={[styles.reviewButtonText, { color: colors.buttonText }]}>Ôn tập khóa học ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={completedCourses}
          keyExtractor={item => item.courseId}
          renderItem={renderCourse}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ongoingCourses.length > 0 ? (
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: colors.accent, marginBottom: 12 }]}
              onPress={() => router.push(`../../saved`)}
            >
              <Text style={[styles.reviewButtonText, { color: colors.buttonText }]}>Ôn tập khóa học đang học</Text>
            </TouchableOpacity>
          ) : null}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: { fontSize: 16, marginTop: 12, textAlign: 'center' },
  reviewButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  reviewButtonText: { fontWeight: 'bold', fontSize: 16 },
  headerTitle: {fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  iconContainer: { marginRight: 12 },
  titleContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  lessonCount: { fontSize: 13, marginTop: 4 },
});
