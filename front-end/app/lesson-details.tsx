import { API_BASE_URL } from '@/src/api';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuizComponent } from '../src/components/Quiz/QuizComponent';

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

export default function ExerciseDetails() {
  const { id, courseId } = useLocalSearchParams<{ id: string; courseId: string }>();
  const router = useRouter();
  const { getItem } = useAsyncStorage('userId');

  const [allLessonSummaries, setAllLessonSummaries] = useState<any[]>([]);
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [secondsLearning, setSecondsLearning] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLearning(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

 // ==========================
// GỬI THỜI GIAN HỌC
// ==========================
const sendLearningActivity = useCallback(async () => {
  if (!userId || !lessonDetail?._id) return;

  try {
    await axios.post(`${API_BASE_URL}/lesson-details/update`, {
      userId,
      lessonDetailId: lessonDetail._id,
      seconds: secondsLearning
    });

    console.log("Đã cộng thời gian học:", secondsLearning);

  } catch (err) {
    console.log("Learning activity error:", err);
  }
}, [userId, lessonDetail, secondsLearning]);


// ==========================
// XỬ LÝ NÚT BACK
// ==========================
const handleBack = async () => {
  await sendLearningActivity();
  setSecondsLearning(0);
  router.back();
};


// ==========================
// XỬ LÝ NÚT NEXT
// ==========================
const goNext = async () => {
  await sendLearningActivity();
  setSecondsLearning(0);

  if (currentIndex >= allLessonSummaries.length - 1) {
    updateProgress(allLessonSummaries.length, allLessonSummaries.length);
    return Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả bài học!");
  }

  const nextIndex = currentIndex + 1;
  updateProgress(nextIndex, allLessonSummaries.length);

  router.replace({
    pathname: "/lesson-details",
    params: {
      id: allLessonSummaries[nextIndex]._id,
      courseId
    }
  });
};


// ==========================
// NÚT BÀI TRƯỚC
// ==========================
<TouchableOpacity
  style={[styles.footerButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]}
  onPress={async () => {
    await sendLearningActivity();
    setSecondsLearning(0);

    router.replace({
      pathname: "/lesson-details",
      params: {
        id: allLessonSummaries[currentIndex - 1]?._id,
        courseId
      }
    });
  }}
  disabled={currentIndex <= 0}
>
  <Text style={styles.footerText}>BÀI TRƯỚC</Text>
</TouchableOpacity>


  useEffect(() => {
    const loadUserId = async () => {
      const id = await getItem();
      setUserId(id);
    };
    loadUserId();
  }, []);

  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`${LESSON_API}/course/${courseId}`);
      const lessons = Array.isArray(res.data) ? res.data : [res.data];

      const allDetails = lessons.flatMap((lesson: any) => {
        const details = lesson?.lesson_details || [];
        return details.map((detail: any) => ({
          ...detail,
          courseId: lesson?._id
        }));
      });

      setAllLessonSummaries(allDetails);
    } catch (err) {
      setAllLessonSummaries([]);
    }
  }, [courseId]);

  const fetchLessonDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingDetail(true);
      const res = await axios.get(`${LESSON_DETAIL_API}/detail/${id}`);
      setLessonDetail(res.data);
    } catch (err) {
    } finally {
      setLoadingDetail(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLessons();
    fetchLessonDetail();
  }, [fetchLessons, fetchLessonDetail]);

  useEffect(() => {
    if (allLessonSummaries.length > 0) {
      const idx = allLessonSummaries.findIndex(item => item._id === id);
      setCurrentIndex(idx === -1 ? 0 : idx);
    }
  }, [allLessonSummaries, id]);

  const updateProgress = useCallback(
    async (completedLessons: number, totalLessons: number) => {
      if (!userId || !courseId) return;
      try {
        await axios.patch(`${API_BASE_URL}/users/byAccount/${userId}/progress`, {
          courseId,
          completedLessons,
          totalLessons
        });
      } catch (err) {}
    },
    [userId, courseId]
  );

  // const handleBack = async () => {
  //   await sendLearningActivity();
  //   setSecondsLearning(0);
  //   router.back();
  // };

  // const goNext = async () => {
  //   await sendLearningActivity();
  //   setSecondsLearning(0);

  //   if (currentIndex >= allLessonSummaries.length - 1) {
  //     updateProgress(allLessonSummaries.length, allLessonSummaries.length);
  //     return Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả bài học!");
  //   }

  //   const nextIndex = currentIndex + 1;
  //   updateProgress(nextIndex, allLessonSummaries.length);

  //   router.replace({
  //     pathname: "/lesson-details",
  //     params: {
  //       id: allLessonSummaries[nextIndex]._id,
  //       courseId
  //     }
  //   });
  // };

  if (loadingDetail || !lessonDetail) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={30} color={COLORS.primary} />
        <Text style={{ marginTop: 8 }}>Đang tải bài học...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <FeatherIcon size={24} color="#fff" name="arrow-left" />
            </TouchableOpacity>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {lessonDetail.name}
            </Text>
            <MaterialIcon name="notebook-outline" size={24} color="#fff" />
          </View>
        </View>

        <View style={styles.videoPaddingWrapper}>
          <View style={styles.videoWrapper}>
            {lessonDetail.videoUrl ? (
              <Video
                source={{ uri: lessonDetail.videoUrl }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Image source={placeholderVideo} style={styles.videoPlayer} resizeMode="cover" />
            )}
          </View>
        </View>

        <ScrollView style={styles.scroll}>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.sectionTitle}>Nội dung bài học:</Text>

            {lessonDetail.tasks?.map((t: string, i: number) => (
              <View key={i} style={styles.taskItem}>
                <Text style={styles.taskIndex}>{i + 1}.</Text>
                <Text style={styles.taskText}>{t}</Text>
              </View>
            ))}
          </View>

          {Array.isArray(lessonDetail.quizzes) && lessonDetail.quizzes.length > 0 && (
            <View style={{ marginTop: 20, paddingHorizontal: 20, paddingBottom: 20 }}>
              <Text style={styles.quizTitle}>
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
            onPress={async () => {
              await sendLearningActivity();
              setSecondsLearning(0);
              router.replace({
                pathname: "/lesson-details",
                params: {
                  id: allLessonSummaries[currentIndex - 1]?._id,
                  courseId
                }
              });
            }}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  courseTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center'
  },
  videoPaddingWrapper: { paddingHorizontal: 20, marginTop: 15, marginBottom: 10 },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPlayer: { width: '100%', height: '100%' },
  scroll: { flex: 1, marginBottom: 80 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  taskItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    marginBottom: 10
  },
  taskIndex: { marginRight: 10, fontWeight: '700', fontSize: 16 },
  taskText: { flex: 1, fontSize: 16 },
  quizTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  footer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10
  },
  footerButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  footerText: { color: '#fff', fontWeight: '700' }
});
