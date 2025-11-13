import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE_URL = 'http://192.168.0.102:5000';
const USER_ID = 'USER010';

export default function OnTapScreen() {
  const [loading, setLoading] = useState(true);
  const [reviewLessons, setReviewLessons] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

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
          coursesData.map((c: any) => [c._id, c])
        );

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

        lessons.sort((a : any, b : any) => (b.needsReview ? 1 : 0) - (a.needsReview ? 1 : 0));

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A4AFF" />
        <Text style={styles.loadingText}>Đang tải bài ôn tập...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, item.needsReview && styles.priorityCard]} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name={item.needsReview ? 'alert-circle' : 'book'}
            size={26}
            color={item.needsReview ? '#FF6B6B' : '#4A4AFF'}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.lastReviewed}>
            {item.needsReview ? 'Cần ôn ngay!' : `Ôn lại: ${item.lastReviewed}`}
          </Text>
        </View>
      </View>

  
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%`,
                backgroundColor: item.needsReview ? '#FF6B6B' : '#4A4AFF',
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, item.needsReview && { color: '#FF6B6B' }]}>
          {item.progress}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Ôn tập',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ôn tập hôm nay</Text>
          <Text style={styles.streak}>
            <Ionicons name="flame" size={18} color="#FF6B6B" /> {user?.streak || 0} ngày liên tục
          </Text>
        </View>
        <View style={styles.reviewCount}>
          <Text style={styles.reviewCountText}>
            {reviewLessons.filter(l => l.needsReview).length}
          </Text>
          <Text style={styles.reviewLabel}>cần ôn</Text>
        </View>
      </View>

      {reviewLessons.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
          <Text style={styles.emptyTitle}>Tuyệt vời!</Text>
          <Text style={styles.emptyText}>Bạn đã ôn tập đầy đủ.</Text>
        </View>
      ) : (
        <FlatList
          data={reviewLessons}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: { fontSize: 15, color: '#555' },
  streak: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 },
  reviewCount: {
    alignItems: 'center',
  },
  reviewCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4AFF',
  },
  reviewLabel: {
    fontSize: 12,
    color: '#666',
  },

  listContent: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  priorityCard: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
    backgroundColor: '#FFF5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconWrapper: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    lineHeight: 22,
  },
  lastReviewed: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    fontWeight: '500',
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E3E3FF',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A4AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4AFF',
    minWidth: 40,
    textAlign: 'right',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
});