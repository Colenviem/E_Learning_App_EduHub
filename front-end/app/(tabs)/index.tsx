import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import CourseList from '../../components/CourseList';
import FeaturedCard from '../../components/FeaturedCard';
import Header from '../../components/Header';
import ProgressStatus from '../../components/ProgressStatus';
import { colors, spacing } from '../../constants/theme';

interface Course {
  id: string;
  title: string;
  lessons: number;
  duration: string;
  rating: number;
  imageUri: string;
}

const API_URL = 'https://68fb3d8294ec9606602533ff.mockapi.io/api/popularCourses';

const FALLBACK_POPULAR_COURSES: Course[] = [
  { id: 'pc1', title: 'Lớp học chính về React Native (Dự phòng)', lessons: 28, duration: '6h 30 phút', rating: 4.9, imageUri: 'https://picsum.photos/seed/rn/200/120' },
  { id: 'pc2', title: 'Thiết kế giao diện UI/UX với Figma (Dự phòng)', lessons: 15, duration: '4h 15 phút', rating: 4.7, imageUri: 'https://picsum.photos/seed/figma/200/120' },
];
const FALLBACK_NEW_COURSES: Course[] = [
  { id: 'nc1', title: 'Xây dựng API với Node.js và Express (Dự phòng)', lessons: 22, duration: '5h 50 phút', rating: 4.6, imageUri: 'https://picsum.photos/seed/node/200/120' },
  { id: 'nc2', title: 'Học Tailwind CSS từ cơ bản (Dự phòng)', lessons: 18, duration: '3h 45 phút', rating: 4.5, imageUri: 'https://picsum.photos/seed/tailwind/200/120' },
];

let ALL_COURSES_CACHE: Course[] = [...FALLBACK_POPULAR_COURSES, ...FALLBACK_NEW_COURSES];

export const getCourseData = () => ALL_COURSES_CACHE;

export default function HomeScreen() {
  const [popularCourses, setPopularCourses] = useState<Course[]>(FALLBACK_POPULAR_COURSES);
  const [newCourses, setNewCourses] = useState<Course[]>(FALLBACK_NEW_COURSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API failed with status ${res.status}`);
        const data: Course[] = await res.json();
        setPopularCourses(data);
        setNewCourses(data);

        ALL_COURSES_CACHE = data;

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu từ API. Đang sử dụng dữ liệu dự phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const bottomSpacer = { height: 100 };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={{ marginTop: spacing.md }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  const errorBar = error ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  ) : null;


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {errorBar}

        <View style={styles.verticalContentWrapper}>
          <Header name="Hoang Anh" />
          <FeaturedCard />
          <ProgressStatus coursesInProgress={3} weeklyProgress={75} />
          <View style={styles.spacer} />
        </View>

        <CourseList
          title="Bài học phổ biến"
          data={popularCourses}
        />

        <CourseList
          title="Bài học mới"
          data={newCourses}
        />

        <View style={bottomSpacer} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  verticalContentWrapper: {
    paddingHorizontal: spacing.screenPadding,
  },
  spacer: {
    height: spacing.lg,
  },
  errorContainer: {
    padding: spacing.sm,
    marginHorizontal: spacing.screenPadding,
    borderRadius: 5,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.textLight,
    textAlign: 'center',
  }
});