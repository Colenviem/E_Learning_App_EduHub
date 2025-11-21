import { API_BASE_URL } from '@/src/api';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuizComponent } from '../src/components/Quiz/QuizComponent';

// Thay đổi tên file placeholder (giả định đây là file ảnh)
const placeholderVideo = require('../assets/images/tets.jpg');

const COLORS = {
  background: '#FFFFFF',
  textPrimary: '#1E1E2A',
  textSecondary: '#6A6A6A',
  primary: '#A78BFA',
  border: '#E0E0E0'
};

const LESSON_API = `${API_BASE_URL}/lessons`;
const LESSON_DETAIL_API = `${API_BASE_URL}/lesson-details`;

interface LessonSummary {
  _id: string;
  [key: string]: any;
}

interface LessonDetail {
  _id: string;
  name: string;
  videoUrl?: string;
  tasks?: string[];
  quizzes?: any[];
  courseId?: string;
  [key: string]: any;
}

export default function ExerciseDetails() {
  const { id, courseId } = useLocalSearchParams<{ id: string, courseId: string }>();
  const router = useRouter();
  const { getItem } = useAsyncStorage('userId');

  const [allLessonSummaries, setAllLessonSummaries] = useState<LessonSummary[]>([]);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  /** ----------- FETCH ALL LESSONS ------------ */
  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`${LESSON_API}/course/${courseId}`);
      const lessons = Array.isArray(res.data) ? res.data : [res.data];
      // gom tất cả lesson_details thành một mảng duy nhất
      const allDetails = lessons.flatMap((lesson: any) => {
        const details = lesson?.lesson_details || [];
        return details.map((detail: LessonDetail) => ({
          ...detail,
          courseId: lesson?._id
        }));
      });
      setAllLessonSummaries(allDetails || []);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setAllLessonSummaries([]);
    }
  }, [courseId]);

  console.log("allLessonSummaries:", allLessonSummaries);
  console.log("Params:", { id, courseId });

  /** ----------- GET USER ID FROM ASYNC STORAGE ------------ */
  useEffect(() => {
    const loadUserId = async () => {
      const id = await getItem();
      setUserId(id);
    };
    loadUserId();
  }, [getItem]);

  /** ----------- UPDATE PROGRESS ------------ */
  const updateProgress = useCallback(async (completedLessons: number, totalLessons: number) => {
    if (!userId || !courseId) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/users/byAccount/${userId}/progress`,
        {
          courseId,
          completedLessons,
          totalLessons
        }
      );
      console.log(`✅ Progress updated: ${completedLessons}/${totalLessons}`);
    } catch (err) {
      console.error("❌ Error updating progress:", err);
    }
  }, [userId, courseId]);

  /** ----------- FETCH THE LESSON DETAIL ------------ */
  const fetchLessonDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingDetail(true);
      const res = await axios.get(`${LESSON_DETAIL_API}/detail/${id}`);
      setLessonDetail(res.data);
    } catch (err) {
      console.error("Error fetching lesson detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, [id]);

  /** ----------- LOAD DATA ------------ */
  useEffect(() => {
    fetchLessons();
    fetchLessonDetail();
  }, [fetchLessons, fetchLessonDetail]);

  /** ----------- UPDATE CURRENT INDEX ------------ */
  useEffect(() => {
    if (allLessonSummaries.length > 0) {
      const idx = allLessonSummaries.findIndex(item => item._id === id);
      setCurrentIndex(idx === -1 ? 0 : idx);
    }
  }, [allLessonSummaries, id]);

  /** ----------- NAVIGATION ------------ */
  const goPrev = () => {
    if (currentIndex <= 0) return Alert.alert("Thông báo", "Đây là bài đầu tiên!");
    const prevId = allLessonSummaries[currentIndex - 1]._id;
    router.replace({ pathname: "/lesson-details", params: { id: prevId, courseId } });
  };

  const goNext = () => {
    if (currentIndex >= allLessonSummaries.length - 1) {
      // Bài cuối cùng - cập nhật progress = 100%
      updateProgress(allLessonSummaries.length, allLessonSummaries.length);
      return Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả bài học!");
    }
    // Cập nhật progress: (bài hiện tại + 1) / tổng bài
    const nextIndex = currentIndex + 1;
    updateProgress(nextIndex, allLessonSummaries.length);

    const nextId = allLessonSummaries[nextIndex]._id;
    router.replace({ pathname: "/lesson-details", params: { id: nextId, courseId } });
  };

  /** ----------- LOADING STATE ------------ */
  if (loadingDetail || !lessonDetail) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={30} color={COLORS.primary} />
        <Text style={{ marginTop: 8 }}>Đang tải bài học...</Text>
      </View>
    );
  }

  /** ----------- UI RENDER ------------ */
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <FeatherIcon size={24} color="#fff" name="arrow-left" />
            </TouchableOpacity>

            <Text style={styles.courseTitle} numberOfLines={1}>
              {lessonDetail.name}
            </Text>

            <MaterialIcon name="notebook-outline" size={24} color="#fff" />
          </View>
        </View>

        {/* VIDEO - ĐÃ SỬA LỖI: Bọc trong View có padding ngang */}
        <View style={styles.videoPaddingWrapper}> 
          <View style={styles.videoWrapper}>
            {lessonDetail.videoUrl ? (
              <Video
                source={{ uri: lessonDetail.videoUrl }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN} 
                shouldPlay={false} 
              />
            ) : (
              <Image 
                source={placeholderVideo} 
                style={styles.videoPlayer} 
                resizeMode="cover" 
              />
            )}
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView style={styles.scroll}>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.sectionTitle}>Nội dung bài học:</Text>

            {lessonDetail.tasks?.map((t, i) => (
              <View key={i} style={styles.taskItem}>
                <Text style={styles.taskIndex}>{i + 1}.</Text>
                <Text style={styles.taskText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* QUIZ */}
          {Array.isArray(lessonDetail.quizzes) && lessonDetail.quizzes.length > 0 && (
            <View style={{ marginTop: 20, paddingHorizontal: 20, paddingBottom: 20 }}>
              <Text style={styles.quizTitle}>
                Bài kiểm tra nhanh ({lessonDetail.quizzes.length} câu)
              </Text>

              {lessonDetail.quizzes.map((quiz, i) => (
                <QuizComponent key={quiz._id} quiz={quiz} index={i} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]}
            onPress={goPrev}
            disabled={currentIndex <= 0}
          >
            <Text style={styles.footerText}>BÀI TRƯỚC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={goNext}>
            <Text style={styles.footerText}>
              {currentIndex >= allLessonSummaries.length - 1 ? "HOÀN THÀNH" : "BÀI TIẾP THEO"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { paddingTop: 50, paddingBottom: 15, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  courseTitle: { color: '#fff', fontWeight: '700', fontSize: 16, flex: 1, textAlign: 'center' },

  // STYLE MỚI CHO PADDING CỦA VIDEO
  videoPaddingWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },

  // VIDEO WRAPPER (giữ nguyên tỷ lệ 16:9, bỏ marginTop cũ)
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden', // QUAN TRỌNG: Ngăn chặn tràn khung hình
    justifyContent: 'center',
    alignItems: 'center'
  },

  // VIDEO PLAYER (lấp đầy wrapper)
  videoPlayer: {
    width: '100%',
    height: '100%'
  },
  scroll: { flex: 1, marginBottom: 80 }, // Giảm margin-bottom so với footer
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  taskItem: { flexDirection: 'row', padding: 12, backgroundColor: '#F7F7F7', borderRadius: 10, marginBottom: 10 },
  taskIndex: { marginRight: 10, fontWeight: '700', fontSize: 16 },
  taskText: { flex: 1, fontSize: 16 },
  quizTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  footer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: COLORS.border, position: 'absolute', bottom: 0, width: '100%', zIndex: 10 },
  footerButton: { flex: 1, backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, marginHorizontal: 5, alignItems: 'center' },
  footerText: { color: '#fff', fontWeight: '700' },
});