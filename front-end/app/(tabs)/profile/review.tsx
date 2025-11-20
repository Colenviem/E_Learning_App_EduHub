import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../_layout';

import { API_BASE_URL } from '@/src/api';

export default function OnTapScreen() {
  const [loading, setLoading] = useState(true);
  const [reviewLessons, setReviewLessons] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#F8F9FA',
    cardBg: isDarkMode ? '#1E1E1E' : '#fff',
    text: isDarkMode ? '#FFF' : '#222',
    subText: isDarkMode ? '#AAA' : '#888',
    accent: '#4A4AFF',
    alert: '#FF6B6B',
    border: isDarkMode ? '#333' : '#f0f0f0',
    emptyIcon: '#4CAF50',
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
        setUserId(storedUserId);

        const [userRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`),
          fetch(`${API_BASE_URL}/courses`),
        ]);

        if (!userRes.ok) throw new Error("Không lấy được dữ liệu người dùng");
        if (!coursesRes.ok) throw new Error("Không lấy được dữ liệu khóa học");

        const userData = await userRes.json();
        const coursesData = await coursesRes.json();

        const courseMap = Object.fromEntries(coursesData.map((c: any) => [c._id, c]));

        const lessons = userData.coursesInProgress
          .map((c: any) => {
            const course = courseMap[c.courseId];
            if (!course) return null;

            const progressPercent = Math.round(c.progress * 100);
            const daysSinceReview = Math.floor(Math.random() * 7);
            const needsReview = daysSinceReview >= 2 || progressPercent < 70;

            return {
              id: c.courseId,
              title: course.title.replace(/^Learn\s+/i, ''),
              image: course.image,
              progress: progressPercent,
              lastReviewed: formatDate(subDays(new Date(), daysSinceReview)),
              needsReview,
              reviewPriority: needsReview ? 'high' : 'normal',
            };
          })
          .filter(Boolean);

        lessons.sort((a: any, b: any) => (b.needsReview ? 1 : 0) - (a.needsReview ? 1 : 0));

        setUser(userData);
        setReviewLessons(lessons);
      } catch (err) {
        console.error('Lỗi fetch dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const subDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hôm nay';
    if (diff === 1) return 'Hôm qua';
    return `${diff} ngày trước`;
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.subText }]}>Đang tải bài ôn tập...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: item.needsReview ? colors.alert : colors.border },
        item.needsReview && { backgroundColor: isDarkMode ? '#3A0000' : '#FFF5F5' },
      ]}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name={item.needsReview ? 'alert-circle' : 'book'}
            size={26}
            color={item.needsReview ? colors.alert : colors.accent}
          />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.lastReviewed, { color: colors.subText }]}>
            {item.needsReview ? 'Cần ôn ngay!' : `Ôn lại: ${item.lastReviewed}`}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#333' : '#E3E3FF' }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%`,
                backgroundColor: item.needsReview ? colors.alert : colors.accent,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: item.needsReview ? colors.alert : colors.accent }]}>
          {item.progress}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ôn tập</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.subText }]}>Ôn tập hôm nay</Text>
          <Text style={[styles.streak, { color: colors.text }]}>
            <Ionicons name="flame" size={18} color={colors.alert} /> {user?.streak || 0} ngày liên tục
          </Text>
        </View>
        <View style={styles.reviewCount}>
          <Text style={[styles.reviewCountText, { color: colors.accent }]}>
            {reviewLessons.filter(l => l.needsReview).length}
          </Text>
          <Text style={[styles.reviewLabel, { color: colors.subText }]}>cần ôn</Text>
        </View>
      </View>

      {reviewLessons.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color={colors.emptyIcon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Tuyệt vời!</Text>
          <Text style={[styles.emptyText, { color: colors.subText }]}>Bạn đã ôn tập đầy đủ.</Text>
        </View>
      ) : (
        <FlatList
          data={reviewLessons}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {reviewLessons.filter(l => l.needsReview).length > 0
                ? 'Ưu tiên ôn tập hôm nay'
                : 'Các khóa học đã học'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 15 },
  streak: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  reviewCount: { alignItems: 'center' },
  reviewCountText: { fontSize: 24, fontWeight: 'bold' },
  reviewLabel: { fontSize: 12 },

  listContent: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, paddingHorizontal: 4 },

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
  iconWrapper: { marginRight: 12, justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  lastReviewed: { fontSize: 13, marginTop: 4, fontWeight: '500' },

  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden', marginRight: 12 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', minWidth: 40, textAlign: 'right' },

  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  emptyText: { fontSize: 15, marginTop: 8, textAlign: 'center' },
});
