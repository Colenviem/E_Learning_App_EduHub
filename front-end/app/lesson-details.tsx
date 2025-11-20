import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuizComponent } from '../src/components/Quiz/QuizComponent';

const placeholderVideo = require('../assets/images/tets.jpg');

const COLORS = {
  background: '#FFFFFF',
  textPrimary: '#1E1E2A',
  textSecondary: '#6A6A6A',
  primary: '#A78BFA',
  accent: '#FF4D4D',
  border: '#E0E0E0',
  buttonBg: '#EAF4FF',
};

const LESSON_API = "http://192.168.0.102:5000/lessons";
const LESSON_DETAIL_API = "http://192.168.0.102:5000/lesson-details";

export default function ExerciseDetails() {
  const { id, courseId } = useLocalSearchParams();
  const [allLessonSummaries, setAllLessonSummaries] = useState<{ _id: string; name: string; time: string }[]>([]);
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();

  const fetchLessonDetail = useCallback(async () => {
    if (!id) return;
    const res = await axios.get(`${LESSON_DETAIL_API}/${id}`);
    setLessonDetail(res.data);
  }, [id]);

  const fetchLessonSummaries = useCallback(async () => {
    if (!courseId) return;

    const res = await axios.get(`${LESSON_API}/${courseId}`);

    const lessons = Array.isArray(res.data) ? res.data : [res.data];
    const details = lessons.flatMap(l => l.lesson_details);

    setAllLessonSummaries(details);

    const index = details.findIndex(d => d._id === id);

    setCurrentIndex(index >= 0 ? index : 0);
  }, [courseId, id]);


  useEffect(() => {
    fetchLessonDetail();
    fetchLessonSummaries();
  }, [fetchLessonDetail, fetchLessonSummaries]);

  const handleGoBack = useCallback(() => router.back(), []);

  const handleGoPrevious = async () => {
    if (currentIndex > 0) {
      const prevDetailId = allLessonSummaries[currentIndex - 1]._id;
      router.replace({ pathname: "/lesson-details", params: { id: prevDetailId, courseId } });
    } else {
      Alert.alert('Thông báo', 'Đây là bài đầu tiên.');
    }
  };

  const handleGoNext = async () => {
    if (currentIndex < allLessonSummaries.length - 1) {
      const nextDetailId = allLessonSummaries[currentIndex + 1]._id;
      router.replace({ pathname: "/lesson-details", params: { id: nextDetailId, courseId } });
    } else {
      Alert.alert('Thông báo', 'Đây là bài cuối cùng.');
    }
  };

  if (!lessonDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size={20} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
              <FeatherIcon size={24} color={COLORS.background} name="arrow-left" />
            </TouchableOpacity>
            <Text style={styles.courseTitle} numberOfLines={1}>{lessonDetail.name}</Text>
            <View style={styles.headerRight}>
              <Text style={styles.progressText}>{lessonDetail.time}</Text>
              <MaterialIcon name="notebook-outline" size={24} color={COLORS.background} />
            </View>
          </View>
        </View>

        <View style={styles.videoWrapper}>
          {lessonDetail.videoUrl ? (
            <Video
              source={{ uri: lessonDetail.videoUrl }}
              style={{ width: '100%', height: '100%' }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          ) : (
            <Image source={placeholderVideo} style={styles.video} resizeMode="cover" />
          )}
        </View>

        <ScrollView style={styles.contentScroll}>
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Nội dung bài học:</Text>
            {lessonDetail.tasks.map((task: string, i: number) => (
              <View key={i} style={styles.taskItem}>
                <Text style={styles.taskIndex}>{i + 1}.</Text>
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>

          {lessonDetail.quizzes && lessonDetail.quizzes.length > 0 && (
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 8, marginBottom: 12 }}>
                Bài kiểm tra nhanh ({lessonDetail.quizzes.length} câu)
              </Text>
              {lessonDetail.quizzes.map((quiz: any, i: number) => (
                <QuizComponent key={quiz._id} quiz={quiz} index={i} />
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]}
            onPress={handleGoPrevious}
            disabled={currentIndex <= 0}
          >
            <Text style={styles.footerButtonText}>BÀI TRƯỚC</Text>
          </TouchableOpacity>

          {currentIndex < allLessonSummaries.length - 1 ? (
            <TouchableOpacity style={styles.footerButton} onPress={handleGoNext}>
              <Text style={styles.footerButtonText}>BÀI TIẾP THEO</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                Alert.alert('Hoàn thành', 'Bạn đã hoàn thành tất cả các bài học!');
                router.back();
              }}
            >
              <Text style={styles.footerButtonText}>HOÀN THÀNH</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { paddingTop: 50, backgroundColor: COLORS.primary, paddingBottom: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerButton: { padding: 5 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: COLORS.background, flex: 1, textAlign: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressText: { fontSize: 12, fontWeight: '600', color: COLORS.background },
  videoWrapper: { height: 220, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  video: { width: '100%', height: '100%' },
  contentScroll: { flex: 1, marginTop: 15, marginBottom: 80 },
  contentContainer: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  taskItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start', backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10 },
  taskIndex: { fontWeight: '700', marginRight: 10, fontSize: 16 },
  taskText: { flex: 1, fontSize: 16, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.border },
  footerButton: { flex: 1, padding: 14, marginHorizontal: 5, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
  footerButtonText: { color: COLORS.background, fontWeight: '700', fontSize: 14 }
});
