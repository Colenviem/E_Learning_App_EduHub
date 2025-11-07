import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

interface IExercise {
  id: string;
  name: string;
  videoTitle: string;
  tasks: string[];
}

const getExerciseData = (exerciseId: string): IExercise => ({
  id: exerciseId,
  name: 'Thiết lập môi trường & Hello World',
  videoTitle: 'Cài đặt Node.js và Express cơ bản',
  tasks: [
    'Thiết lập môi trường phát triển Node.js (cài đặt npm/yarn).',
    'Tạo một dự án ExpressJS mới và cấu hình cổng (port).',
    'Viết route đầu tiên trả về dòng chữ "Hello World" khi truy cập /.',
    'Sử dụng Postman hoặc trình duyệt để kiểm tra kết quả.',
  ],
});

export default function ExerciseDetails() {
  const params = useLocalSearchParams<{ id: string; course_id: string; lessonNumber: string }>();
  
  const exercise = getExerciseData(params.id || 'ex-1');
  const exerciseNumber = parseInt(params.lessonNumber || '1');

  const handleGoBack = useCallback(() => router.back(), []);

  const handleGoPreviousExercise = useCallback(() => {
    if (exerciseNumber > 1) {
      router.push({
        pathname: '/exercise-details',
        params: { id: `ex-${exerciseNumber - 1}`, course_id: params.course_id, lessonNumber: String(exerciseNumber - 1) },
      });
    } else Alert.alert('Thông báo', 'Đây là bài tập đầu tiên.');
  }, [exerciseNumber, params.course_id]);

  const handleGoNextExercise = useCallback(() => {
    router.push({
      pathname: '/exercise-details',
      params: { id: `ex-${exerciseNumber + 1}`, course_id: params.course_id, lessonNumber: String(exerciseNumber + 1) },
    });
  }, [exerciseNumber, params.course_id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        
      
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.headerButton} activeOpacity={0.7}>
                    <FeatherIcon size={24} color={COLORS.background} name="arrow-left" />
                </TouchableOpacity>

                <Text style={styles.courseTitle} numberOfLines={1}>Node & ExpressJS</Text>

                <View style={styles.headerRight}>
                    <Text style={styles.progressText}>0%</Text>
                    <MaterialIcon name="notebook-outline" size={24} color={COLORS.background} />
                </View>
            </View>
        </View>

        <View style={styles.videoWrapper}>
          <Image source={placeholderVideo} style={styles.video} resizeMode="cover" />
          <TouchableOpacity style={styles.playButton}>
            <MaterialIcon name="play-circle" size={80} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>

            <Text style={[styles.mainTitle, { color: COLORS.textPrimary }]}>
                📝 Bài Tập {exerciseNumber}
            </Text>
            <Text style={[styles.exerciseName, { color: COLORS.textPrimary }]}>
                {exercise.name}
            </Text>

            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
                Nội dung Yêu cầu chi tiết:
            </Text>
            
            {exercise.tasks.map((task, index) => (
                <View key={index} style={styles.taskItem}>
                    <Text style={[styles.taskIndex, { color: COLORS.primary }]}>-</Text>
                    <Text style={[styles.taskText, { color: COLORS.textPrimary }]}>{task}</Text>
                </View>
            ))}
            
            <View style={styles.noteBox}>
                <FeatherIcon name="info" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={[styles.noteText, { color: COLORS.textSecondary }]}>
                    Hãy hoàn thành bài tập này để củng cố kiến thức từ video bài giảng.
                </Text>
            </View>

          </View>
          <View style={{ height: 100 }} /> 
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.footerButton, styles.buttonOutline, { opacity: exerciseNumber > 1 ? 1 : 0.5 }]}
            onPress={handleGoPreviousExercise}
            disabled={exerciseNumber <= 1}
          >
            <Text style={[styles.footerButtonText, styles.buttonOutlineText]}>
                <FeatherIcon name="arrow-left" size={16} color={COLORS.primary} /> BÀI TRƯỚC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.footerButton, styles.buttonPrimary]}
            onPress={handleGoNextExercise}
          >
            <Text style={[styles.footerButtonText, styles.buttonPrimaryText]}>
                BÀI TIẾP THEO <FeatherIcon name="arrow-right" size={16} color={COLORS.background} />
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.chatIcon}>
            <FeatherIcon name="message-square" size={24} color={COLORS.background} />
        </TouchableOpacity>
        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  headerContainer: {
    paddingTop: 50, 
    backgroundColor: COLORS.primary, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  headerButton: { padding: 5 },
  courseTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.background, 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },

  videoWrapper: {
    width: '100%',
    height: 200, 
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: { 
    width: '100%', 
    height: '100%', 
    opacity: 0.6, 
  },
  playButton: {
    position: 'absolute',
    padding: 10,
  },


  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 30, 
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  taskIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    lineHeight: 24,
    paddingTop: 0, 
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 115, 232, 0.08)', 
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textSecondary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: COLORS.buttonBg, 
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary, 
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  buttonOutlineText: {
    color: COLORS.primary,
  },
  buttonPrimaryText: {
    color: COLORS.background,
  },


  chatIcon: {
    position: 'absolute',
    bottom: 80, 
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});