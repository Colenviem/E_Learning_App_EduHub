import { Ionicons } from '@expo/vector-icons';
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

const API_BASE_URL = 'http://192.168.0.102:5000';
const USER_ID = 'USER010';

export default function XemLaiScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${USER_ID}`),
          fetch(`${API_BASE_URL}/courses`),
        ]);

        const userData = await userRes.json();
        const coursesData = await coursesRes.json();

        const courseMap = Object.fromEntries(
          coursesData.map((c: any) => [c._id, c.title.replace(/^Learn\s+/i, '')])
        );

        const mergedCourses = userData.coursesInProgress.map((c: any) => {
          const title = courseMap[c.courseId] || c.courseId;
          const progressPercent = Math.round(c.progress * 100);
          return {
            ...c,
            title,
            progressPercent,
          };
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5E72E4" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const completedCourses = courses.filter(c => c.progressPercent === 100);
  const ongoingCourses = courses.filter(c => c.progressPercent < 100);

  const renderCourse = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="play-circle" size={28} color="#5E72E4" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.lessonCount}>Tiến độ: {item.progressPercent}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Bài học',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {completedCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có khóa học nào hoàn thành</Text>
          {ongoingCourses.length > 0 && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => router.push(`../../saved`)}
            >
              <Text style={styles.reviewButtonText}>Ôn tập khóa học ngay</Text>
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
          ListHeaderComponent={
            ongoingCourses.length > 0 ? (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => router.push(`../../saved`)}
              >
                <Text style={styles.reviewButtonText}>Ôn tập khóa học đang học</Text>
              </TouchableOpacity>
            ) : null
          }

        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12, textAlign: 'center' },
  reviewButton: {
    marginTop: 16,
    backgroundColor: '#5E72E4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  reviewButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  listContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  iconContainer: { marginRight: 12 },
  titleContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: '#222', lineHeight: 22 },
  lessonCount: { fontSize: 13, color: '#888', marginTop: 4 },
});
